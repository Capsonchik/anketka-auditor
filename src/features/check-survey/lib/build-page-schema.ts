import * as yup from 'yup'

import type { PublicPaQuestion } from '@/entities/public-pa'
import { questionAnswerKey } from '@/entities/public-pa'

import { isQuestionAnswerFilled } from './survey-logic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Допускаем +7… / 8… и цифры с пробелами/скобками */
const PHONE_RE = /^\+?[\d\s()-]{10,20}$/

function requiredMessage(question: PublicPaQuestion): string {
  return `Заполните поле «${question.title}»`
}

function isEmptyValue(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return !value.trim()
  if (Array.isArray(value)) return value.length === 0
  return false
}

/** Правила yup по типу вопроса + question.required */
export function buildQuestionSchema(question: PublicPaQuestion): yup.AnySchema {
  const type = String(question.type || '').toLowerCase()
  const reqMsg = requiredMessage(question)

  if (type === 'intro') {
    return yup.mixed().nullable().notRequired()
  }

  if (type === 'email') {
    return yup
      .mixed()
      .nullable()
      .test('email-format', 'Некорректный email', (value) => {
        if (isEmptyValue(value)) return !question.required
        return typeof value === 'string' && EMAIL_RE.test(value.trim())
      })
      .test('email-required', reqMsg, (value) => {
        if (!question.required) return true
        return typeof value === 'string' && value.trim().length > 0
      })
  }

  if (type === 'phone') {
    return yup
      .mixed()
      .nullable()
      .test('phone-format', 'Некорректный телефон', (value) => {
        if (isEmptyValue(value)) return !question.required
        return typeof value === 'string' && PHONE_RE.test(value.trim())
      })
      .test('phone-required', reqMsg, (value) => {
        if (!question.required) return true
        return typeof value === 'string' && value.trim().length > 0
      })
  }

  if (type === 'number' || type === 'money' || type === 'integer' || type === 'decimal') {
    return yup
      .mixed()
      .nullable()
      .test('number-format', 'Введите число', (value) => {
        if (isEmptyValue(value)) return !question.required
        if (typeof value === 'number') return Number.isFinite(value)
        if (typeof value === 'string') {
          const n = Number(value.replace(',', '.').trim())
          return value.trim() !== '' && Number.isFinite(n)
        }
        return false
      })
      .test('number-required', reqMsg, (value) => {
        if (!question.required) return true
        return isQuestionAnswerFilled(question, value)
      })
  }

  if (type === 'boolean') {
    return yup
      .mixed()
      .nullable()
      .test('boolean-required', reqMsg, (value) => {
        if (!question.required) return true
        return value === true
      })
  }

  if (
    type === 'multi_choice' ||
    type === 'multiselect' ||
    type === 'checkbox' ||
    type === 'rank' ||
    type === 'photo'
  ) {
    return yup
      .mixed()
      .nullable()
      .test('array-required', reqMsg, (value) => {
        if (!question.required) return true
        return Array.isArray(value) && value.length > 0
      })
  }

  if (type === 'matrix') {
    return yup
      .mixed()
      .nullable()
      .test('matrix-required', reqMsg, (value) => {
        if (!question.required) return true
        return isQuestionAnswerFilled(question, value)
      })
  }

  if (type === 'nps' || type === 'scale') {
    return yup
      .mixed()
      .nullable()
      .test('scale-required', reqMsg, (value) => {
        if (!question.required) return true
        return typeof value === 'string' && value.trim().length > 0
      })
  }

  if (type === 'date' || type === 'datetime' || type === 'time') {
    return yup
      .mixed()
      .nullable()
      .test('date-required', reqMsg, (value) => {
        if (!question.required) return true
        return typeof value === 'string' && value.trim().length > 0
      })
  }

  // text / single / radio / multi_choice / long_text / …
  return yup
    .mixed()
    .nullable()
    .test('filled-required', reqMsg, (value) => {
      if (!question.required) return true
      return isQuestionAnswerFilled(question, value)
    })
}

export function buildPageSchema(questions: PublicPaQuestion[]) {
  const shape: Record<string, yup.AnySchema> = {}
  for (const question of questions) {
    const code = questionAnswerKey(question)
    if (!code) continue
    shape[code] = buildQuestionSchema(question)
  }
  return yup.object().shape(shape)
}

export function buildPageDefaultValues(
  questions: PublicPaQuestion[],
  answers: Record<string, unknown>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const question of questions) {
    const code = questionAnswerKey(question)
    if (!code) continue
    values[code] = answers[code] ?? null
  }
  return values
}

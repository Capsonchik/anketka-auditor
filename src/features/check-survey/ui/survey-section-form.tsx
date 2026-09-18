'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  type ReactNode,
} from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import type { PublicPaQuestion } from '@/entities/public-pa'
import { questionAnswerKey } from '@/entities/public-pa'

import type { AnswersMap } from '../lib/answer-model'
import { buildPageDefaultValues, buildPageSchema } from '../lib/build-page-schema'

export type SurveySectionFormHandle = {
  /** Валидация видимых полей секции; при ошибках фокус на первое */
  trigger: () => Promise<boolean>
}

type SurveySectionFormProps = {
  /** Ключ для remount (pageIdx + submittedCount) */
  formKey: string
  questions: PublicPaQuestion[]
  answers: AnswersMap
  onAnswer: (code: string, value: unknown) => void
  children: (ctx: {
    question: PublicPaQuestion
    code: string
    value: unknown
    error?: string
    onChange: (next: unknown) => void
  }) => ReactNode
}

/**
 * Одна секция анкеты = один FormProvider (как в register).
 * mode: onChange — ошибки сразу при вводе.
 */
export const SurveySectionForm = forwardRef<SurveySectionFormHandle, SurveySectionFormProps>(
  function SurveySectionForm({ formKey, questions, answers, onAnswer, children }, ref) {
    const schema = useMemo(() => buildPageSchema(questions), [questions])
    const defaultValues = useMemo(
      () => buildPageDefaultValues(questions, answers),
      // только при смене секции/итерации loop
      // eslint-disable-next-line react-hooks/exhaustive-deps -- formKey задаёт момент reset
      [formKey],
    )

    const methods = useForm<AnswersMap>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- динамические ключи вопросов
      resolver: yupResolver(schema as any),
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues,
    })

    useEffect(() => {
      methods.reset(buildPageDefaultValues(questions, answers))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formKey])

    // Внешняя очистка зависимых полей (cascade) → sync в RHF
    useEffect(() => {
      for (const question of questions) {
        const code = questionAnswerKey(question)
        if (!code) continue
        const next = answers[code] ?? null
        const current = methods.getValues(code)
        if (current !== next) {
          methods.setValue(code, next, { shouldValidate: Boolean(methods.formState.errors[code]) })
        }
      }
    }, [answers, methods, questions])

    useImperativeHandle(
      ref,
      () => ({
        trigger: async () => {
          const codes = questions.map((q) => questionAnswerKey(q)).filter(Boolean)
          return methods.trigger(codes)
        },
      }),
      [methods, questions],
    )

    return (
      <FormProvider {...methods} key={formKey}>
        {questions.map((question) => {
          const code = questionAnswerKey(question)
          if (!code) return null
          return (
            <Controller
              key={question.id}
              name={code}
              control={methods.control}
              render={({ field, fieldState }) => (
                <>
                  {children({
                    question,
                    code,
                    value: field.value,
                    error: fieldState.error?.message,
                    onChange: (next) => {
                      field.onChange(next)
                      onAnswer(code, next)
                    },
                  })}
                </>
              )}
            />
          )
        })}
      </FormProvider>
    )
  },
)

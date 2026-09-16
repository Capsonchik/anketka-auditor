'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Assignment } from '@/entities/assignment/model/types'
import {
  questionAnswerKey,
  type PublicPaPage,
  type PublicPaQuestion,
  type PublicPaSession,
  useSavePublicPaDraftMutation,
  useSubmitPublicPaMutation,
} from '@/entities/public-pa'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form-field'
import { Input, Textarea } from '@/shared/ui/input'
import { SelectPicker } from '@/shared/ui/picker'
import { PillSwitchFlexible } from '@/shared/ui/pill-switch-flexible'
import { ProgressBar } from '@/shared/ui/progress-bar'
import { Loader } from '@/shared/ui'

import { VisitMeta } from './visit-meta'
import styles from './check-survey-form.module.scss'

type AnswersMap = Record<string, string>

type CheckSurveyFormProps = {
  assignment: Assignment
  session: PublicPaSession
  initialAnswers?: AnswersMap
  isBootstrapping?: boolean
}

function isFilled(value: string | undefined): boolean {
  return Boolean(value && String(value).trim())
}

function listQuestions(pages: PublicPaPage[]): PublicPaQuestion[] {
  return pages.flatMap((page) =>
    [...(page.questions || [])].sort((a, b) => a.sortOrder - b.sortOrder),
  )
}

function listMissingRequired(pages: PublicPaPage[], answers: AnswersMap): PublicPaQuestion[] {
  return listQuestions(pages).filter(
    (q) => q.required && !isFilled(answers[questionAnswerKey(q)]),
  )
}

function calcProgress(pages: PublicPaPage[], answers: AnswersMap): number {
  const required = listQuestions(pages).filter((q) => q.required)
  if (required.length === 0) return 100
  const missing = listMissingRequired(pages, answers).length
  const filled = required.length - missing
  return Math.round((filled / required.length) * 100)
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: PublicPaQuestion
  value: string
  onChange: (next: string) => void
}) {
  const type = String(question.type || '').toLowerCase()
  const options = (question.options || []).map((o) => ({
    value: o.value,
    label: o.label,
  }))
  const isChoice =
    options.length > 0 &&
    (type.includes('single') ||
      type === 'radio' ||
      type === 'select' ||
      type.includes('choice') ||
      options.length <= 6)

  if (isChoice) {
    if (options.length <= 6) {
      return (
        <FormField label={question.title} required={question.required} hint={question.description || undefined}>
          <PillSwitchFlexible
            name={questionAnswerKey(question)}
            size="small"
            data={options}
            value={value || ''}
            onChange={(next) => onChange(String(next))}
          />
        </FormField>
      )
    }
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <SelectPicker
          block
          cleanable
          placeholder="Выберите"
          items={options}
          value={value || null}
          onChange={(next) => onChange(next == null ? '' : String(next))}
        />
      </FormField>
    )
  }

  if (type.includes('area') || type === 'textarea' || type === 'long_text') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Textarea
          block
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.description || undefined}
        />
      </FormField>
    )
  }

  if (type.includes('number') || type === 'integer' || type === 'decimal') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input block type="number" value={value} onChange={(e) => onChange(e.target.value)} />
      </FormField>
    )
  }

  return (
    <FormField label={question.title} required={question.required} hint={question.description || undefined}>
      <Input block value={value} onChange={(e) => onChange(e.target.value)} />
    </FormField>
  )
}

function extractAnswersFromDraft(draft: Record<string, unknown> | null | undefined): AnswersMap {
  if (!draft || typeof draft !== 'object') return {}
  const nested = draft.answers
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    const screening =
      (nested as Record<string, unknown>).screening &&
      typeof (nested as Record<string, unknown>).screening === 'object'
        ? ((nested as Record<string, unknown>).screening as Record<string, unknown>)
        : {}
    const product =
      (nested as Record<string, unknown>).product &&
      typeof (nested as Record<string, unknown>).product === 'object'
        ? ((nested as Record<string, unknown>).product as Record<string, unknown>)
        : {}
    const flat =
      Object.keys(screening).length || Object.keys(product).length
        ? { ...screening, ...product }
        : (nested as Record<string, unknown>)
    const out: AnswersMap = {}
    for (const [k, v] of Object.entries(flat)) {
      if (v == null) continue
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        out[k] = String(v)
      }
    }
    return out
  }
  return {}
}

export function CheckSurveyForm({
  assignment,
  session,
  initialAnswers = {},
  isBootstrapping = false,
}: CheckSurveyFormProps) {
  const pages = useMemo(
    () => [...(session.builder?.pages || [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [session.builder?.pages],
  )

  const [answers, setAnswers] = useState<AnswersMap>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dirtyRef = useRef(false)

  const [saveDraft, saveState] = useSavePublicPaDraftMutation()
  const [submitPa, submitState] = useSubmitPublicPaMutation()

  // Черновик подмешиваем только пока пользователь ещё не начал ввод.
  useEffect(() => {
    if (dirtyRef.current) return
    if (Object.keys(initialAnswers).length === 0) return
    setAnswers((prev) => ({ ...initialAnswers, ...prev }))
  }, [initialAnswers])

  const missingRequired = useMemo(() => listMissingRequired(pages, answers), [pages, answers])
  const progress = useMemo(() => calcProgress(pages, answers), [pages, answers])
  const busy = saveState.isLoading || submitState.isLoading || isBootstrapping
  const context = { checkId: assignment.checkId }

  const setAnswer = (key: string, value: string) => {
    if (!key) return
    dirtyRef.current = true
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setNotice(null)
    setError(null)
  }

  const handleSaveDraft = async () => {
    setError(null)
    try {
      await saveDraft({
        token: session.token,
        body: {
          draft: { answers },
          context,
        },
      }).unwrap()
      setNotice('Черновик сохранён')
    } catch (err) {
      const detail =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: string } }).data?.detail || '')
          : ''
      setError(detail || 'Не удалось сохранить черновик')
    }
  }

  const handleSubmit = async () => {
    setError(null)
    if (missingRequired.length > 0) {
      const titles = missingRequired
        .map((q) => q.title?.trim() || questionAnswerKey(q))
        .filter(Boolean)
      const preview = titles.slice(0, 8).join(', ')
      const more = titles.length > 8 ? ` и ещё ${titles.length - 8}` : ''
      setError(`Не заполнены обязательные поля (${titles.length}): ${preview}${more}`)
      return
    }
    try {
      await submitPa({
        token: session.token,
        body: {
          answers,
          mode: 'finish',
          context,
        },
      }).unwrap()
      setNotice('Анкета отправлена')
    } catch (err) {
      const detail =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: string } }).data?.detail || '')
          : ''
      setError(detail || 'Не удалось отправить анкету')
    }
  }

  if (isBootstrapping) {
    return (
      <div className={styles.root}>
        <VisitMeta assignment={assignment} />
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <VisitMeta assignment={assignment} />

      <ProgressBar
        className={styles.progress}
        value={progress}
        label={`Прогресс заполнения${missingRequired.length ? ` · осталось ${missingRequired.length}` : ''}`}
      />

      {pages.length === 0 ? (
        <p className={styles.empty}>В анкете пока нет вопросов</p>
      ) : (
        pages.map((page) => (
          <section key={page.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{page.title || 'Раздел'}</h2>
            <div className={page.sectionType === 'loop' ? styles.card : styles.fields}>
              {[...page.questions]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((question) => {
                  const key = questionAnswerKey(question)
                  const missing = question.required && !isFilled(answers[key])
                  return (
                    <div
                      key={question.id}
                      className={missing ? `${styles.field} ${styles.fieldMissing}` : styles.field}
                    >
                      <QuestionField
                        question={question}
                        value={answers[key] || ''}
                        onChange={(next) => setAnswer(key, next)}
                      />
                    </div>
                  )
                })}
            </div>
          </section>
        ))
      )}

      {error ? <div className={styles.bannerError}>{error}</div> : null}
      {notice && !error ? <div className={styles.notice}>{notice}</div> : null}

      <div className={styles.actions}>
        <Button type="button" variant="default" appearance="ghost" disabled={busy} onClick={handleSaveDraft}>
          Сохранить черновик
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={busy}
          loading={submitState.isLoading}
          onClick={handleSubmit}
        >
          Отправить
        </Button>
      </div>
    </div>
  )
}

export { extractAnswersFromDraft }

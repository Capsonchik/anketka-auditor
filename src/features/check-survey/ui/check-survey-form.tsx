'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Assignment } from '@/entities/assignment/model/types'
import {
  questionAnswerKey,
  type PublicPaCompletionMeta,
  type PublicPaPage,
  type PublicPaQuestion,
  type PublicPaSession,
  useSavePublicPaDraftMutation,
  useSubmitPublicPaMutation,
} from '@/entities/public-pa'
import { Button } from '@/shared/ui/button'
import { ProgressBar } from '@/shared/ui/progress-bar'
import { Loader } from '@/shared/ui'

import {
  buildDraftPayload,
  collectPageCodes,
  extractAnswersFromDraft,
  extractCompletedValuesFromDraft,
  extractCompletionFromDraft,
  extractPageIdxFromDraft,
  extractSubmittedCountFromDraft,
  isAuditorIdentityCode,
  splitScreeningProductAnswers,
  type AnswersMap,
} from '../lib/answer-model'
import {
  buildCompletedOptionKey,
  shouldHideCompletedInLoop,
  shouldTrackCompletedInLoop,
} from '../lib/cascade-completion'
import { getDependsOnCodesFromConfig } from '../lib/build-pa-options-params'
import { buildDependentCodesByDriver, findRepeatPageIndex, findScreeningPageIndex } from '../lib/page-roles'
import { isQuestionAnswerFilled, isQuestionVisibleByLogic, shouldTerminateByLogic } from '../lib/survey-logic'
import { usePaOptions } from '../hooks/use-pa-options'
import { QuestionField } from './question-field'
import { VisitMeta } from './visit-meta'
import styles from './check-survey-form.module.scss'

type CheckSurveyFormProps = {
  assignment: Assignment
  session: PublicPaSession
  initialDraft?: Record<string, unknown> | null
  isBootstrapping?: boolean
  onSubmitted?: () => void | Promise<void>
}

function isAssignmentLocked(assignment: Assignment): boolean {
  const status = String(assignment.status || '').toLowerCase()
  const checkStatus = String(assignment.checkStatus || '').toLowerCase()
  return (
    status === 'completed' ||
    checkStatus === 'passed' ||
    checkStatus === 'completed' ||
    checkStatus === 'approved'
  )
}

function clearDependentAnswers(
  answers: AnswersMap,
  driverCode: string,
  dependentCodesByDriver: Map<string, Set<string>>,
): AnswersMap {
  const next = { ...answers }
  const visited = new Set<string>()
  const queue = [driverCode]
  while (queue.length) {
    const parentCode = queue.shift()
    if (!parentCode) continue
    const dependents = dependentCodesByDriver.get(parentCode)
    if (!dependents) continue
    for (const dependentCode of dependents) {
      if (visited.has(dependentCode)) continue
      visited.add(dependentCode)
      delete next[dependentCode]
      queue.push(dependentCode)
    }
  }
  return next
}

function collectDependentCodes(
  driverCode: string,
  dependentCodesByDriver: Map<string, Set<string>>,
): string[] {
  const out: string[] = []
  const visited = new Set<string>()
  const queue = [driverCode]
  while (queue.length) {
    const parentCode = queue.shift()
    if (!parentCode) continue
    const dependents = dependentCodesByDriver.get(parentCode)
    if (!dependents) continue
    for (const dependentCode of dependents) {
      if (visited.has(dependentCode)) continue
      visited.add(dependentCode)
      out.push(dependentCode)
      queue.push(dependentCode)
    }
  }
  return out
}

export function CheckSurveyForm({
  assignment,
  session,
  initialDraft = null,
  isBootstrapping = false,
  onSubmitted,
}: CheckSurveyFormProps) {
  const pages = useMemo(
    () => [...(session.builder?.pages || [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [session.builder?.pages],
  )

  const [pageIdx, setPageIdx] = useState(0)
  const [answers, setAnswers] = useState<AnswersMap>({})
  const [completedValuesByCode, setCompletedValuesByCode] = useState<Record<string, string[]>>({})
  const [completionMeta, setCompletionMeta] = useState<PublicPaCompletionMeta | null>(null)
  const [submittedCount, setSubmittedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submittedLocally, setSubmittedLocally] = useState(false)
  const dirtyRef = useRef(false)
  const draftHydratedRef = useRef(false)

  const [saveDraft, saveState] = useSavePublicPaDraftMutation()
  const [submitPa, submitState] = useSubmitPublicPaMutation()

  const locked = submittedLocally || isAssignmentLocked(assignment)
  const context = { checkId: assignment.checkId }

  const screeningPageIdx = useMemo(() => findScreeningPageIndex(pages), [pages])
  const repeatPageIdx = useMemo(() => findRepeatPageIndex(pages), [pages])
  const isRepeatPage = repeatPageIdx !== null && pageIdx === repeatPageIdx

  const screeningCodes = useMemo(
    () => collectPageCodes(pages[screeningPageIdx]),
    [pages, screeningPageIdx],
  )
  const repeatCodes = useMemo(
    () => (repeatPageIdx == null ? [] : collectPageCodes(pages[repeatPageIdx])),
    [pages, repeatPageIdx],
  )

  const dependentCodesByDriver = useMemo(
    () =>
      buildDependentCodesByDriver(
        pages,
        (q) => questionAnswerKey(q as PublicPaQuestion),
        getDependsOnCodesFromConfig,
      ),
    [pages],
  )

  useEffect(() => {
    if (draftHydratedRef.current) return
    if (!initialDraft) return
    draftHydratedRef.current = true
    setAnswers(extractAnswersFromDraft(initialDraft))
    setCompletedValuesByCode(extractCompletedValuesFromDraft(initialDraft))
    setCompletionMeta(extractCompletionFromDraft(initialDraft))
    setPageIdx(extractPageIdxFromDraft(initialDraft))
    setSubmittedCount(extractSubmittedCountFromDraft(initialDraft))
  }, [initialDraft])

  // If draft arrives after first empty render
  useEffect(() => {
    if (dirtyRef.current || locked) return
    if (!initialDraft) return
    if (Object.keys(answers).length > 0) return
    const extracted = extractAnswersFromDraft(initialDraft)
    if (Object.keys(extracted).length === 0) return
    setAnswers(extracted)
    setCompletedValuesByCode(extractCompletedValuesFromDraft(initialDraft))
    setCompletionMeta(extractCompletionFromDraft(initialDraft))
  }, [answers, initialDraft, locked])

  useEffect(() => {
    if (!locked || !initialDraft) return
    setAnswers(extractAnswersFromDraft(initialDraft))
    setCompletedValuesByCode(extractCompletedValuesFromDraft(initialDraft))
    setCompletionMeta(extractCompletionFromDraft(initialDraft))
  }, [initialDraft, locked])

  const page: PublicPaPage | null = pages[pageIdx] ?? null
  const visiblePageQuestions = useMemo(() => {
    if (!page) return []
    return [...page.questions]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((q) => isQuestionVisibleByLogic(q, answers))
      .filter((q) => {
        const code = questionAnswerKey(q)
        return !(code && isAuditorIdentityCode(code))
      })
  }, [answers, page])

  const allQuestionCodes = useMemo(() => {
    const set = new Set<string>()
    for (const surveyPage of pages) {
      for (const q of surveyPage.questions || []) {
        const code = questionAnswerKey(q)
        if (code) set.add(code)
      }
    }
    return set
  }, [pages])

  const { optionsByCode, clearOptionsForCodes } = usePaOptions({
    token: session.token,
    questions: visiblePageQuestions,
    allQuestionCodes,
    answers,
    enabled: !locked,
  })

  const hasTerminateConditionMatch = useMemo(() => {
    for (const surveyPage of pages) {
      for (const question of surveyPage.questions || []) {
        if (!isQuestionVisibleByLogic(question, answers)) continue
        if (shouldTerminateByLogic(question, answers)) return true
      }
    }
    return false
  }, [answers, pages])

  const missingRequiredForPage = useMemo(() => {
    return visiblePageQuestions.filter((q) => {
      if (!q.required) return false
      return !isQuestionAnswerFilled(q, answers[questionAnswerKey(q)])
    })
  }, [answers, visiblePageQuestions])

  const missingRequiredForRepeat = useMemo(() => {
    if (repeatPageIdx == null) return []
    const repeatPage = pages[repeatPageIdx]
    if (!repeatPage) return []
    return [...repeatPage.questions]
      .filter((q) => isQuestionVisibleByLogic(q, answers))
      .filter((q) => q.required && !isQuestionAnswerFilled(q, answers[questionAnswerKey(q)]))
  }, [answers, pages, repeatPageIdx])

  const filledCount = useMemo(() => {
    const all = pages.flatMap((p) => p.questions || [])
    if (!all.length) return 0
    const filled = all.filter((q) => isQuestionAnswerFilled(q, answers[questionAnswerKey(q)])).length
    return Math.round((filled / all.length) * 100)
  }, [answers, pages])

  let localCompletedCount = 0
  for (const values of Object.values(completedValuesByCode)) {
    const count = Array.isArray(values) ? values.length : 0
    if (count > localCompletedCount) localCompletedCount = count
  }
  const completedCount = Math.max(
    completionMeta?.itemsCompleted ?? 0,
    localCompletedCount,
    submittedCount,
  )
  const totalCount = completionMeta?.itemsTotal ?? null
  const progressCounterLabel =
    totalCount && totalCount > 0
      ? `Осталось ${Math.max(totalCount - completedCount, 0)} · Отправлено ${Math.min(completedCount, totalCount)}`
      : null

  const busy = saveState.isLoading || submitState.isLoading || isBootstrapping

  const setAnswer = (code: string, value: unknown) => {
    if (!code || locked) return
    dirtyRef.current = true
    setAnswers((prev) => clearDependentAnswers({ ...prev, [code]: value }, code, dependentCodesByDriver))
    clearOptionsForCodes(collectDependentCodes(code, dependentCodesByDriver))
    setNotice(null)
    setError(null)
  }

  const handleSaveDraft = async () => {
    if (locked) return
    setError(null)
    try {
      await saveDraft({
        token: session.token,
        body: {
          draft: buildDraftPayload({
            pageIdx,
            answers,
            submittedCount,
            completedValuesByCode,
          }),
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

  const appendCompletedFromRepeat = (): Record<string, string[]> => {
    const repeatPage = repeatPageIdx == null ? null : pages[repeatPageIdx]
    const next: Record<string, string[]> = { ...completedValuesByCode }
    for (const code of repeatCodes) {
      const question = repeatPage?.questions.find((item) => questionAnswerKey(item) === code)
      if (!question || !shouldTrackCompletedInLoop(question.config)) continue
      const isDriver = Boolean(dependentCodesByDriver.get(code)?.size)
      if (isDriver && !shouldHideCompletedInLoop(question.config, isDriver)) continue
      const answerValue = answers[code]
      const current = new Set((next[code] ?? []).map(String))
      if (typeof answerValue === 'string' || typeof answerValue === 'number') {
        const key = buildCompletedOptionKey(question.config, answers, String(answerValue))
        if (key) current.add(key)
      }
      if (Array.isArray(answerValue)) {
        for (const item of answerValue) {
          const key = buildCompletedOptionKey(question.config, answers, String(item))
          if (key) current.add(key)
        }
      }
      next[code] = Array.from(current)
    }
    setCompletedValuesByCode(next)
    setCompletionMeta((prev) => {
      if (!prev) {
        return {
          itemsCompleted: 1,
          itemsTotal: null,
          allCompleted: false,
        }
      }
      const itemsCompleted = prev.itemsCompleted + 1
      const itemsTotal = prev.itemsTotal
      return {
        itemsCompleted,
        itemsTotal,
        allCompleted: itemsTotal != null && itemsTotal > 0 && itemsCompleted >= itemsTotal,
      }
    })
    return next
  }

  const handleSubmit = async (mode: 'continue' | 'finish' = 'finish') => {
    if (locked) return
    setError(null)

    try {
      if (isRepeatPage) {
        if (missingRequiredForRepeat.length) {
          setError(
            `Заполните обязательные поля: ${missingRequiredForRepeat.map((x) => x.title).join(', ')}`,
          )
          return
        }
        const { screening, product } = splitScreeningProductAnswers({
          answers,
          screeningCodes,
          repeatCodes,
        })
        await submitPa({
          token: session.token,
          body: {
            mode,
            answers: { screening, product },
            context,
          },
        }).unwrap()

        if (mode === 'continue') {
          const nextCompleted = appendCompletedFromRepeat()
          const nextSubmittedCount = submittedCount + 1
          setSubmittedCount(nextSubmittedCount)
          const clearedAnswers = { ...answers }
          for (const code of repeatCodes) delete clearedAnswers[code]
          setAnswers(clearedAnswers)
          clearOptionsForCodes(repeatCodes)
          void saveDraft({
            token: session.token,
            body: {
              draft: buildDraftPayload({
                pageIdx,
                answers: clearedAnswers,
                submittedCount: nextSubmittedCount,
                completedValuesByCode: nextCompleted,
              }),
              context,
            },
          }).catch(() => {})
          setNotice('Ответ отправлен. Можно заполнить следующий товар.')
          return
        }

        setSubmittedLocally(true)
        setNotice(null)
        await onSubmitted?.()
        return
      }

      if (missingRequiredForPage.length) {
        setError(
          `Заполните обязательные поля: ${missingRequiredForPage.map((x) => x.title).join(', ')}`,
        )
        return
      }

      await submitPa({
        token: session.token,
        body: {
          mode: 'finish',
          answers,
          context,
        },
      }).unwrap()
      setSubmittedLocally(true)
      setNotice(null)
      await onSubmitted?.()
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

  const canPrev = pageIdx > 0
  const canNext = pageIdx < pages.length - 1
  const canGoNext = canNext && missingRequiredForPage.length === 0 && !hasTerminateConditionMatch

  return (
    <div className={styles.root}>
      <VisitMeta assignment={assignment} />

      <ProgressBar
        className={styles.progress}
        value={filledCount}
        label={
          locked
            ? 'Прогресс заполнения'
            : `Прогресс заполнения${progressCounterLabel ? ` · ${progressCounterLabel}` : ''}`
        }
      />

      {pages.length === 0 ? (
        <p className={styles.empty}>В анкете пока нет вопросов</p>
      ) : page ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {page.title || 'Раздел'}
            {pages.length > 1 ? (
              <span className={styles.pageCounter}>
                {' '}
                ({pageIdx + 1}/{pages.length})
              </span>
            ) : null}
          </h2>
          <div className={page.sectionType === 'loop' ? styles.card : styles.fields}>
            {visiblePageQuestions.map((question) => {
              const key = questionAnswerKey(question)
              const missing = !locked && question.required && !isQuestionAnswerFilled(question, answers[key])
              return (
                <div
                  key={question.id}
                  className={missing ? `${styles.field} ${styles.fieldMissing}` : styles.field}
                >
                  <QuestionField
                    question={question}
                    value={answers[key]}
                    answers={answers}
                    completedValuesByCode={completedValuesByCode}
                    dynamicOptions={optionsByCode[key]}
                    allowCompletedFallback={Boolean(completionMeta?.allCompleted)}
                    isDriverForCascade={Boolean(dependentCodesByDriver.get(key)?.size)}
                    readOnly={locked}
                    onChange={(next) => setAnswer(key, next)}
                  />
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {error ? <div className={styles.bannerError}>{error}</div> : null}
      {notice && !error && !locked ? <div className={styles.notice}>{notice}</div> : null}
      {hasTerminateConditionMatch && !locked ? (
        <div className={styles.bannerError}>Сработали условия завершения анкеты.</div>
      ) : null}

      {locked ? (
        <div className={styles.submittedBox}>
          <p className={styles.submittedTitle}>Анкета уже отправлена</p>
          <p className={styles.submittedText}>
            Ответы приняты, повторная отправка и сохранение черновика недоступны. При необходимости
            свяжитесь с поддержкой или дождитесь доработки от координатора.
          </p>
        </div>
      ) : (
        <div className={styles.actions}>
          {canPrev ? (
            <Button
              type="button"
              variant="default"
              appearance="ghost"
              disabled={busy}
              onClick={() => setPageIdx((idx) => Math.max(0, idx - 1))}
            >
              Назад
            </Button>
          ) : null}

          <Button type="button" variant="default" appearance="ghost" disabled={busy} onClick={handleSaveDraft}>
            Сохранить черновик
          </Button>

          {canGoNext ? (
            <Button
              type="button"
              variant="default"
              disabled={busy}
              onClick={() => setPageIdx((idx) => Math.min(pages.length - 1, idx + 1))}
            >
              Далее
            </Button>
          ) : null}

          {isRepeatPage ? (
            <>
              <Button
                type="button"
                variant="default"
                disabled={busy}
                loading={submitState.isLoading}
                onClick={() => void handleSubmit('continue')}
              >
                Отправить и продолжить
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={busy}
                loading={submitState.isLoading}
                onClick={() => void handleSubmit('finish')}
              >
                Отправить и завершить
              </Button>
            </>
          ) : !canNext ? (
            <Button
              type="button"
              variant="primary"
              disabled={busy || hasTerminateConditionMatch}
              loading={submitState.isLoading}
              onClick={() => void handleSubmit('finish')}
            >
              Отправить
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export { extractAnswersFromDraft }

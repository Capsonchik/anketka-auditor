'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
import { Message, useToaster } from '@/shared/ui/toaster'

import {
  buildDraftPayload,
  collectPageCodes,
  extractAnswersFromDraft,
  extractCompletedValuesFromDraft,
  extractCompletionFromDraft,
  extractLoopIterationsFromDraft,
  extractSubmittedCountFromDraft,
  isAuditorIdentityCode,
  splitScreeningProductAnswers,
  type AnswersMap,
  type PublicPaLoopIteration,
} from '../lib/answer-model'
import {
  buildCompletedOptionKey,
  formatCompletedOptionLabel,
  reconstructLoopProductFromCompletedKey,
  resolvePrimaryLoopCompletedCode,
  shouldHideCompletedInLoop,
  shouldTrackCompletedInLoop,
} from '../lib/cascade-completion'
import { getDependsOnCodesFromConfig } from '../lib/build-pa-options-params'
import { buildDependentCodesByDriver, findRepeatPageIndex, findScreeningPageIndex } from '../lib/page-roles'
import { isQuestionVisibleByLogic, shouldTerminateByLogic } from '../lib/survey-logic'
import { getSurveySectionsProgressPercent, resolveResumePageIdx } from '../lib/section-progress'
import { usePaOptions } from '../hooks/use-pa-options'
import { QuestionField } from './question-field'
import { SurveySectionForm, type SurveySectionFormHandle } from './survey-section-form'
import { LoopIterationsAccordion } from './loop-iterations-accordion'
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
  /** Анимация секции: none — первый рендер / гидрация draft */
  const [sectionAnim, setSectionAnim] = useState<'none' | 'forward' | 'back'>('none')
  const [answers, setAnswers] = useState<AnswersMap>({})
  const [completedValuesByCode, setCompletedValuesByCode] = useState<Record<string, string[]>>({})
  const [completionMeta, setCompletionMeta] = useState<PublicPaCompletionMeta | null>(null)
  const [submittedCount, setSubmittedCount] = useState(0)
  const [loopIterations, setLoopIterations] = useState<PublicPaLoopIteration[]>([])
  const [reviewIterationId, setReviewIterationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submittedLocally, setSubmittedLocally] = useState(false)
  const dirtyRef = useRef(false)
  const draftHydratedRef = useRef(false)
  const sectionFormRef = useRef<SurveySectionFormHandle>(null)
  const toaster = useToaster()

  const goToPage = (nextIdx: number) => {
    const clamped = Math.max(0, Math.min(pages.length - 1, nextIdx))
    if (clamped === pageIdx) return
    setSectionAnim(clamped > pageIdx ? 'forward' : 'back')
    setPageIdx(clamped)
  }

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
    const nextAnswers = extractAnswersFromDraft(initialDraft)
    const nextCompleted = extractCompletedValuesFromDraft(initialDraft)
    const nextCompletion = extractCompletionFromDraft(initialDraft)
    const nextSubmitted = extractSubmittedCountFromDraft(initialDraft)
    const nextIterations = extractLoopIterationsFromDraft(initialDraft)
    setAnswers(nextAnswers)
    setCompletedValuesByCode(nextCompleted)
    setCompletionMeta(nextCompletion)
    setSubmittedCount(nextSubmitted)
    setLoopIterations(nextIterations)
    if (nextIterations.length) {
      setReviewIterationId(nextIterations[nextIterations.length - 1]?.id ?? null)
    }

    let localCompleted = 0
    for (const values of Object.values(nextCompleted)) {
      if (values.length > localCompleted) localCompleted = values.length
    }
    const loopProgress = {
      completedCount: Math.max(nextCompletion?.itemsCompleted ?? 0, localCompleted, nextSubmitted),
      totalCount: nextCompletion?.itemsTotal ?? null,
      allCompleted: Boolean(nextCompletion?.allCompleted),
    }
    // Просмотр отправленной: с первой секции; иначе — resume по заполненности
    if (isAssignmentLocked(assignment)) {
      setPageIdx(0)
    } else {
      setPageIdx(resolveResumePageIdx(pages, nextAnswers, loopProgress))
    }
  }, [assignment, initialDraft, pages])

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
    const nextIterations = extractLoopIterationsFromDraft(initialDraft)
    setLoopIterations(nextIterations)
    setReviewIterationId((prev) => prev ?? nextIterations[nextIterations.length - 1]?.id ?? null)
  }, [initialDraft, locked])

  const page: PublicPaPage | null = pages[pageIdx] ?? null

  const selectedLoopIteration = useMemo(
    () => loopIterations.find((item) => item.id === reviewIterationId) ?? null,
    [loopIterations, reviewIterationId],
  )

  const primaryLoopCompletedCode = useMemo(() => {
    const repeatPage = repeatPageIdx == null ? null : pages[repeatPageIdx]
    if (!repeatPage) return null
    return resolvePrimaryLoopCompletedCode({
      questions: repeatPage.questions || [],
      getCode: (q) => questionAnswerKey(q as PublicPaQuestion),
      completedValuesByCode,
      dependentCodesByDriver,
    })
  }, [completedValuesByCode, dependentCodesByDriver, pages, repeatPageIdx])

  const buildLockedLoopOverlay = useCallback(
    (iterationId: string | null): AnswersMap => {
      if (!iterationId || !primaryLoopCompletedCode) return {}

      const fromSnap = loopIterations.find((item) => item.id === iterationId)
      if (fromSnap) return { ...fromSnap.product }

      const repeatPage = repeatPageIdx == null ? null : pages[repeatPageIdx]
      const primaryQuestion = repeatPage?.questions.find(
        (q) => questionAnswerKey(q) === primaryLoopCompletedCode,
      )
      const parentCodes = getDependsOnCodesFromConfig(primaryQuestion?.config ?? null)
      return reconstructLoopProductFromCompletedKey({
        completedKey: iterationId,
        primaryCode: primaryLoopCompletedCode,
        parentCodes,
        completedValuesByCode,
        dependentCodesByDriver,
      })
    },
    [
      completedValuesByCode,
      dependentCodesByDriver,
      loopIterations,
      pages,
      primaryLoopCompletedCode,
      repeatPageIdx,
    ],
  )

  /** В locked на loop: снимок итерации или реконструкция по ключу SKU + категория */
  const formAnswers = useMemo(() => {
    if (!locked || !isRepeatPage) return answers

    const base: AnswersMap = { ...answers }
    for (const code of repeatCodes) delete base[code]

    if (!reviewIterationId) return answers
    return { ...base, ...buildLockedLoopOverlay(reviewIterationId) }
  }, [
    answers,
    buildLockedLoopOverlay,
    isRepeatPage,
    locked,
    repeatCodes,
    reviewIterationId,
  ])

  const visiblePageQuestions = useMemo(() => {
    if (!page) return []
    return [...page.questions]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((q) => isQuestionVisibleByLogic(q, formAnswers))
      .filter((q) => {
        const code = questionAnswerKey(q)
        return !(code && isAuditorIdentityCode(code))
      })
  }, [formAnswers, page])

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

  const { optionsByCode, loadingByCode, clearOptionsForCodes } = usePaOptions({
    token: session.token,
    questions: visiblePageQuestions,
    allQuestionCodes,
    answers: formAnswers,
    enabled: true,
  })

  const loopReviewItems = useMemo(() => {
    if (loopIterations.length > 0) {
      return loopIterations.map((item) => ({
        id: item.id,
        label: item.label,
        hasDetails: true,
      }))
    }
    // Только primary-код (SKU), не все поля completedValues
    if (!primaryLoopCompletedCode) return []

    // Единственная completed-категория (и др. родители) — в подпись строки
    const soleParentLabels: string[] = []
    for (const [code, values] of Object.entries(completedValuesByCode)) {
      if (code === primaryLoopCompletedCode) continue
      if (!Array.isArray(values) || values.length !== 1) continue
      const raw = formatCompletedOptionLabel(values[0])
      const optLabel = (optionsByCode[code] || []).find((o) => String(o.value) === raw)?.label
      soleParentLabels.push(optLabel || raw)
    }

    const keys = completedValuesByCode[primaryLoopCompletedCode] ?? []
    return keys.map((key) => {
      const value = formatCompletedOptionLabel(key)
      const optLabel = (optionsByCode[primaryLoopCompletedCode] || []).find(
        (o) => String(o.value) === value,
      )?.label
      const skuLabel = optLabel || value
      const label =
        soleParentLabels.length > 0 ? `${soleParentLabels.join(' · ')} · ${skuLabel}` : skuLabel
      return {
        id: key,
        label,
        hasDetails: false,
      }
    })
  }, [completedValuesByCode, loopIterations, optionsByCode, primaryLoopCompletedCode])

  // Автовыбор первой/последней позиции при locked без снимков
  useEffect(() => {
    if (!locked || !isRepeatPage) return
    if (loopIterations.length > 0) return
    if (reviewIterationId) return
    const keys = primaryLoopCompletedCode ? completedValuesByCode[primaryLoopCompletedCode] : null
    if (keys?.length) setReviewIterationId(keys[keys.length - 1] ?? null)
  }, [
    completedValuesByCode,
    isRepeatPage,
    locked,
    loopIterations.length,
    primaryLoopCompletedCode,
    reviewIterationId,
  ])
  const hasTerminateConditionMatch = useMemo(() => {
    for (const surveyPage of pages) {
      for (const question of surveyPage.questions || []) {
        if (!isQuestionVisibleByLogic(question, formAnswers)) continue
        if (shouldTerminateByLogic(question, formAnswers)) return true
      }
    }
    return false
  }, [formAnswers, pages])

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

  // % по секциям (страницам): regular — обязательные поля; loop — отправлено/всего SKU
  const filledCount = useMemo(
    () =>
      getSurveySectionsProgressPercent(pages, answers, {
        completedCount,
        totalCount,
      }),
    [answers, completedCount, pages, totalCount],
  )

  const busy = saveState.isLoading || submitState.isLoading || isBootstrapping

  const setAnswer = (code: string, value: unknown) => {
    if (!code || locked) return
    dirtyRef.current = true
    setAnswers((prev) => clearDependentAnswers({ ...prev, [code]: value }, code, dependentCodesByDriver))
    clearOptionsForCodes(collectDependentCodes(code, dependentCodesByDriver))
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
            loopIterations,
          }),
          context,
        },
      }).unwrap()
      toaster.push(<Message type="success">Черновик сохранён</Message>, { duration: 3000 })
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

  /** Снимок product текущей итерации — для readonly-просмотра после отправки */
  const snapshotCurrentLoopIteration = (): PublicPaLoopIteration | null => {
    const { product } = splitScreeningProductAnswers({
      answers,
      screeningCodes,
      repeatCodes,
    })
    if (!Object.keys(product).length) return null

    const repeatPage = repeatPageIdx == null ? null : pages[repeatPageIdx]
    let key = ''
    let label = ''
    for (const code of repeatCodes) {
      const question = repeatPage?.questions.find((item) => questionAnswerKey(item) === code)
      if (!question || !shouldTrackCompletedInLoop(question.config)) continue
      const answerValue = answers[code]
      if (typeof answerValue !== 'string' && typeof answerValue !== 'number') continue
      const raw = String(answerValue)
      key = buildCompletedOptionKey(question.config, answers, raw) || raw
      const opt = (question.options || []).find((o) => String(o.value) === raw)
      label = opt?.label || raw
      break
    }
    if (!key) {
      const first = Object.entries(product)[0]
      if (!first) return null
      key = String(first[1])
      label = key
    }

    return {
      id: `${Date.now()}-${key}`,
      key,
      label,
      product: { ...product },
      submittedAt: new Date().toISOString(),
    }
  }

  const handleSubmit = async (mode: 'continue' | 'finish' = 'finish') => {
    if (locked) return
    setError(null)

    const valid = await sectionFormRef.current?.trigger()
    if (!valid) {
      setError('Проверьте обязательные и некорректно заполненные поля')
      return
    }

    try {
      if (isRepeatPage) {
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

        const snap = snapshotCurrentLoopIteration()
        const nextIterations = snap ? [...loopIterations, snap] : loopIterations
        if (snap) {
          setLoopIterations(nextIterations)
          setReviewIterationId(snap.id)
        }

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
                loopIterations: nextIterations,
              }),
              context,
            },
          }).catch(() => {})
          toaster.push(
            <Message type="success" header="Ответ отправлен">
              Можно заполнить следующий товар.
            </Message>,
            { duration: 3000 },
          )
          return
        }

        // finish: сохраняем историю итераций в draft до лока
        const nextCompleted = snap ? appendCompletedFromRepeat() : completedValuesByCode
        void saveDraft({
          token: session.token,
          body: {
            draft: buildDraftPayload({
              pageIdx,
              answers,
              submittedCount: submittedCount + (snap ? 1 : 0),
              completedValuesByCode: nextCompleted,
              loopIterations: nextIterations,
            }),
            context,
          },
        }).catch(() => {})

        setSubmittedLocally(true)
        await onSubmitted?.()
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
      await onSubmitted?.()
    } catch (err) {
      const detail =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: string } }).data?.detail || '')
          : ''
      setError(detail || 'Не удалось отправить анкету')
    }
  }

  const goNext = async () => {
    if (!locked) {
      const valid = await sectionFormRef.current?.trigger()
      if (!valid) {
        setError('Проверьте обязательные и некорректно заполненные поля')
        return
      }
    }
    setError(null)
    goToPage(pageIdx + 1)
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
  const canGoNext = canNext && !hasTerminateConditionMatch
  const sectionFormKey = `${pageIdx}-${submittedCount}-${isRepeatPage ? 'loop' : 'page'}-${
    locked && isRepeatPage ? reviewIterationId || 'review' : 'edit'
  }`

  const sectionFields = (
    <SurveySectionForm
      key={sectionFormKey}
      ref={sectionFormRef}
      formKey={sectionFormKey}
      questions={visiblePageQuestions}
      answers={formAnswers}
      onAnswer={setAnswer}
    >
      {({ question, code, value, error: fieldError, onChange }) => (
        <div key={question.id} className={styles.field}>
          <QuestionField
            question={question}
            value={value}
            answers={formAnswers}
            completedValuesByCode={completedValuesByCode}
            dynamicOptions={optionsByCode[code]}
            isOptionsLoading={Boolean(loadingByCode[code])}
            allowCompletedFallback={Boolean(completionMeta?.allCompleted) || locked}
            isDriverForCascade={Boolean(dependentCodesByDriver.get(code)?.size)}
            readOnly={locked}
            error={fieldError}
            onChange={onChange}
          />
        </div>
      )}
    </SurveySectionForm>
  )

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

      {locked ? (
        <div className={styles.submittedBox}>
          <p className={styles.submittedTitle}>Анкета уже отправлена</p>
          <p className={styles.submittedText}>
            Просмотр ответов доступен. Редактирование, повторная отправка и сохранение черновика
            недоступны.
          </p>
        </div>
      ) : null}

      {pages.length === 0 ? (
        <p className={styles.empty}>В анкете пока нет вопросов</p>
      ) : page ? (
        <section
          key={pageIdx}
          className={[
            styles.section,
            sectionAnim === 'forward' ? styles.sectionEnterForward : '',
            sectionAnim === 'back' ? styles.sectionEnterBack : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <h2 className={styles.sectionTitle}>
            {page.title || 'Раздел'}
            {pages.length > 1 ? (
              <span className={styles.pageCounter}>
                {' '}
                ({pageIdx + 1}/{pages.length})
              </span>
            ) : null}
          </h2>

          {locked && isRepeatPage && loopReviewItems.length > 0 ? (
            <LoopIterationsAccordion
              items={loopReviewItems}
              openId={selectedLoopIteration?.id ?? reviewIterationId}
              onOpenChange={setReviewIterationId}
              renderContent={() => sectionFields}
            />
          ) : (
            <div className={page.sectionType === 'loop' ? styles.card : styles.fields}>
              {sectionFields}
            </div>
          )}
        </section>
      ) : null}

      {error ? <div className={styles.bannerError}>{error}</div> : null}
      {hasTerminateConditionMatch && !locked ? (
        <div className={styles.bannerError}>Сработали условия завершения анкеты.</div>
      ) : null}

      {locked ? (
        <div className={styles.actions}>
          {canPrev ? (
            <Button
              type="button"
              variant="default"
              appearance="ghost"
              onClick={() => goToPage(pageIdx - 1)}
            >
              Назад
            </Button>
          ) : null}
          {canNext ? (
            <Button type="button" variant="default" onClick={() => goToPage(pageIdx + 1)}>
              Далее
            </Button>
          ) : null}
        </div>
      ) : (
        <div className={styles.actions}>
          {canPrev ? (
            <Button
              type="button"
              variant="default"
              appearance="ghost"
              disabled={busy}
              onClick={() => goToPage(pageIdx - 1)}
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
              onClick={() => void goNext()}
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

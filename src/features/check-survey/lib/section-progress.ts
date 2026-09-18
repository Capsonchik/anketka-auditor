import type { PublicPaPage, PublicPaQuestion } from '@/entities/public-pa'
import { questionAnswerKey } from '@/entities/public-pa'

import type { AnswersMap } from './answer-model'
import { isQuestionAnswerFilled, isQuestionVisibleByLogic } from './survey-logic'

export type LoopProgressInput = {
  completedCount: number
  totalCount: number | null
  allCompleted?: boolean
}

/** Секция полностью закрыта (можно идти дальше) */
export function isSectionComplete(
  page: PublicPaPage,
  answers: AnswersMap,
  loop?: LoopProgressInput,
): boolean {
  if (page.sectionType === 'loop') {
    if (loop?.allCompleted) return true
    const total = loop?.totalCount
    const done = loop?.completedCount ?? 0
    if (total != null && total > 0) return done >= total
    // total неизвестен: loop считаем «в работе», не complete
    return false
  }

  const visible = (page.questions || []).filter((q) => isQuestionVisibleByLogic(q, answers))
  if (!visible.length) return true
  const required = visible.filter((q) => q.required)
  const pool: PublicPaQuestion[] = required.length > 0 ? required : visible
  return pool.every((q) => isQuestionAnswerFilled(q, answers[questionAnswerKey(q)]))
}

/** Доля заполнения одной секции (страницы): 0..1 */
export function getSectionFillRatio(
  page: PublicPaPage,
  answers: AnswersMap,
  loop?: LoopProgressInput,
): number {
  if (page.sectionType === 'loop') {
    const total = loop?.totalCount
    const done = loop?.completedCount ?? 0
    if (total != null && total > 0) return Math.min(1, Math.max(0, done / total))
    return 0
  }

  const visible = (page.questions || []).filter((q) => isQuestionVisibleByLogic(q, answers))
  if (!visible.length) return 1

  const required = visible.filter((q) => q.required)
  const pool: PublicPaQuestion[] = required.length > 0 ? required : visible
  const filled = pool.filter((q) => isQuestionAnswerFilled(q, answers[questionAnswerKey(q)])).length
  return filled / pool.length
}

/** Прогресс анкеты по секциям (не по каждому полю), % 0..100 */
export function getSurveySectionsProgressPercent(
  pages: PublicPaPage[],
  answers: AnswersMap,
  loop?: LoopProgressInput,
): number {
  if (!pages.length) return 0
  const sum = pages.reduce((acc, page) => acc + getSectionFillRatio(page, answers, loop), 0)
  return Math.round((sum / pages.length) * 100)
}

/**
 * Куда открыть wizard после reload:
 * первая незакрытая секция по answers + completion (pageIdx из draft часто «застрял» на loop).
 */
export function resolveResumePageIdx(
  pages: PublicPaPage[],
  answers: AnswersMap,
  loop?: LoopProgressInput,
): number {
  if (!pages.length) return 0
  for (let i = 0; i < pages.length; i += 1) {
    if (!isSectionComplete(pages[i], answers, loop)) return i
  }
  return pages.length - 1
}

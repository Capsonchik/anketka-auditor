import type { PublicPaCompletionMeta, PublicPaDraftPayload, PublicPaPage } from '@/entities/public-pa'
import { questionAnswerKey } from '@/entities/public-pa'

export type AnswersMap = Record<string, unknown>

export function flattenAnswersTree(nested: Record<string, unknown>): AnswersMap {
  const out: AnswersMap = {}
  const take = (source: Record<string, unknown>) => {
    for (const [k, v] of Object.entries(source)) {
      if (k === 'screening' || k === 'product') continue
      if (v == null) continue
      out[k] = v
    }
  }

  take(nested)
  if (nested.screening && typeof nested.screening === 'object' && !Array.isArray(nested.screening)) {
    take(nested.screening as Record<string, unknown>)
  }
  if (nested.product && typeof nested.product === 'object' && !Array.isArray(nested.product)) {
    take(nested.product as Record<string, unknown>)
  }
  return out
}

export function extractAnswersFromDraft(
  draft: Record<string, unknown> | null | undefined,
): AnswersMap {
  if (!draft || typeof draft !== 'object') return {}
  const nested = draft.answers
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return flattenAnswersTree(nested as Record<string, unknown>)
  }
  return {}
}

export function extractCompletedValuesFromDraft(
  draft: Record<string, unknown> | null | undefined,
): Record<string, string[]> {
  if (!draft || typeof draft !== 'object') return {}
  const raw = draft.completedValuesByCode
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, string[]> = {}
  for (const [code, values] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(values)) continue
    out[code] = values.map((item) => String(item)).filter(Boolean)
  }
  return out
}

export function extractCompletionFromDraft(
  draft: Record<string, unknown> | null | undefined,
): PublicPaCompletionMeta | null {
  if (!draft || typeof draft !== 'object') return null
  const raw = draft.completion
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const completion = raw as Record<string, unknown>
  const itemsCompleted = Number(completion.itemsCompleted)
  if (!Number.isFinite(itemsCompleted)) return null
  const itemsTotalRaw = completion.itemsTotal
  const itemsTotal =
    itemsTotalRaw == null || itemsTotalRaw === ''
      ? null
      : Number.isFinite(Number(itemsTotalRaw))
        ? Number(itemsTotalRaw)
        : null
  return {
    itemsCompleted,
    itemsTotal,
    allCompleted: Boolean(completion.allCompleted),
  }
}

export function extractPageIdxFromDraft(draft: Record<string, unknown> | null | undefined): number {
  if (!draft || typeof draft !== 'object') return 0
  const raw = Number(draft.pageIdx)
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0
}

export function extractSubmittedCountFromDraft(
  draft: Record<string, unknown> | null | undefined,
): number {
  if (!draft || typeof draft !== 'object') return 0
  const raw = Number(draft.submittedCount)
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0
}

export function buildDraftPayload(input: {
  pageIdx: number
  answers: AnswersMap
  submittedCount: number
  completedValuesByCode: Record<string, string[]>
}): PublicPaDraftPayload {
  return {
    pageIdx: input.pageIdx,
    answers: input.answers,
    submittedCount: input.submittedCount,
    completedValuesByCode: input.completedValuesByCode,
    savedAt: new Date().toISOString(),
  }
}

export function splitScreeningProductAnswers(input: {
  answers: AnswersMap
  screeningCodes: string[]
  repeatCodes: string[]
}): { screening: AnswersMap; product: AnswersMap } {
  const screening: AnswersMap = {}
  const product: AnswersMap = {}
  for (const code of input.screeningCodes) {
    if (typeof input.answers[code] !== 'undefined') screening[code] = input.answers[code]
  }
  for (const code of input.repeatCodes) {
    if (typeof input.answers[code] !== 'undefined') product[code] = input.answers[code]
  }
  return { screening, product }
}

export function collectPageCodes(page: PublicPaPage | null | undefined): string[] {
  if (!page) return []
  const out: string[] = []
  for (const q of page.questions || []) {
    const code = questionAnswerKey(q)
    if (code) out.push(code)
  }
  return out
}

export function isAuditorIdentityCode(code: string): boolean {
  return code === 'auditorName' || code === 'auditorPhone' || code === 'auditorEmail'
}

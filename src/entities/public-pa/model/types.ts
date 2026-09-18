export type PublicPaOption = {
  id: string
  label: string
  value: string
  sortOrder: number
  points?: number
  isExclusive?: boolean
  isNA?: boolean
}

export type PublicPaQuestion = {
  id: string
  publicId: number
  type: string
  code: string | null
  title: string
  description: string | null
  required: boolean
  sortOrder: number
  config: Record<string, unknown> | null
  logic?: Record<string, unknown> | null
  display?: Record<string, unknown> | null
  options: PublicPaOption[]
  allowNa?: boolean
  allowComment?: boolean
}

export type PublicPaPage = {
  id: string
  title: string
  sortOrder: number
  sectionType: 'regular' | 'loop'
  loopConfig?: Record<string, unknown> | null
  questions: PublicPaQuestion[]
}

export type PublicPaBuilder = {
  surveyId: string
  pages: PublicPaPage[]
  status?: string
}

export type PublicPaSession = {
  token: string
  purpose: string
  project: { id: string; name: string }
  survey: {
    id: string
    title: string
    category: string | null
    templateKey: string | null
  }
  builder: PublicPaBuilder
}

export type PublicPaCompletionMeta = {
  itemsCompleted: number
  itemsTotal: number | null
  allCompleted: boolean
}

export type PublicPaLoopIteration = {
  id: string
  /** Ключ completedValues (SKU / cascade key) */
  key: string
  label: string
  product: Record<string, unknown>
  submittedAt: string
}

export type PublicPaDraftPayload = {
  pageIdx?: number
  answers?: Record<string, unknown>
  submittedCount?: number
  completedValuesByCode?: Record<string, string[]>
  /** Снимки product-ответов по итерациям loop (для просмотра после отправки) */
  loopIterations?: PublicPaLoopIteration[]
  savedAt?: string
  completion?: Partial<PublicPaCompletionMeta> | null
}

export type PublicPaDraftResponse = {
  draft: (PublicPaDraftPayload & Record<string, unknown>) | null
}

export type PublicPaDraftSaveResponse = {
  saved: boolean
  attemptId: string
}

export type PublicPaDraftBody = {
  draft?: Record<string, unknown> | null
  answers?: Record<string, unknown>
  context?: { checkId: string } | null
}

export type PublicPaSubmitBody = {
  answers: Record<string, unknown>
  mode?: 'continue' | 'finish'
  context?: { checkId: string } | null
}

export type PublicPaOptionsItem = {
  value: string
  label: string
}

export type PublicPaOptionsResponse = {
  items: PublicPaOptionsItem[]
}

export function questionAnswerKey(question: PublicPaQuestion): string {
  const code = String(question.code ?? '').trim()
  if (code) return code
  const configCode = String(
    question.config && typeof question.config === 'object'
      ? (question.config as Record<string, unknown>).code ?? ''
      : '',
  ).trim()
  if (configCode) return configCode
  return String(question.id ?? '').trim()
}

export function getConfigString(
  cfg: Record<string, unknown> | null | undefined,
  key: string,
): string | null {
  if (!cfg) return null
  const v = cfg[key]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

export function getConfigBoolean(
  cfg: Record<string, unknown> | null | undefined,
  key: string,
): boolean {
  if (!cfg) return false
  return Boolean(cfg[key])
}

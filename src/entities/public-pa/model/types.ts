export type PublicPaOption = {
  id: string
  label: string
  value: string
  sortOrder: number
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
  options: PublicPaOption[]
}

export type PublicPaPage = {
  id: string
  title: string
  sortOrder: number
  sectionType: 'regular' | 'loop'
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

export type PublicPaDraftResponse = {
  draft: Record<string, unknown> | null
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

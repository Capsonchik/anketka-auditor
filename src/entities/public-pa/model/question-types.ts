/** Канонические типы одиночного выбора в PA / check-survey. */

export const RADIO_QUESTION_TYPE = 'radio'
export const SINGLE_QUESTION_TYPE = 'single'

/**
 * Radio / RadioGroup.
 * Legacy: single_choice / single_choise — раньше так называли radio-список.
 * Канонический `single` сюда НЕ входит (это SelectPicker).
 */
export const RADIO_TYPE_ALIASES = new Set([
  'radio',
  'single_choice',
  'single_choise',
])

/**
 * SelectPicker.
 * Legacy: select / dropdown.
 * Канонический `single` — новый тип списка.
 */
export const SINGLE_TYPE_ALIASES = new Set([
  'single',
  'select',
  'dropdown',
])

export const MULTI_CHOICE_TYPE_ALIASES = new Set([
  'multi_choice',
  'multiselect',
  'checkbox',
  'check',
])

export function isRadioQuestionType(type: string | null | undefined): boolean {
  if (!type) return false
  return RADIO_TYPE_ALIASES.has(String(type).trim().toLowerCase())
}

export function isSingleQuestionType(type: string | null | undefined): boolean {
  if (!type) return false
  return SINGLE_TYPE_ALIASES.has(String(type).trim().toLowerCase())
}

export function isMultiChoiceQuestionType(type: string | null | undefined): boolean {
  if (!type) return false
  return MULTI_CHOICE_TYPE_ALIASES.has(String(type).trim().toLowerCase())
}

/** Нормализация type из API/legacy к канону. */
export function normalizeQuestionType(type: string | null | undefined): string {
  const raw = String(type || '').trim()
  if (!raw) return 'short_text'
  const lower = raw.toLowerCase()
  if (RADIO_TYPE_ALIASES.has(lower)) return RADIO_QUESTION_TYPE
  if (SINGLE_TYPE_ALIASES.has(lower)) return SINGLE_QUESTION_TYPE
  if (MULTI_CHOICE_TYPE_ALIASES.has(lower)) return 'multi_choice'
  return raw
}

export type ChoiceUiKind = 'radio' | 'single' | 'check'

/**
 * UI одиночного/множественного выбора.
 * config.ui имеет приоритет над type.
 */
export function resolveChoiceUi(
  type: string | null | undefined,
  config?: Record<string, unknown> | null,
): ChoiceUiKind | null {
  const uiRaw =
    config && typeof config.ui === 'string' ? config.ui.trim().toLowerCase() : ''
  if (uiRaw === 'radio') return 'radio'
  if (uiRaw === 'select' || uiRaw === 'selectpicker' || uiRaw === 'single') return 'single'
  if (uiRaw === 'check' || uiRaw === 'checkbox' || uiRaw === 'checkpicker') return 'check'

  const normalized = normalizeQuestionType(type)
  if (normalized === RADIO_QUESTION_TYPE) return 'radio'
  if (normalized === SINGLE_QUESTION_TYPE) return 'single'
  if (normalized === 'multi_choice') return 'check'
  return null
}

/** Канонические типы одиночного выбора в PA / check-survey. */

export const RADIO_QUESTION_TYPE = 'radio'
export const SINGLE_QUESTION_TYPE = 'single'

export const RADIO_TYPE_ALIASES = new Set([
  'radio',
  'single_choice',
  'single_choise',
])

export const SINGLE_LEGACY_TYPE_ALIASES = new Set([
  'select',
  'dropdown',
])

export const MULTI_CHOICE_TYPE_ALIASES = new Set([
  'multi_choice',
  'multiselect',
  'checkbox',
  'check',
])

const CATALOG_CONSTRUCTOR_TYPES = new Set([
  'city',
  'region',
  'outlet',
  'nomenclature',
])

export function isSelectPickerConfig(config: Record<string, unknown> | null | undefined): boolean {
  if (!config) return false
  if (config.source) return true
  if (config.filters || config.dependsOnCodes) return true
  const ct = String(config.constructorType ?? '').trim().toLowerCase()
  if (CATALOG_CONSTRUCTOR_TYPES.has(ct)) return true
  return false
}

export function normalizeQuestionType(
  type: string | null | undefined,
  config?: Record<string, unknown> | null,
): string {
  const raw = String(type || '').trim()
  if (!raw) return 'short_text'
  const lower = raw.toLowerCase()
  if (RADIO_TYPE_ALIASES.has(lower)) return RADIO_QUESTION_TYPE
  if (SINGLE_LEGACY_TYPE_ALIASES.has(lower)) return SINGLE_QUESTION_TYPE
  if (lower === 'single') {
    return isSelectPickerConfig(config) ? SINGLE_QUESTION_TYPE : RADIO_QUESTION_TYPE
  }
  if (MULTI_CHOICE_TYPE_ALIASES.has(lower)) return 'multi_choice'
  return raw
}

export function isRadioQuestionType(
  type: string | null | undefined,
  config?: Record<string, unknown> | null,
): boolean {
  return normalizeQuestionType(type, config) === RADIO_QUESTION_TYPE
}

export function isSingleQuestionType(
  type: string | null | undefined,
  config?: Record<string, unknown> | null,
): boolean {
  return normalizeQuestionType(type, config) === SINGLE_QUESTION_TYPE
}

export function isMultiChoiceQuestionType(type: string | null | undefined): boolean {
  if (!type) return false
  return MULTI_CHOICE_TYPE_ALIASES.has(String(type).trim().toLowerCase())
}

export type ChoiceUiKind = 'radio' | 'single' | 'check'

export function resolveChoiceUi(
  type: string | null | undefined,
  config?: Record<string, unknown> | null,
): ChoiceUiKind | null {
  const uiRaw =
    config && typeof config.ui === 'string' ? config.ui.trim().toLowerCase() : ''
  if (uiRaw === 'radio') return 'radio'
  if (uiRaw === 'select' || uiRaw === 'selectpicker' || uiRaw === 'single') return 'single'
  if (uiRaw === 'check' || uiRaw === 'checkbox' || uiRaw === 'checkpicker') return 'check'

  const normalized = normalizeQuestionType(type, config)
  if (normalized === RADIO_QUESTION_TYPE) return 'radio'
  if (normalized === SINGLE_QUESTION_TYPE) return 'single'
  if (normalized === 'multi_choice') return 'check'
  return null
}

/** @deprecated используйте normalizeQuestionType */
export const SINGLE_TYPE_ALIASES = new Set([
  'single',
  'select',
  'dropdown',
])

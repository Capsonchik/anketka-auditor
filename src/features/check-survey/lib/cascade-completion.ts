export type CascadeFilterLink = {
  fromQuestionCode: string
  targetColumn: string
}

type FilterRowLike = {
  fromQuestionCode?: unknown
  targetColumn?: unknown
}

export function getFilterLinksFromConfig(
  config: Record<string, unknown> | null | undefined,
): CascadeFilterLink[] {
  if (!Array.isArray(config?.filters)) return []
  return config.filters
    .map((item) => item as FilterRowLike)
    .filter((item) => typeof item.fromQuestionCode === 'string' && typeof item.targetColumn === 'string')
    .map((item) => ({
      fromQuestionCode: String(item.fromQuestionCode).trim(),
      targetColumn: String(item.targetColumn).trim(),
    }))
    .filter((item) => item.fromQuestionCode && item.targetColumn)
}

export function buildCompletedOptionKey(
  config: Record<string, unknown> | null | undefined,
  answers: Record<string, unknown>,
  optionValue: string,
): string {
  const value = optionValue.trim()
  if (!value) return ''
  const links = getFilterLinksFromConfig(config)
  if (!links.length) return value

  const parentParts: string[] = []
  for (const link of links) {
    const parentRaw = answers[link.fromQuestionCode]
    if (typeof parentRaw !== 'string' && typeof parentRaw !== 'number') return ''
    const parentValue = String(parentRaw).trim()
    if (!parentValue) return ''
    parentParts.push(`${link.fromQuestionCode}=${parentValue}`)
  }

  return `${parentParts.join('|')}|__value=${value}`
}

export function isCompletedOptionHidden(
  config: Record<string, unknown> | null | undefined,
  answers: Record<string, unknown>,
  optionValue: string,
  completedKeys: string[],
): boolean {
  const links = getFilterLinksFromConfig(config)
  const value = String(optionValue).trim()
  if (!value) return false
  const compositeKey = buildCompletedOptionKey(config, answers, value)
  if (compositeKey && completedKeys.includes(compositeKey)) return true
  if (!links.length && completedKeys.includes(value)) return true
  return false
}

export function getVisibleOptionsWithCompletedFallback<T>({
  options,
  shouldSkipCompleted,
  allowFallbackWhenAllHidden,
  isHidden,
}: {
  options: T[]
  shouldSkipCompleted: boolean
  allowFallbackWhenAllHidden: boolean
  isHidden: (option: T) => boolean
}): { visibleOptions: T[]; hiddenCount: number; usedFallback: boolean } {
  if (!shouldSkipCompleted) {
    return { visibleOptions: options, hiddenCount: 0, usedFallback: false }
  }
  const hiddenCount = options.reduce((acc, option) => (isHidden(option) ? acc + 1 : acc), 0)
  const filtered = options.filter((option) => !isHidden(option))
  if (filtered.length === 0 && options.length > 0 && allowFallbackWhenAllHidden) {
    return { visibleOptions: options, hiddenCount, usedFallback: true }
  }
  return { visibleOptions: filtered, hiddenCount, usedFallback: false }
}

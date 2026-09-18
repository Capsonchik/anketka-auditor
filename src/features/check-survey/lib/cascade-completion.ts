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

/** Разбор ключа completedValues → родители каскада + value опции */
export function parseCompletedOptionKey(key: string): {
  parents: Record<string, string>
  value: string
} {
  const raw = String(key || '').trim()
  if (!raw) return { parents: {}, value: '' }
  if (!raw.includes('__value=')) {
    return { parents: {}, value: raw }
  }
  const parts = raw.split('|')
  const parents: Record<string, string> = {}
  let value = ''
  for (const part of parts) {
    if (part.startsWith('__value=')) {
      value = part.slice('__value='.length)
      continue
    }
    const eq = part.indexOf('=')
    if (eq <= 0) continue
    const code = part.slice(0, eq).trim()
    const val = part.slice(eq + 1).trim()
    if (code && val) parents[code] = val
  }
  return { parents, value: value || raw }
}

export function formatCompletedOptionLabel(key: string): string {
  const { value } = parseCompletedOptionKey(key)
  return value || key
}

/**
 * Реконструкция product-ответов для readonly-просмотра без loopIterations:
 * SKU из ключа + родители каскада (из ключа или единственного completedValues родителя).
 */
export function reconstructLoopProductFromCompletedKey(input: {
  completedKey: string
  primaryCode: string
  /** Коды dependsOn / filters.fromQuestionCode у primary-вопроса */
  parentCodes: string[]
  completedValuesByCode: Record<string, string[]>
  dependentCodesByDriver: Map<string, Set<string>>
}): Record<string, unknown> {
  const parsed = parseCompletedOptionKey(input.completedKey)
  const overlay: Record<string, unknown> = { ...parsed.parents }
  if (parsed.value) overlay[input.primaryCode] = parsed.value

  const takeParentValue = (parentCode: string) => {
    if (overlay[parentCode] != null && String(overlay[parentCode]).trim()) return
    const values = input.completedValuesByCode[parentCode]
    if (!Array.isArray(values) || values.length === 0) return
    if (values.length === 1) {
      const parentParsed = parseCompletedOptionKey(values[0])
      for (const [k, v] of Object.entries(parentParsed.parents)) {
        if (overlay[k] == null) overlay[k] = v
      }
      overlay[parentCode] = parentParsed.value || formatCompletedOptionLabel(values[0])
      return
    }
    for (const raw of values) {
      const parentParsed = parseCompletedOptionKey(raw)
      const candidate = parentParsed.value || formatCompletedOptionLabel(raw)
      if (
        input.completedKey.includes(`${parentCode}=${candidate}`) ||
        input.completedKey.includes(`=${candidate}|`)
      ) {
        overlay[parentCode] = candidate
        for (const [k, v] of Object.entries(parentParsed.parents)) {
          if (overlay[k] == null) overlay[k] = v
        }
        return
      }
    }
  }

  for (const code of input.parentCodes) takeParentValue(code)

  // SKU зависит от категории (категория — driver)
  for (const [driverCode, dependents] of input.dependentCodesByDriver) {
    if (!dependents.has(input.primaryCode)) continue
    takeParentValue(driverCode)
  }

  // Категория зависит от SKU — или просто соседнее поле с одним completed (1/1)
  const dependentsOfPrimary = input.dependentCodesByDriver.get(input.primaryCode)
  if (dependentsOfPrimary) {
    for (const dep of dependentsOfPrimary) takeParentValue(dep)
  }
  for (const [code, values] of Object.entries(input.completedValuesByCode)) {
    if (code === input.primaryCode) continue
    if (!Array.isArray(values) || values.length !== 1) continue
    takeParentValue(code)
  }

  return overlay
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

/** Учитывать ответ в completedValues после continue на loop */
export function shouldTrackCompletedInLoop(config: Record<string, unknown> | null | undefined): boolean {
  if (!config) return false
  if (Boolean(config.skipCompletedInLoop)) return true
  const source = typeof config.source === 'string' ? config.source : ''
  // checklist cascade без явного флага — тоже «уже учтён»
  return source.includes('checklist')
}

/**
 * Скрывать ли option из списка.
 * Для checklist скрываем и driver (SKU), для остальных — как /pa: только leaf.
 */
export function shouldHideCompletedInLoop(
  config: Record<string, unknown> | null | undefined,
  isDriverForCascade: boolean,
): boolean {
  if (!shouldTrackCompletedInLoop(config)) return false
  const source = typeof config?.source === 'string' ? config.source : ''
  if (source.includes('checklist')) return true
  return !isDriverForCascade
}

/**
 * Один код на итерацию loop для списка «Отправленные позиции»
 * (не смешивать SKU и «Препарат» в один flat-список).
 */
export function resolvePrimaryLoopCompletedCode(input: {
  questions: Array<{
    code?: string | null
    id: string
    config: Record<string, unknown> | null
  }>
  getCode: (q: { code?: string | null; id: string; config: Record<string, unknown> | null }) => string
  completedValuesByCode: Record<string, string[]>
  dependentCodesByDriver: Map<string, Set<string>>
}): string | null {
  const { questions, getCode, completedValuesByCode, dependentCodesByDriver } = input
  type Candidate = { code: string; score: number; count: number }
  const candidates: Candidate[] = []

  for (const q of questions) {
    const code = getCode(q)
    if (!code || !shouldTrackCompletedInLoop(q.config)) continue
    const values = completedValuesByCode[code]
    const count = Array.isArray(values) ? values.length : 0
    if (count <= 0) continue
    const source = typeof q.config?.source === 'string' ? q.config.source : ''
    const isDriver = Boolean(dependentCodesByDriver.get(code)?.size)
    let score = count * 10
    if (source.includes('checklist')) score += 50
    if (Boolean(q.config?.skipCompletedInLoop)) score += 20
    if (isDriver) score += 10
    candidates.push({ code, score, count })
  }

  if (!candidates.length) {
    let best: { code: string; count: number } | null = null
    for (const [code, values] of Object.entries(completedValuesByCode)) {
      const count = Array.isArray(values) ? values.length : 0
      if (!best || count > best.count) best = { code, count }
    }
    return best && best.count > 0 ? best.code : null
  }

  candidates.sort((a, b) => b.score - a.score || b.count - a.count)
  return candidates[0]?.code ?? null
}

import { getFilterLinksFromConfig } from './cascade-completion'

function getConfigString(cfg: Record<string, unknown> | null, key: string): string | null {
  if (!cfg) return null
  const v = cfg[key]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

export function getDependsOnCodesFromConfig(config: Record<string, unknown> | null): string[] {
  if (!config) return []
  const filters = Array.isArray(config.filters)
    ? config.filters
        .map((item) => {
          const row = item as { fromQuestionCode?: unknown }
          const code = typeof row.fromQuestionCode === 'string' ? row.fromQuestionCode.trim() : ''
          return code
        })
        .filter(Boolean)
    : []
  if (filters.length) return Array.from(new Set(filters))
  if (Array.isArray(config.dependsOnCodes)) {
    return config.dependsOnCodes.map((item) => String(item).trim()).filter(Boolean)
  }
  // Новый cascade API (valueColumn/labelColumn) — зависимости только из filters/dependsOnCodes
  if (getConfigString(config, 'valueColumn') || getConfigString(config, 'labelColumn')) {
    return []
  }

  const source = getConfigString(config, 'source')
  if (source === 'ref_cities') return ['region']
  if (source === 'project_shop_addresses') return ['shopBrand']
  if (source === 'project_checklist_brands' || source === 'checklist_brands') return ['productGroup']
  if (source === 'project_checklist_products' || source === 'checklist_products') {
    return ['productGroup', 'productBrand']
  }
  return []
}

function buildSourceFiltersFromConfig(
  config: Record<string, unknown> | null,
  answers: Record<string, unknown>,
): Record<string, string> {
  const filtersFromConfig = getFilterLinksFromConfig(config)
  const result: Record<string, string> = {}
  for (const item of filtersFromConfig) {
    const answerValue = answers[item.fromQuestionCode]
    if (typeof answerValue !== 'string' && typeof answerValue !== 'number') continue
    const normalized = String(answerValue).trim()
    if (!normalized) continue
    result[item.targetColumn] = normalized
  }
  return result
}

export function buildPaOptionsRequestParams(input: {
  config: Record<string, unknown> | null
  answers: Record<string, unknown>
}): Record<string, string> | null {
  const cfg = input.config
  const source = getConfigString(cfg, 'source')
  if (!source) return null

  const params: Record<string, string> = { source }
  const valueColumn = getConfigString(cfg, 'valueColumn')
  const labelColumn = getConfigString(cfg, 'labelColumn')
  if (valueColumn) params.valueColumn = valueColumn
  if (labelColumn) params.labelColumn = labelColumn

  const sourceFilters = buildSourceFiltersFromConfig(cfg, input.answers)
  if (Object.keys(sourceFilters).length) {
    params.filtersJson = JSON.stringify(sourceFilters)
  }

  const dependsOnCodes = getDependsOnCodesFromConfig(cfg)
  for (const dependsCode of dependsOnCodes) {
    const value = input.answers[dependsCode]
    if (typeof value === 'string' || typeof value === 'number') {
      const normalized = String(value).trim()
      if (!normalized) continue
      params[dependsCode] = normalized
    }
  }

  return params
}

export function buildPaOptionsCacheKey(params: Record<string, string>): string {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}

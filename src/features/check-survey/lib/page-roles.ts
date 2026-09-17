import type { PublicPaPage } from '@/entities/public-pa'

export function findScreeningPageIndex(pages: PublicPaPage[]): number {
  const loopIdx = pages.findIndex((p) => p.sectionType === 'loop')
  if (loopIdx > 0) return 0
  const screeningIdx = pages.findIndex((p) => p.title === 'Скрининг')
  return screeningIdx >= 0 ? screeningIdx : 0
}

export function findRepeatPageIndex(pages: PublicPaPage[]): number | null {
  const idx = pages.findIndex((p) => p.sectionType === 'loop')
  if (idx >= 0) return idx
  const fallback = pages.findIndex((p) => p.title === 'Анкета')
  return fallback >= 0 ? fallback : null
}

export function buildDependentCodesByDriver(
  pages: PublicPaPage[],
  getCode: (q: { code?: string | null; id: string; config: Record<string, unknown> | null }) => string,
  getDependsOnCodes: (config: Record<string, unknown> | null) => string[],
): Map<string, Set<string>> {
  const questionCodes = new Set<string>()
  for (const page of pages) {
    for (const q of page.questions || []) {
      const code = getCode(q)
      if (code) questionCodes.add(code)
    }
  }

  const map = new Map<string, Set<string>>()
  for (const page of pages) {
    for (const q of page.questions || []) {
      const targetCode = getCode(q)
      if (!targetCode) continue
      for (const dependsCode of getDependsOnCodes(q.config)) {
        if (!dependsCode || !questionCodes.has(dependsCode)) continue
        const bucket = map.get(dependsCode) ?? new Set<string>()
        bucket.add(targetCode)
        map.set(dependsCode, bucket)
      }
    }
  }
  return map
}

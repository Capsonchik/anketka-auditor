import type { DateKey, YearMonth } from '../model/types'

/** Локальная календарная дата без сдвига UTC. */
export function toDateKey(date: Date): DateKey {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function toYearMonth(date: Date): YearMonth {
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function shiftYearMonth(view: YearMonth, deltaMonths: number): YearMonth {
  const cursor = new Date(view.year, view.month + deltaMonths, 1)
  return toYearMonth(cursor)
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Пн=0 … Вс=6 */
export function mondayBasedWeekday(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function daysInMonth(view: YearMonth): number {
  return new Date(view.year, view.month + 1, 0).getDate()
}

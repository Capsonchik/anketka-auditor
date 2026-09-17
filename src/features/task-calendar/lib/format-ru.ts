import { MONTH_NAMES_GENITIVE, MONTH_NAMES_NOMINATIVE } from '../model/constants'
import type { DateKey, YearMonth } from '../model/types'
import { parseDateKey } from './date-key'

export function formatMonthTitle(view: YearMonth): string {
  return `${MONTH_NAMES_NOMINATIVE[view.month]} ${view.year}`
}

export function formatAgendaTitle(dateKey: DateKey): string {
  const date = parseDateKey(dateKey)
  return `${date.getDate()} ${MONTH_NAMES_GENITIVE[date.getMonth()]} ${date.getFullYear()}`
}

export function formatDayAriaLabel(dateKey: DateKey): string {
  return formatAgendaTitle(dateKey)
}

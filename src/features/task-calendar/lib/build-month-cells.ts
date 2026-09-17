import type { CalendarCell, DateKey, YearMonth } from '../model/types'
import {
  daysInMonth,
  isSameDay,
  mondayBasedWeekday,
  startOfToday,
  toDateKey,
} from './date-key'

type BuildMonthCellsParams = {
  view: YearMonth
  selectedDate: DateKey
  taskCountByDate: Map<DateKey, number>
}

/**
 * Строит сетку месяца: ведущие blank + дни.
 * Чистая функция — удобно тестировать и переиспользовать (SRP).
 */
export function buildMonthCells({
  view,
  selectedDate,
  taskCountByDate,
}: BuildMonthCellsParams): CalendarCell[] {
  const today = startOfToday()
  const first = new Date(view.year, view.month, 1)
  const leadingBlanks = mondayBasedWeekday(first)
  const totalDays = daysInMonth(view)
  const cells: CalendarCell[] = []

  for (let i = 0; i < leadingBlanks; i += 1) {
    cells.push({ kind: 'blank', key: `blank-${view.year}-${view.month}-${i}` })
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(view.year, view.month, day)
    const key = toDateKey(date)
    const taskCount = taskCountByDate.get(key) ?? 0
    cells.push({
      kind: 'day',
      key,
      date,
      dayNumber: day,
      isToday: isSameDay(date, today),
      isSelected: key === selectedDate,
      hasTasks: taskCount > 0,
      taskCount,
    })
  }

  return cells
}

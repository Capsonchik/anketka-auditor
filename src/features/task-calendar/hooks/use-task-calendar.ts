'use client'

import { useCallback, useMemo, useState } from 'react'

import { buildMonthCells } from '../lib/build-month-cells'
import { countTasksByDate, groupTasksByDate, tasksForDate } from '../lib/group-tasks-by-date'
import {
  shiftYearMonth,
  startOfToday,
  toDateKey,
  toYearMonth,
} from '../lib/date-key'
import { formatAgendaTitle, formatMonthTitle } from '../lib/format-ru'
import type { CalendarTask, DateKey, YearMonth } from '../model/types'

type UseTaskCalendarParams = {
  tasks: CalendarTask[]
  initialDate?: Date
}

export function useTaskCalendar({ tasks, initialDate }: UseTaskCalendarParams) {
  const today = useMemo(() => initialDate ?? startOfToday(), [initialDate])
  const [view, setView] = useState<YearMonth>(() => toYearMonth(today))
  const [selectedDate, setSelectedDate] = useState<DateKey>(() => toDateKey(today))

  const taskCountByDate = useMemo(() => countTasksByDate(tasks), [tasks])
  const grouped = useMemo(() => groupTasksByDate(tasks), [tasks])

  const cells = useMemo(
    () => buildMonthCells({ view, selectedDate, taskCountByDate }),
    [view, selectedDate, taskCountByDate],
  )

  const selectedTasks = useMemo(
    () => tasksForDate(grouped, selectedDate),
    [grouped, selectedDate],
  )

  const goPrevMonth = useCallback(() => {
    setView((prev) => shiftYearMonth(prev, -1))
  }, [])

  const goNextMonth = useCallback(() => {
    setView((prev) => shiftYearMonth(prev, 1))
  }, [])

  const goToday = useCallback(() => {
    const now = startOfToday()
    setView(toYearMonth(now))
    setSelectedDate(toDateKey(now))
  }, [])

  const selectDate = useCallback((dateKey: DateKey) => {
    setSelectedDate(dateKey)
  }, [])

  return {
    view,
    selectedDate,
    cells,
    selectedTasks,
    monthTitle: formatMonthTitle(view),
    agendaTitle: formatAgendaTitle(selectedDate),
    goPrevMonth,
    goNextMonth,
    goToday,
    selectDate,
  }
}

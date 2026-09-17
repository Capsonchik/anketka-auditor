'use client'

import { useMemo } from 'react'

import { useGetAssignmentsQuery } from '@/entities/assignment/api/assignment.api'

import { useTaskCalendar } from '../hooks/use-task-calendar'
import { mapAssignmentsToCalendarTasks } from '../lib/map-assignment-to-calendar-task'
import type { CalendarTask } from '../model/types'
import { AgendaPanel } from './agenda-panel'
import { CalendarHeader } from './calendar-header'
import { MonthGrid } from './month-grid'
import styles from './task-calendar.module.scss'

type TaskCalendarProps = {
  /** Внешние задачи (для тестов / моков). Если не переданы — грузим assignments. */
  tasks?: CalendarTask[]
}

export function TaskCalendar({ tasks: tasksProp }: TaskCalendarProps) {
  const assignmentsQuery = useGetAssignmentsQuery(undefined, {
    skip: tasksProp != null,
  })

  const tasks = useMemo(() => {
    if (tasksProp) return tasksProp
    return mapAssignmentsToCalendarTasks(assignmentsQuery.data?.items ?? [])
  }, [tasksProp, assignmentsQuery.data?.items])

  const calendar = useTaskCalendar({ tasks })

  return (
    <section className={styles.root} aria-label="Календарь проверок">
      <CalendarHeader
        onPrevMonth={calendar.goPrevMonth}
        onNextMonth={calendar.goNextMonth}
        onToday={calendar.goToday}
      />
      <div className={styles.layout}>
        <MonthGrid
          monthTitle={calendar.monthTitle}
          cells={calendar.cells}
          onSelectDate={calendar.selectDate}
        />
        <AgendaPanel agendaTitle={calendar.agendaTitle} tasks={calendar.selectedTasks} />
      </div>
    </section>
  )
}

import type { CalendarTask, DateKey } from '../model/types'

export function groupTasksByDate(tasks: CalendarTask[]): Map<DateKey, CalendarTask[]> {
  const map = new Map<DateKey, CalendarTask[]>()
  for (const task of tasks) {
    const list = map.get(task.dueDate)
    if (list) list.push(task)
    else map.set(task.dueDate, [task])
  }
  return map
}

export function countTasksByDate(tasks: CalendarTask[]): Map<DateKey, number> {
  const map = new Map<DateKey, number>()
  for (const task of tasks) {
    map.set(task.dueDate, (map.get(task.dueDate) ?? 0) + 1)
  }
  return map
}

export function tasksForDate(
  grouped: Map<DateKey, CalendarTask[]>,
  dateKey: DateKey,
): CalendarTask[] {
  return grouped.get(dateKey) ?? []
}

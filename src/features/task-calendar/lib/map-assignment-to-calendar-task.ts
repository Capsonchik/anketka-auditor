import type { Assignment } from '@/entities/assignment/model/types'

import type { CalendarTask } from '../model/types'
import { toDateKey } from './date-key'

const STATUS_LABELS: Record<string, string> = {
  assigned: 'Назначено',
  accepted: 'Принято',
  in_progress: 'В работе',
  completed: 'Выполнено',
  overdue: 'Просрочено',
  declined: 'Отклонено',
}

/**
 * Адаптер Assignment → CalendarTask.
 * Пока крайней даты визита в API нет — используем assignedAt как день на календаре.
 * Когда появится endAt/dueAt — заменить одну строку здесь (OCP).
 */
export function mapAssignmentToCalendarTask(assignment: Assignment): CalendarTask | null {
  const raw = assignment.assignedAt
  if (!raw) return null
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return null

  const statusKey = String(assignment.status || '').toLowerCase()

  return {
    id: assignment.checkId,
    title: assignment.checkName || assignment.surveyTitle || 'Проверка',
    dueDate: toDateKey(parsed),
    subtitle: assignment.projectName,
    href: `/auditor/assignments/${assignment.checkId}`,
    status: STATUS_LABELS[statusKey] || assignment.status,
  }
}

export function mapAssignmentsToCalendarTasks(assignments: Assignment[]): CalendarTask[] {
  return assignments
    .map(mapAssignmentToCalendarTask)
    .filter((task): task is CalendarTask => task != null)
}

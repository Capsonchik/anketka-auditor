'use client'

import type { Assignment } from '@/entities/assignment/model/types'
import styles from './visit-meta.module.scss'

const STATUS_LABELS: Record<string, string> = {
  assigned: 'НАЗНАЧЕНО',
  in_progress: 'В РАБОТЕ',
  overdue: 'ПРОСРОЧЕНО',
  completed: 'ВЫПОЛНЕНО',
  accepted: 'ПРИНЯТО',
  declined: 'ОТКЛОНЕНО',
}

type VisitMetaProps = {
  assignment: Assignment
}

export function VisitMeta({ assignment }: VisitMetaProps) {
  const statusKey = assignment.status
  const statusClass =
    statusKey === 'overdue'
      ? styles.statusOverdue
      : statusKey === 'completed'
        ? styles.statusCompleted
        : statusKey === 'in_progress' || statusKey === 'accepted'
          ? styles.statusInProgress
          : styles.statusAssigned

  const progressLabel =
    assignment.itemsTotal != null
      ? `${assignment.itemsCompleted ?? 0} / ${assignment.itemsTotal}`
      : `${assignment.itemsCompleted ?? 0}`

  return (
    <header className={styles.root}>
      <div className={styles.top}>
        <h1 className={styles.title}>Детали задания: {assignment.checkName}</h1>
      </div>

      <div className={styles.card}>
        <p>
          <strong>Проект:</strong> {assignment.projectName}
        </p>
        <p>
          <strong>Анкета:</strong> {assignment.surveyTitle}
        </p>
        <p>
          <strong>Назначено:</strong>{' '}
          {new Date(assignment.assignedAt).toLocaleString('ru-RU')}
        </p>
        <p>
          <strong>Прогресс:</strong> {progressLabel}
        </p>
        <p className={styles.statusRow}>
          <strong>Статус:</strong>{' '}
          <span className={`${styles.badge} ${statusClass}`}>
            {STATUS_LABELS[statusKey] || statusKey.toUpperCase()}
          </span>
        </p>
        {assignment.checkStatus ? (
          <p>
            <strong>Статус проверки:</strong> {assignment.checkStatus}
          </p>
        ) : null}
      </div>
    </header>
  )
}

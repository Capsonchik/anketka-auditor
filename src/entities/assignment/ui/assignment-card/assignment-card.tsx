import React from 'react'
import Link from 'next/link'
import { Assignment } from '../../model/types'
import styles from './assignment-card.module.scss'

interface AssignmentCardProps {
  assignment: Assignment
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'НАЗНАЧЕНО'
      case 'completed':
        return 'ВЫПОЛНЕНО'
      case 'overdue':
        return 'ПРОСРОЧЕНО'
      case 'in_progress':
        return 'В РАБОТЕ'
      default:
        return status.toUpperCase()
    }
  }

  const actionHref = `/auditor/assignments/${assignment.checkId}`
  const actionLabel = assignment.status === 'assigned' ? 'Начать' : 'Продолжить'

  return (
    <div className={`${styles.taskCard} ${styles[`status-${assignment.status}`]}`}>
      <h2>{assignment.checkName}</h2>
      <p>
        <strong>Проект:</strong> {assignment.projectName}
      </p>
      <p>
        <strong>Анкета:</strong> {assignment.surveyTitle}
      </p>
      <p>
        <strong>Назначено:</strong> {new Date(assignment.assignedAt).toLocaleString()}
      </p>
      <p>
        <strong>Прогресс:</strong> {assignment.itemsCompleted ?? 0}
        {assignment.itemsTotal != null ? ` / ${assignment.itemsTotal}` : ''}
      </p>

      <span className={`${styles.status} ${styles[assignment.status]}`}>
        {getStatusLabel(assignment.status)}
      </span>

      <div className={styles.actionButtons}>
        <button type="button" className={styles.offlineBtn} disabled>
          Скачать для оффлайн
        </button>
        <Link href={actionHref} className={styles.actionBtn}>
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}

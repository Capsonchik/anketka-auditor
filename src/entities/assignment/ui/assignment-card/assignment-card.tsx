import React from 'react';
import { Assignment } from '../../model/types';
import styles from './assignment-card.module.scss';

interface AssignmentCardProps {
  assignment: Assignment;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'НАЗНАЧЕНО';
      case 'completed': return 'ВЫПОЛНЕНО';
      case 'overdue': return 'ПРОСРОЧЕНО';
      case 'in_progress': return 'В РАБОТЕ';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className={`${styles.taskCard} ${styles[`status-${assignment.status}`]}`}>
      <h2>{assignment.checkName}</h2>
      <p><strong>Проект:</strong> {assignment.projectName}</p>
      <p><strong>Анкета:</strong> {assignment.surveyTitle}</p>
      <p><strong>Назначено:</strong> {new Date(assignment.assignedAt).toLocaleString()}</p>
      <p><strong>Прогресс:</strong> {assignment.itemsCompleted} / {assignment.itemsTotal}</p>
      
      <span className={`${styles.status} ${styles[assignment.status]}`}>
        {getStatusLabel(assignment.status)}
      </span>
      
      <div className={styles.actionButtons}>
        <button className={styles.offlineBtn}>Скачать для оффлайн</button>
        <button className={styles.actionBtn}>
          {assignment.status === 'assigned' ? 'Начать' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
};

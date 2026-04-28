'use client'

import React from 'react'
import { useGetAssignmentsQuery } from '@/entities/assignment/api/assignment.api'
import { AssignmentCard } from '@/entities/assignment/ui/assignment-card/assignment-card'
import { Loader } from '@/shared/ui'
import styles from './page.module.scss'

export default function TasksPage() {
  const { data, isLoading, error } = useGetAssignmentsQuery()

  return (
    <div className={styles.tasksPage}>
      <h1>Мои Задания</h1>

      <div className={styles.filterPanel}>
        <input type="text" placeholder="ID проверки" />
        <input type="text" placeholder="Название / адрес" />
        <select>
          <option value="">Статус</option>
          <option value="assigned">Назначено</option>
          <option value="in-progress">В работе</option>
          <option value="completed">Выполнено</option>
          <option value="overdue">Просрочено</option>
          <option value="free">Свободные</option>
        </select>
        <button className={styles.resetBtn}>Сбросить</button>
        <button className={styles.applyBtn}>Применить</button>
      </div>

      <div className={styles.taskList}>
        {isLoading && <Loader />}
        {error && <p className={styles.errorText}>Ошибка при загрузке заданий</p>}
        {data?.items.map((assignment) => (
          <AssignmentCard key={assignment.checkId} assignment={assignment} />
        ))}
        {!isLoading && data?.items.length === 0 && (
          <p className={styles.emptyText}>У вас пока нет назначенных заданий</p>
        )}
      </div>
    </div>
  )
}

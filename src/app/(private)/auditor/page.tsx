import React from 'react'
import { getAuditorFromHeaders } from '@/entities/auditor/lib/get-auditor-from-headers'
import { getAuditorRatingStatsFromHeaders } from '@/entities/stats/lib/get-auditor-rating-stats-from-headers'
import styles from './page.module.scss'

const MOCK_TASKS = [
  { id: 1, date: '28.04', title: 'Аудит склада №4', type: 'Выездная', due: '18:00' },
  { id: 2, date: '29.04', title: 'Проверка отчетности ООО "Вектор"', type: 'Дистанционная', due: '12:00' },
]

const MOCK_NOTIFICATIONS = [
  { date: '27.04 14:20', text: 'Назначена новая проверка: Магазин "Продукты"' },
  { date: '27.04 10:05', text: 'Отчет по аудиту №128 принят в работу' },
]

export default async function AuditorPage() {
  const auditor = await getAuditorFromHeaders()
  const stats = await getAuditorRatingStatsFromHeaders()

  const summary = [
    {
      label: 'Средний рейтинг',
      value: stats?.avgRatingOutOf5?.toFixed(1) ?? '0.0',
      description: `На основе ${stats?.evaluationsCount ?? 0} оценок`,
      color: 'blue' as const,
    },
    {
      label: 'Активные проверки',
      value: stats?.activeChecksCount ?? 0,
      description: 'Требуют внимания',
      color: 'blue' as const,
    },
    {
      label: 'Просрочено',
      value: stats?.overdueChecksCount ?? 0,
      description: 'Критический приоритет',
      color: 'red' as const,
    },
  ]

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.welcomeMessage}>
        Привет, {auditor?.firstName || 'Аудитор'}!
      </h1>
      <div className={styles.dashboardGrid}>
        {summary.map((item, idx) => (
          <div key={idx} className={`${styles.card} ${styles.cardClickable} ${item.color === 'red' ? styles.red : ''}`}>
            <h2>{item.label}</h2>
            <div className={styles.value}>{item.value}</div>
            <div className={styles.description}>{item.description}</div>
          </div>
        ))}
      </div>

      <div className={`${styles.card} ${styles.taskList}`}>
        <h2>Ближайшие задачи</h2>
        <ul>
          {MOCK_TASKS.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <span className={styles.date}>{task.date}</span>
              <strong>{task.title}</strong> ({task.type}) - Срок: {task.due}
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.card} ${styles.notificationsList}`} style={{ marginTop: '20px' }}>
        <h2>Уведомления</h2>
        <ul>
          {MOCK_NOTIFICATIONS.map((notif, idx) => (
            <li key={idx}>
              <span className={styles.date}>{notif.date}</span>
              {notif.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

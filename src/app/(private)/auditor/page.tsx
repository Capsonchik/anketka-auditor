import React from 'react'
import { headers } from 'next/headers'
import { decrypt } from '@shared/lib/crypto'
import styles from './page.module.scss'

const MOCK_SUMMARY = [
  { label: 'Активные проверки', value: 12, description: 'Требуют внимания', color: 'blue' },
  { label: 'Просрочено', value: 3, description: 'Критический приоритет', color: 'red' },
  { label: 'Завершено (мес)', value: 45, description: 'Всего за апрель', color: 'green' },
]

const MOCK_TASKS = [
  { id: 1, date: '28.04', title: 'Аудит склада №4', type: 'Выездная', due: '18:00' },
  { id: 2, date: '29.04', title: 'Проверка отчетности ООО "Вектор"', type: 'Дистанционная', due: '12:00' },
]

const MOCK_NOTIFICATIONS = [
  { date: '27.04 14:20', text: 'Назначена новая проверка: Магазин "Продукты"' },
  { date: '27.04 10:05', text: 'Отчет по аудиту №128 принят в работу' },
]

export default async function AuditorPage() {  const headersList = await headers()
  const userDataRaw = headersList.get('x-user-data')
  
  let auditor = null
  if (userDataRaw) {
    try {
      const decryptedData = await decrypt(userDataRaw)
      auditor = JSON.parse(decryptedData)
    } catch (e) {
      console.error('Failed to decrypt or parse auditor data in page', e)
    }
  }

  return (    <div className={styles.dashboard}>
      <h1 className={styles.welcomeMessage}>
        Привет, {auditor?.firstName || 'Аудитор'}!
      </h1>
      <div className={styles.dashboardGrid}>
        {MOCK_SUMMARY.map((item, idx) => (
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

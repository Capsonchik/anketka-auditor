'use client'

import type { CalendarTask } from '../model/types'
import { TaskListItem } from './task-list-item'
import styles from './task-calendar.module.scss'

type AgendaPanelProps = {
  agendaTitle: string
  tasks: CalendarTask[]
}

export function AgendaPanel({ agendaTitle, tasks }: AgendaPanelProps) {
  return (
    <aside className={styles.agenda}>
      <div className={styles.agendaHead}>
        <span className={styles.eyebrow}>Проверки</span>
        <h3 className={styles.agendaTitle}>{agendaTitle}</h3>
      </div>
      <div className={styles.tasks}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>На этот день заданий нет.</div>
        ) : (
          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <TaskListItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

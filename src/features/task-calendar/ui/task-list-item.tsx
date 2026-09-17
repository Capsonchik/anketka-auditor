'use client'

import Link from 'next/link'

import type { CalendarTask } from '../model/types'
import styles from './task-calendar.module.scss'

type TaskListItemProps = {
  task: CalendarTask
}

export function TaskListItem({ task }: TaskListItemProps) {
  const content = (
    <>
      <span className={styles.taskTitle}>{task.title}</span>
      {task.subtitle ? <span className={styles.taskSubtitle}>{task.subtitle}</span> : null}
      {task.status ? <span className={styles.taskStatus}>{task.status}</span> : null}
    </>
  )

  if (task.href) {
    return (
      <li>
        <Link href={task.href} className={styles.taskItem}>
          {content}
        </Link>
      </li>
    )
  }

  return <li className={styles.taskItemStatic}>{content}</li>
}

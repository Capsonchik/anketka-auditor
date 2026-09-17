'use client'

import { clsx } from '@shared/lib/clsx'

import type { DateKey } from '../model/types'
import styles from './task-calendar.module.scss'

type DayCellProps = {
  dateKey: DateKey
  dayNumber: number
  isToday: boolean
  isSelected: boolean
  hasTasks: boolean
  ariaLabel: string
  onSelect: (dateKey: DateKey) => void
}

export function DayCell({
  dateKey,
  dayNumber,
  isToday,
  isSelected,
  hasTasks,
  ariaLabel,
  onSelect,
}: DayCellProps) {
  return (
    <button
      type="button"
      className={clsx(styles.day, {
        [styles.dayToday]: isToday,
        [styles.daySelected]: isSelected,
        [styles.dayHasTasks]: hasTasks,
      })}
      aria-label={ariaLabel}
      aria-current={isToday ? 'date' : undefined}
      aria-pressed={isSelected}
      onClick={() => onSelect(dateKey)}
    >
      <span className={styles.dayNumber}>{dayNumber}</span>
      {hasTasks ? <span className={styles.dayDot} aria-hidden="true" /> : null}
    </button>
  )
}

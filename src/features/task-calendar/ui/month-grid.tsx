'use client'

import { WEEKDAY_LABELS } from '../model/constants'
import type { CalendarCell, DateKey } from '../model/types'
import { formatDayAriaLabel } from '../lib/format-ru'
import { DayCell } from './day-cell'
import styles from './task-calendar.module.scss'

type MonthGridProps = {
  monthTitle: string
  cells: CalendarCell[]
  onSelectDate: (dateKey: DateKey) => void
}

export function MonthGrid({ monthTitle, cells, onSelectDate }: MonthGridProps) {
  return (
    <div className={styles.month}>
      <h3 className={styles.monthTitle}>{monthTitle}</h3>
      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className={styles.grid} role="grid" aria-label={monthTitle}>
        {cells.map((cell) => {
          if (cell.kind === 'blank') {
            return <span key={cell.key} className={styles.blank} aria-hidden="true" />
          }
          return (
            <DayCell
              key={cell.key}
              dateKey={cell.key}
              dayNumber={cell.dayNumber}
              isToday={cell.isToday}
              isSelected={cell.isSelected}
              hasTasks={cell.hasTasks}
              ariaLabel={formatDayAriaLabel(cell.key)}
              onSelect={onSelectDate}
            />
          )
        })}
      </div>
    </div>
  )
}

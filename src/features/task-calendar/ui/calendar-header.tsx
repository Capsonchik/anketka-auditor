'use client'

import styles from './task-calendar.module.scss'

type CalendarHeaderProps = {
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export function CalendarHeader({ onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerCopy}>
        <span className={styles.eyebrow}>Задания</span>
        <h2 className={styles.title}>Календарь проверок</h2>
        <p className={styles.subtitle}>
          Выберите день, чтобы увидеть проверки с этой крайней датой визита.
        </p>
      </div>
      <div className={styles.nav}>
        <button type="button" className={styles.navBtn} aria-label="Предыдущий месяц" onClick={onPrevMonth}>
          ‹
        </button>
        <button type="button" className={styles.todayBtn} onClick={onToday}>
          Сегодня
        </button>
        <button type="button" className={styles.navBtn} aria-label="Следующий месяц" onClick={onNextMonth}>
          ›
        </button>
      </div>
    </header>
  )
}

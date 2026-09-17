export type DateKey = string // YYYY-MM-DD

/** Абстракция задачи календаря — не зависит от Assignment (DIP). */
export type CalendarTask = {
  id: string
  title: string
  /** Крайняя дата визита / дедлайн дня */
  dueDate: DateKey
  subtitle?: string
  href?: string
  status?: string
}

export type CalendarCell =
  | { kind: 'blank'; key: string }
  | {
      kind: 'day'
      key: DateKey
      date: Date
      dayNumber: number
      isToday: boolean
      isSelected: boolean
      hasTasks: boolean
      taskCount: number
    }

export type YearMonth = {
  year: number
  month: number // 0–11
}

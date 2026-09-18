'use client'

import { forwardRef } from 'react'

import { Input, type InputProps } from '../input'

export type TimeInputProps = Omit<InputProps, 'type'> & {
  /** Значение `HH:mm` или `HH:mm:ss` */
  value?: string
  onChangeValue?: (next: string | null) => void
}

/** Нормализация к `HH:mm` для `<input type="time">` */
export function toTimeInputValue(raw: unknown): string {
  if (raw == null) return ''
  const s = String(raw).trim()
  if (!s) return ''
  // ISO datetime → локальное время
  if (s.includes('T') || s.includes('-')) {
    const d = new Date(s)
    if (!Number.isNaN(d.getTime())) {
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    }
  }
  const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/)
  if (!match) return ''
  const hh = String(Math.min(23, Number(match[1]))).padStart(2, '0')
  const mm = String(Math.min(59, Number(match[2]))).padStart(2, '0')
  return `${hh}:${mm}`
}

/**
 * Инпут времени (HH:mm) на базе shared Input.
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(function TimeInput(
  { value, onChange, onChangeValue, ...rest },
  ref,
) {
  const display = toTimeInputValue(value)

  return (
    <Input
      ref={ref}
      type="time"
      value={display}
      onChange={(e) => {
        onChange?.(e)
        const v = e.target.value
        onChangeValue?.(v ? toTimeInputValue(v) : null)
      }}
      {...rest}
    />
  )
})

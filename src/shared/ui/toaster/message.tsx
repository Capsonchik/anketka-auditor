'use client'

import type { ReactNode } from 'react'

import { CloseIcon } from '@/shared/icons/close-icon'
import { clsx } from '@shared/lib/clsx'

import type { MessageProps, MessageType } from './toaster.types'
import styles from './message.module.scss'

const ICONS: Record<MessageType, ReactNode> = {
  info: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 7h1.5v4.5h-1.5V7Zm.75-2.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75Z" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm2.78 4.72-3.5 3.5a.75.75 0 0 1-1.06 0l-1.75-1.75a.75.75 0 1 1 1.06-1.06l1.22 1.22 2.97-2.97a.75.75 0 1 1 1.06 1.06Z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5 1.5 13.5h13L8 1.5Zm0 3.25a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4.75ZM8 12a.875.875 0 1 0 0-1.75A.875.875 0 0 0 8 12Z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM9.28 5.22a.75.75 0 0 0-1.06 0L8 5.44 7.78 5.22a.75.75 0 1 0-1.06 1.06L6.94 6.5l-.22.22a.75.75 0 1 0 1.06 1.06L8 7.56l.22.22a.75.75 0 0 0 1.06-1.06L9.06 6.5l.22-.22a.75.75 0 0 0 0-1.06L9.28 5.22Z" />
    </svg>
  ),
  import: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5a1 1 0 0 1 1 1v5.59l1.47-1.47a1 1 0 1 1 1.41 1.41l-3.18 3.18a1 1 0 0 1-1.41 0l-3.18-3.18a1 1 0 1 1 1.41-1.41L7 8.09V2.5a1 1 0 0 1 1-1Zm-4.5 9a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9Z" />
    </svg>
  ),
  important: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 3.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75ZM7.25 7.75h1.5v4h-1.5v-4Z" />
    </svg>
  ),
}

export function Message({
  type = 'info',
  children,
  header,
  showIcon = true,
  closable = false,
  bordered = true,
  onClose,
  className,
}: MessageProps) {
  return (
    <div
      role="alert"
      className={clsx(
        styles.message,
        styles[`type-${type}`],
        bordered && styles.bordered,
        className,
      )}
    >
      {showIcon && <span className={styles.icon}>{ICONS[type]}</span>}

      <div className={styles.body}>
        {header && <div className={styles.header}>{header}</div>}
        {children && <div className={styles.content}>{children}</div>}
      </div>

      {closable && (
        <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </div>
  )
}

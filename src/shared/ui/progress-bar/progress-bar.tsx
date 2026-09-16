'use client'

import React from 'react'
import { clsx } from '@shared/lib/clsx'
import styles from './progress-bar.module.scss'

export type ProgressBarSize = 'sm' | 'md'

export interface ProgressBarProps {
  value: number
  label?: React.ReactNode
  size?: ProgressBarSize
  className?: string
  showPercent?: boolean
}

export function ProgressBar({
  value,
  label,
  size = 'md',
  className,
  showPercent = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))

  return (
    <div className={clsx(styles.root, styles[`size_${size}`], className)}>
      {(label || showPercent) && (
        <div className={styles.header}>
          {label ? <span className={styles.label}>{label}</span> : <span />}
          {showPercent ? <span className={styles.percent}>{Math.round(clamped)}%</span> : null}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

'use client'

import { clsx } from '@shared/lib/clsx'

import type { ToastEntry, ToastPlacement } from './toaster.types'
import { isBottomToastPlacement } from './toaster.types'
import { ToastItem } from './toast-item'
import styles from './toast-container.module.scss'

interface ToastContainerProps {
  placement: ToastPlacement
  items: ToastEntry[]
  onRequestClose: (key: string) => void
}

export function ToastContainer({ placement, items, onRequestClose }: ToastContainerProps) {
  if (items.length === 0) return null

  const isBottom = isBottomToastPlacement(placement)

  return (
    <div
      className={clsx(styles.container, styles[placement])}
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => (
        <ToastItem key={item.key} item={item} isBottom={isBottom} onRequestClose={onRequestClose} />
      ))}
    </div>
  )
}

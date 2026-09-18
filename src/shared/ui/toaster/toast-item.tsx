'use client'

import { useEffect, useRef } from 'react'

import { clsx } from '@shared/lib/clsx'

import type { ToastEntry } from './toaster.types'
import styles from './toast-container.module.scss'

interface ToastItemProps {
  item: ToastEntry
  isBottom: boolean
  onRequestClose: (key: string) => void
}

export function ToastItem({ item, isBottom, onRequestClose }: ToastItemProps) {
  const timerRef = useRef<number | null>(null)
  const remainingRef = useRef(item.duration)
  const startedAtRef = useRef(0)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = () => {
    if (item.duration <= 0 || !item.visible) return
    clearTimer()
    startedAtRef.current = Date.now()
    timerRef.current = window.setTimeout(() => {
      onRequestClose(item.key)
    }, remainingRef.current)
  }

  useEffect(() => {
    remainingRef.current = item.duration
    startTimer()
    return clearTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps -- таймер привязан к ключу/длительности toast
  }, [item.duration, item.key, item.visible])

  const handleMouseEnter = () => {
    if (!item.mouseReset || item.duration <= 0) return
    clearTimer()
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current))
  }

  const handleMouseLeave = () => {
    if (!item.mouseReset || item.duration <= 0 || !item.visible) return
    startTimer()
  }

  return (
    <div className={clsx(styles.itemSlot, !item.visible && styles.itemSlotExiting)}>
      <div className={styles.itemSlotInner}>
        <div
          className={clsx(
            styles.item,
            isBottom ? styles.itemBottom : styles.itemTop,
            item.visible && styles.itemEntering,
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.node}
        </div>
      </div>
    </div>
  )
}

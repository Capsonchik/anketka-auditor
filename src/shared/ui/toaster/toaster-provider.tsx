'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import { ToastContainer } from './toast-container'
import {
  DEFAULT_TOAST_DURATION,
  TOAST_PLACEMENTS,
  isBottomToastPlacement,
  type ToastEntry,
  type ToastOptions,
  type ToastPlacement,
  type ToasterApi,
} from './toaster.types'

const EXIT_ANIMATION_MS = 280

const ToasterContext = createContext<ToasterApi | null>(null)

function createEmptyState(): Record<ToastPlacement, ToastEntry[]> {
  return TOAST_PLACEMENTS.reduce(
    (acc, placement) => {
      acc[placement] = []
      return acc
    },
    {} as Record<ToastPlacement, ToastEntry[]>,
  )
}

function createToastKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface ToasterProviderProps {
  children: ReactNode
}

export function ToasterProvider({ children }: ToasterProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [toasts, setToasts] = useState<Record<ToastPlacement, ToastEntry[]>>(createEmptyState)
  const exitTimersRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    setMounted(true)
    return () => {
      exitTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      exitTimersRef.current.clear()
    }
  }, [])

  const finalizeRemove = useCallback((key: string) => {
    setToasts((prev) => {
      const next = { ...prev }
      for (const placement of TOAST_PLACEMENTS) {
        next[placement] = prev[placement].filter((item) => item.key !== key)
      }
      return next
    })
    exitTimersRef.current.delete(key)
  }, [])

  const requestClose = useCallback(
    (key: string) => {
      setToasts((prev) => {
        let found = false
        const next = { ...prev }

        for (const placement of TOAST_PLACEMENTS) {
          next[placement] = prev[placement].map((item) => {
            if (item.key !== key) return item
            found = true
            return { ...item, visible: false }
          })
        }

        return found ? next : prev
      })

      if (exitTimersRef.current.has(key)) return

      const timerId = window.setTimeout(() => {
        finalizeRemove(key)
      }, EXIT_ANIMATION_MS)
      exitTimersRef.current.set(key, timerId)
    },
    [finalizeRemove],
  )

  const push = useCallback((message: ReactNode, options?: ToastOptions) => {
    const placement = options?.placement ?? 'topCenter'
    const key = createToastKey()

    const entry: ToastEntry = {
      key,
      node: message,
      placement,
      duration: options?.duration ?? DEFAULT_TOAST_DURATION,
      mouseReset: options?.mouseReset ?? true,
      visible: true,
    }

    setToasts((prev) => {
      const current = prev[placement]
      const nextItems = isBottomToastPlacement(placement) ? [entry, ...current] : [...current, entry]

      return {
        ...prev,
        [placement]: nextItems,
      }
    })

    return key
  }, [])

  const update = useCallback((key: string, message: ReactNode, options?: Partial<ToastOptions>) => {
    setToasts((prev) => {
      let found = false
      const next = { ...prev }

      for (const placement of TOAST_PLACEMENTS) {
        next[placement] = prev[placement].map((item) => {
          if (item.key !== key) return item
          found = true
          return {
            ...item,
            node: message,
            ...(options?.placement ? { placement: options.placement } : {}),
            ...(options?.duration !== undefined ? { duration: options.duration } : {}),
            ...(options?.mouseReset !== undefined ? { mouseReset: options.mouseReset } : {}),
          }
        })
      }

      return found ? next : prev
    })
  }, [])

  const remove = useCallback(
    (key: string) => {
      requestClose(key)
    },
    [requestClose],
  )

  const clear = useCallback(() => {
    setToasts((prev) => {
      const next = { ...prev }

      for (const placement of TOAST_PLACEMENTS) {
        for (const item of prev[placement]) {
          if (exitTimersRef.current.has(item.key)) continue
          const timerId = window.setTimeout(() => finalizeRemove(item.key), EXIT_ANIMATION_MS)
          exitTimersRef.current.set(item.key, timerId)
        }
        next[placement] = prev[placement].map((item) => ({ ...item, visible: false }))
      }

      return next
    })
  }, [finalizeRemove])

  const api = useMemo<ToasterApi>(
    () => ({ push, update, remove, clear }),
    [push, update, remove, clear],
  )

  return (
    <ToasterContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <>
            {TOAST_PLACEMENTS.map((placement) => (
              <ToastContainer
                key={placement}
                placement={placement}
                items={toasts[placement]}
                onRequestClose={requestClose}
              />
            ))}
          </>,
          document.body,
        )}
    </ToasterContext.Provider>
  )
}

export function useToasterContext() {
  return useContext(ToasterContext)
}

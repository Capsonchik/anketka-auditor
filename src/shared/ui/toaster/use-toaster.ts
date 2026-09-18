'use client'

import { useMemo } from 'react'

import type { ToasterApi } from './toaster.types'
import { useToasterContext } from './toaster-provider'

const noopToaster: ToasterApi = {
  push: () => '',
  update: () => {},
  remove: () => {},
  clear: () => {},
}

/**
 * Хук для показа toast-сообщений (API как rsuite useToaster).
 *
 * @example
 * const toaster = useToaster()
 * toaster.push(<Message type="success">Сохранено</Message>)
 * toaster.push(<Message type="error">Ошибка</Message>, { placement: 'topEnd', duration: 5000 })
 */
export function useToaster(): ToasterApi {
  const context = useToasterContext()

  return useMemo(() => {
    if (!context) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('useToaster: оберните приложение в <ToasterProvider>.')
      }
      return noopToaster
    }
    return context
  }, [context])
}

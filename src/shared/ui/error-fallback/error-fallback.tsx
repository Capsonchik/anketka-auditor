'use client'

import { useState, type ReactNode } from 'react'
import { Button, Modal } from '@/shared/ui'
import styles from './error-fallback.module.scss'

export interface ErrorFallbackProps {
  error: Error | null
  onReset?: () => void
  className?: string
  title?: string
  message?: string
  showDetails?: boolean
  actions?: ReactNode
}

/**
 * Компонент для отображения ошибки в ErrorBoundary
 * 
 * Может быть использован как дефолтный fallback или как кастомный с дополнительными стилями.
 */
export function ErrorFallback({
  error,
  onReset,
  className,
  title = 'Что-то пошло не так',
  message = 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.',
  showDetails = true,
  actions,
}: ErrorFallbackProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReset = () => {
    if (onReset) {
      onReset()
    }
  }

  return (
    <>
      <div className={`${styles.errorFallback} ${className || ''}`}>
        <div className={styles.container}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.message}>{message}</p>
          {showDetails && error && (
            <div className={styles.detailsWrapper}>
              <Button
                variant="danger"
                onClick={() => setIsModalOpen(true)}
                className={styles.detailsButton}
              >
                Детали ошибки
              </Button>
            </div>
          )}
          <div className={styles.actions}>
            {actions || (
              <>
                <Button variant="primary" onClick={handleReset}>
                  Попробовать снова
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  Обновить страницу
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {showDetails && error && (
        <Modal
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}

          
        >
          <div className={styles.errorStack}>
            <strong>{error.name}: {error.message}</strong>
            <br /><br />
            {error.stack}
          </div>
        </Modal>
      )}
    </>
  )
}

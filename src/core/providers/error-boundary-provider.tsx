'use client'

import React, { Component, type ReactNode } from 'react'
import { ErrorFallback } from '@/shared/ui'

/**
 * Пропсы для компонента ErrorBoundary
 * 
 * @interface ErrorBoundaryProps
 * 
 * @property {ReactNode} children - Дочерние компоненты
 * @property {ReactNode} [fallback] - Кастомный компонент для отображения ошибки
 * @property {string} [fallbackClassName] - Класс для стилизации ErrorFallback (если fallback не передан)
 * @property {() => void} [onError] - Callback функция, вызываемая при ошибке
 */
export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  fallbackClassName?: string
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Состояние компонента ErrorBoundary
 * 
 * @interface ErrorBoundaryState
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Компонент для обработки ошибок в React приложении
 * 
 * ErrorBoundary перехватывает ошибки JavaScript в любом месте дерева дочерних компонентов,
 * логирует эти ошибки и отображает резервный UI вместо компонента, который упал.
 * 
 * @component
 * @class
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundaryProvider extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Обновляем состояние, чтобы следующий рендер показал резервный UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Логируем ошибку
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    // Вызываем callback, если он передан
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Если передан кастомный fallback, используем его
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Иначе показываем стандартный UI ошибки из shared
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
          className={this.props.fallbackClassName}
        />
      )
    }

    return this.props.children
  }
}

import type { MouseEvent, ReactNode } from 'react'

export type ToastPlacement =
  | 'topCenter'
  | 'topStart'
  | 'topEnd'
  | 'bottomCenter'
  | 'bottomStart'
  | 'bottomEnd'

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'import' | 'important'

export interface ToastOptions {
  /** Позиция на экране. @default 'topCenter' */
  placement?: ToastPlacement
  /** Автозакрытие, мс. 0 — не закрывать. @default 4500 */
  duration?: number
  /** Сбрасывать таймер при наведении. @default true */
  mouseReset?: boolean
  /** Контейнер (по умолчанию document.body через ToasterProvider) */
  container?: HTMLElement | (() => HTMLElement)
}

export interface ToastEntry {
  key: string
  node: ReactNode
  placement: ToastPlacement
  duration: number
  mouseReset: boolean
  visible: boolean
}

export interface MessageProps {
  type?: MessageType
  children?: ReactNode
  header?: ReactNode
  showIcon?: boolean
  closable?: boolean
  bordered?: boolean
  onClose?: (event?: MouseEvent) => void
  className?: string
}

export interface ToasterApi {
  push: (message: ReactNode, options?: ToastOptions) => string
  update: (key: string, message: ReactNode, options?: Partial<ToastOptions>) => void
  remove: (key: string) => void
  clear: () => void
}

export const TOAST_PLACEMENTS: ToastPlacement[] = [
  'topCenter',
  'topStart',
  'topEnd',
  'bottomCenter',
  'bottomStart',
  'bottomEnd',
]

export const DEFAULT_TOAST_DURATION = 4500

export function isBottomToastPlacement(placement: ToastPlacement): boolean {
  return placement.startsWith('bottom')
}

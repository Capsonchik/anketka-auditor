import type { ReactNode } from 'react'

export type AccordionType = 'single' | 'multiple'

export type AccordionProps = {
  children: ReactNode
  /** single — один открытый; multiple — несколько */
  type?: AccordionType
  /** Controlled: id открытого (single) или массив (multiple) */
  value?: string | string[] | null
  /** Uncontrolled начальное значение */
  defaultValue?: string | string[] | null
  onValueChange?: (value: string | string[] | null) => void
  /** В single можно закрыть все панели */
  collapsible?: boolean
  className?: string
}

export type AccordionItemProps = {
  children: ReactNode
  value: string
  disabled?: boolean
  className?: string
}

export type AccordionTriggerProps = {
  children: ReactNode
  className?: string
}

export type AccordionContentProps = {
  children: ReactNode
  className?: string
}

export type AccordionContextValue = {
  type: AccordionType
  openValues: Set<string>
  toggle: (itemValue: string) => void
  collapsible: boolean
}

export type AccordionItemContextValue = {
  value: string
  open: boolean
  disabled: boolean
  triggerId: string
  contentId: string
}

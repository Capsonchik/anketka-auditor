'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'

import { clsx } from '@shared/lib/clsx'

import type {
  AccordionContentProps,
  AccordionContextValue,
  AccordionItemContextValue,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from './accordion.types'
import styles from './accordion.module.scss'

const AccordionContext = createContext<AccordionContextValue | null>(null)
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error(`${component} must be used within Accordion`)
  return ctx
}

function useAccordionItemContext(component: string): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) throw new Error(`${component} must be used within Accordion.Item`)
  return ctx
}

function toSet(value: string | string[] | null | undefined): Set<string> {
  if (value == null) return new Set()
  if (Array.isArray(value)) return new Set(value.filter(Boolean))
  return value ? new Set([value]) : new Set()
}

function fromSet(set: Set<string>, type: 'single' | 'multiple'): string | string[] | null {
  if (type === 'single') {
    const first = set.values().next().value
    return first ?? null
  }
  return Array.from(set)
}

/**
 * Accordion: состояние open в JS, анимация высоты — только SCSS (grid 0fr→1fr).
 */
export function Accordion({
  children,
  type = 'single',
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className,
}: AccordionProps) {
  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(() => toSet(defaultValue))

  const openValues = isControlled ? toSet(value) : uncontrolled

  const toggle = useCallback(
    (itemValue: string) => {
      const next = new Set(openValues)
      const isOpen = next.has(itemValue)

      if (type === 'single') {
        if (isOpen) {
          if (!collapsible) return
          next.clear()
        } else {
          next.clear()
          next.add(itemValue)
        }
      } else if (isOpen) {
        next.delete(itemValue)
      } else {
        next.add(itemValue)
      }

      if (!isControlled) setUncontrolled(next)
      onValueChange?.(fromSet(next, type))
    },
    [collapsible, isControlled, onValueChange, openValues, type],
  )

  const ctx = useMemo<AccordionContextValue>(
    () => ({ type, openValues, toggle, collapsible }),
    [collapsible, openValues, toggle, type],
  )

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={clsx(styles.root, className)} data-accordion="" data-type={type}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({ children, value, disabled = false, className }: AccordionItemProps) {
  const { openValues } = useAccordionContext('Accordion.Item')
  const baseId = useId()
  const open = openValues.has(value)

  const itemCtx = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      open,
      disabled,
      triggerId: `${baseId}-trigger`,
      contentId: `${baseId}-content`,
    }),
    [baseId, disabled, open, value],
  )

  return (
    <AccordionItemContext.Provider value={itemCtx}>
      <div
        className={clsx(styles.item, open && styles.itemOpen, disabled && styles.itemDisabled, className)}
        data-state={open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { toggle } = useAccordionContext('Accordion.Trigger')
  const { value, open, disabled, triggerId, contentId } = useAccordionItemContext('Accordion.Trigger')

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!disabled) toggle(value)
    }
  }

  return (
    <h3 className={styles.heading}>
      <button
        type="button"
        id={triggerId}
        className={clsx(styles.trigger, className)}
        aria-expanded={open}
        aria-controls={contentId}
        disabled={disabled}
        data-state={open ? 'open' : 'closed'}
        onClick={() => {
          if (!disabled) toggle(value)
        }}
        onKeyDown={onKeyDown}
      >
        <span className={styles.triggerContent}>{children}</span>
        <span className={styles.chevron} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </h3>
  )
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const { open, triggerId, contentId } = useAccordionItemContext('Accordion.Content')

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      aria-hidden={!open}
      className={clsx(styles.content, open && styles.contentOpen, className)}
      data-state={open ? 'open' : 'closed'}
    >
      <div className={styles.contentInner}>{children}</div>
    </div>
  )
}

Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

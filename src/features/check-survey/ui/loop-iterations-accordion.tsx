'use client'

import type { ReactNode } from 'react'

import { Accordion } from '@/shared/ui/accordion'

import styles from './loop-iterations-accordion.module.scss'

export type LoopIterationAccordionItem = {
  id: string
  label: string
  /** Есть ли снимок product-ответов */
  hasDetails: boolean
}

type LoopIterationsAccordionProps = {
  items: LoopIterationAccordionItem[]
  openId: string | null
  onOpenChange: (id: string | null) => void
  /** Контент раскрытой итерации (форма полей) */
  renderContent: (item: LoopIterationAccordionItem, index: number) => ReactNode
  title?: string
}

/**
 * Отправленные итерации loop: каждая позиция — элемент Accordion с формой внутри.
 */
export function LoopIterationsAccordion({
  items,
  openId,
  onOpenChange,
  renderContent,
  title,
}: LoopIterationsAccordionProps) {
  if (!items.length) return null

  return (
    <div className={styles.root}>
      <p className={styles.title}>{title ?? `Отправленные позиции (${items.length})`}</p>
      <Accordion
        type="single"
        collapsible
        value={openId}
        onValueChange={(next) => {
          onOpenChange(typeof next === 'string' ? next : null)
        }}
      >
        {items.map((item, index) => (
          <Accordion.Item key={item.id} value={item.id}>
            <Accordion.Trigger>
              <span className={styles.triggerRow}>
                <span className={styles.index}>{index + 1}</span>
                <span className={styles.label} title={item.label}>
                  {item.label}
                </span>
                {!item.hasDetails ? (
                  <span className={styles.badge} title="Сохранены только идентификаторы">
                    без деталей
                  </span>
                ) : null}
              </span>
            </Accordion.Trigger>
            <Accordion.Content>
              <div className={styles.panel}>
                {/* Контент в DOM только у открытого — одна форма; высота панели анимируется SCSS */}
                {openId === item.id ? renderContent(item, index) : null}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

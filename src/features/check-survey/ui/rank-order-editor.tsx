'use client'

import { useEffect, useMemo, useState } from 'react'

import styles from './rank-order-editor.module.scss'

type RankOption = {
  id: string
  label: string
  value: string
}

type RankOrderEditorProps = {
  options: RankOption[]
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}

/** Порядок вариантов drag-and-drop — как RankOrderEditor в /pa */
export function RankOrderEditor({ options, value, onChange, disabled = false }: RankOrderEditorProps) {
  const initialOrder = useMemo(() => {
    const byValue = new Map(options.map((opt) => [opt.value, opt]))
    const fromValue = value
      .map((item) => byValue.get(item))
      .filter((item): item is RankOption => Boolean(item))
    const rest = options.filter((opt) => !value.includes(opt.value))
    return [...fromValue, ...rest]
  }, [options, value])

  const [items, setItems] = useState(initialOrder)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    setItems(initialOrder)
  }, [initialOrder])

  function moveItem(fromId: string, toId: string) {
    if (disabled || fromId === toId) return
    setItems((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === fromId)
      const toIndex = prev.findIndex((item) => item.id === toId)
      if (fromIndex < 0 || toIndex < 0) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      onChange(next.map((item) => item.value))
      return next
    })
  }

  return (
    <div className={styles.root}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={styles.item}
          draggable={!disabled}
          onDragStart={() => {
            if (disabled) return
            setDraggingId(item.id)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (!draggingId || disabled) return
            moveItem(draggingId, item.id)
            setDraggingId(null)
          }}
          onDragEnd={() => setDraggingId(null)}
        >
          <span className={styles.index}>{index + 1}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

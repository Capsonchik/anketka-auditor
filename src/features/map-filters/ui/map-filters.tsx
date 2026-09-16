'use client'

import type { MapFiltersResponse, MapMarkersQuery, MapStatus } from '@/entities/map-marker'
import { Button } from '@/shared/ui/button'
import { SelectPicker } from '@/shared/ui/picker'
import type { PickerItem } from '@/shared/ui/picker'

import styles from './map-filters.module.scss'

type MapFiltersProps = {
  query: MapMarkersQuery
  filters: MapFiltersResponse | null | undefined
  markersCount: number
  total: number
  isLoading?: boolean
  onChange: (next: MapMarkersQuery) => void
  onApply: () => void
  onReset: () => void
}

export function MapFiltersPanel({
  query,
  filters,
  markersCount,
  total,
  isLoading = false,
  onChange,
  onApply,
  onReset,
}: MapFiltersProps) {
  const statusItems: PickerItem[] = (filters?.statuses || []).map((s) => ({
    value: s.value,
    label: s.label,
  }))

  const projectItems: PickerItem[] = (filters?.projects || []).map((p) => ({
    value: p.id,
    label: p.name,
  }))

  const surveyItems: PickerItem[] = (filters?.surveys || []).map((s) => ({
    value: s.id,
    label: s.title,
  }))

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="search"
          placeholder="Поиск: ID, адрес, проект"
          value={query.search || ''}
          onChange={(e) => onChange({ ...query, search: e.target.value })}
        />
        <SelectPicker
          items={statusItems}
          value={query.status?.[0] || null}
          onChange={(value) => {
            const next = value ? ([String(value)] as MapStatus[]) : undefined
            onChange({ ...query, status: next })
          }}
          placeholder="Статус"
          cleanable
        />
        <SelectPicker
          items={projectItems}
          value={query.projectIds?.[0] || null}
          onChange={(value) => {
            onChange({ ...query, projectIds: value ? [String(value)] : undefined })
          }}
          placeholder="Проект"
          cleanable
        />
        <SelectPicker
          items={surveyItems}
          value={query.surveyIds?.[0] || null}
          onChange={(value) => {
            onChange({ ...query, surveyIds: value ? [String(value)] : undefined })
          }}
          placeholder="Анкета"
          cleanable
        />
        <Button variant="default" appearance="ghost" onClick={onReset} disabled={isLoading}>
          Сбросить
        </Button>
        <Button variant="primary" onClick={onApply} disabled={isLoading} loading={isLoading}>
          Применить
        </Button>
      </div>
      <div className={styles.meta}>
        Показано: {markersCount} из {total}
      </div>
    </div>
  )
}

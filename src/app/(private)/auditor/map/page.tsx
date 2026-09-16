'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import {
  emptyMapMarkersQuery,
  type MapMarker,
  type MapMarkersQuery,
  type MapStatus,
  useCancelCheckClaimMutation,
  useCreateCheckClaimMutation,
  useGetMapFiltersQuery,
  useLazyGetMapMarkersQuery,
} from '@/entities/map-marker'
import { useUpdateAssignmentStatusMutation } from '@/entities/assignment/api/assignment.api'
import { MapFiltersPanel } from '@/features/map-filters'
import { MapMarkerPanel } from '@/features/map-marker-panel'
import { AuditorMap } from '@/widgets/auditor-map'

import styles from './page.module.scss'

const STATUS_CLASS: Record<MapStatus, string> = {
  assigned: styles.markerAssigned,
  in_progress: styles.markerInProgress,
  completed: styles.markerCompleted,
  overdue: styles.markerOverdue,
  free: styles.markerFree,
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const err = error as FetchBaseQueryError & { data?: { detail?: string | { msg?: string }[] } }
  const detail = err.data?.detail
  if (typeof detail === 'string' && detail.trim()) return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}

/**
 * Карта заданий аудитора.
 * Свои назначения + свободные (masked) + claim + accept/decline.
 */
export default function MapPage() {
  const [query, setQuery] = useState<MapMarkersQuery>(emptyMapMarkersQuery)
  const [appliedQuery, setAppliedQuery] = useState<MapMarkersQuery>(emptyMapMarkersQuery)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const { data: filters } = useGetMapFiltersQuery()
  const [fetchMarkers, markersState] = useLazyGetMapMarkersQuery()
  const [createClaim, createClaimState] = useCreateCheckClaimMutation()
  const [cancelClaim, cancelClaimState] = useCancelCheckClaimMutation()
  const [updateStatus, updateStatusState] = useUpdateAssignmentStatusMutation()

  const markers = markersState.data?.items ?? []
  const total = markersState.data?.total ?? 0
  const isLoading = markersState.isFetching || markersState.isLoading
  const isBusy =
    createClaimState.isLoading || cancelClaimState.isLoading || updateStatusState.isLoading

  const selected = useMemo(
    () => markers.find((m) => m.markerId === selectedId) || null,
    [markers, selectedId],
  )

  const withoutCoords = useMemo(
    () => markers.filter((m) => !m.hasCoordinates),
    [markers],
  )

  useEffect(() => {
    void fetchMarkers(emptyMapMarkersQuery)
  }, [fetchMarkers])

  useEffect(() => {
    if (!markersState.data) return
    setNotice(markersState.data.total === 0 ? 'Нет проверок по выбранным фильтрам' : null)
    setSelectedId((prev) => {
      if (!prev) return prev
      return markersState.data!.items.some((m) => m.markerId === prev) ? prev : null
    })
  }, [markersState.data])

  const handleApply = () => {
    setAppliedQuery(query)
    void fetchMarkers(query)
  }

  const handleReset = () => {
    setQuery(emptyMapMarkersQuery)
    setAppliedQuery(emptyMapMarkersQuery)
    void fetchMarkers(emptyMapMarkersQuery)
  }

  const runAction = async (message: string, action: () => Promise<unknown>) => {
    setActionError(null)
    try {
      await action()
      setNotice(message)
      await fetchMarkers(appliedQuery)
    } catch (err) {
      setActionError(getErrorMessage(err, 'Ошибка действия'))
    }
  }

  const handleClaim = (marker: MapMarker) =>
    runAction('Заявка отправлена', () =>
      createClaim({ projectId: marker.projectId, checkId: marker.checkId }).unwrap(),
    )

  const handleCancelClaim = (marker: MapMarker) =>
    runAction('Заявка отменена', async () => {
      if (!marker.myClaimId) throw { data: { detail: 'Заявка не найдена' } }
      return cancelClaim(marker.myClaimId).unwrap()
    })

  const handleAccept = (marker: MapMarker) =>
    runAction('Назначение принято', () =>
      updateStatus({
        projectId: marker.projectId,
        checkId: marker.checkId,
        status: 'accepted',
      }).unwrap(),
    )

  const handleDecline = (marker: MapMarker) =>
    runAction('Назначение отклонено', () =>
      updateStatus({
        projectId: marker.projectId,
        checkId: marker.checkId,
        status: 'declined',
      }).unwrap(),
    )

  const loadError = markersState.isError
    ? getErrorMessage(markersState.error, 'Не удалось загрузить маркеры карты')
    : null

  return (
    <div className={styles.mapPage}>
      <h1>Карта заданий</h1>

      <MapFiltersPanel
        query={query}
        filters={filters}
        markersCount={markers.length}
        total={total}
        isLoading={isLoading}
        onChange={setQuery}
        onApply={handleApply}
        onReset={handleReset}
      />

      {loadError ? <div className={styles.bannerError}>{loadError}</div> : null}
      {notice && !loadError ? <div className={styles.bannerInfo}>{notice}</div> : null}

      <AuditorMap
        markers={markers}
        selectedId={selectedId}
        isLoading={isLoading}
        onSelect={(id) => {
          setSelectedId(id)
          setActionError(null)
        }}
      >
        <MapMarkerPanel
          marker={selected}
          isBusy={isBusy}
          actionError={actionError}
          onClose={() => {
            setSelectedId(null)
            setActionError(null)
          }}
          onClaim={handleClaim}
          onCancelClaim={handleCancelClaim}
          onAcceptAssignment={handleAccept}
          onDeclineAssignment={handleDecline}
        />
      </AuditorMap>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.markerAssigned}`} />
          Назначено
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.markerInProgress}`} />
          В работе
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.markerCompleted}`} />
          Выполнено
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.markerOverdue}`} />
          Просрочено
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.markerFree}`} />
          Свободное
        </div>
      </div>

      {withoutCoords.length > 0 && (
        <section className={styles.sideList}>
          <h2 className={styles.sideTitle}>Без координат ({withoutCoords.length})</h2>
          <ul className={styles.sideItems}>
            {withoutCoords.map((marker) => (
              <li key={marker.markerId}>
                <button
                  type="button"
                  className={styles.sideItem}
                  onClick={() => {
                    setSelectedId(marker.markerId)
                    setActionError(null)
                  }}
                >
                  <span className={`${styles.sideDot} ${STATUS_CLASS[marker.mapStatus]}`} />
                  <span>
                    #{marker.checkPublicId}
                    {' · '}
                    {marker.isMasked ? 'Свободная проверка' : marker.address || marker.checkName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

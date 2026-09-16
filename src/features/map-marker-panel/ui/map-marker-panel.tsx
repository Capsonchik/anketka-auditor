'use client'

import type { MapMarker } from '@/entities/map-marker'
import { Button } from '@/shared/ui/button'

import styles from './map-marker-panel.module.scss'

type MapMarkerPanelProps = {
  marker: MapMarker | null
  isBusy?: boolean
  actionError?: string | null
  onClose: () => void
  onClaim: (marker: MapMarker) => void
  onCancelClaim: (marker: MapMarker) => void
  onAcceptAssignment: (marker: MapMarker) => void
  onDeclineAssignment: (marker: MapMarker) => void
}

export function MapMarkerPanel({
  marker,
  isBusy = false,
  actionError = null,
  onClose,
  onClaim,
  onCancelClaim,
  onAcceptAssignment,
  onDeclineAssignment,
}: MapMarkerPanelProps) {
  if (!marker) return null

  const isOverdue = marker.mapStatus === 'overdue'
  const canClaim = marker.mapStatus === 'free' && !marker.myClaimPending && !isOverdue
  const canCancelClaim =
    marker.mapStatus === 'free' && marker.myClaimPending && Boolean(marker.myClaimId)
  const canAccept =
    marker.assignmentStatus === 'assigned' && marker.mapStatus === 'assigned' && !isOverdue
  const canOpenSurvey =
    Boolean(marker.inviteToken) &&
    !marker.isMasked &&
    !isOverdue &&
    (marker.mapStatus === 'assigned' || marker.mapStatus === 'in_progress')

  return (
    <aside className={styles.panel} aria-live="polite">
      <div className={styles.header}>
        <strong>{marker.isMasked ? 'Свободная проверка' : marker.checkName}</strong>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.status}>{marker.mapStatusLabel}</p>
        <p>ID: {marker.checkPublicId}</p>

        {!marker.isMasked && (
          <>
            {marker.projectName ? <p>Проект: {marker.projectName}</p> : null}
            {marker.clientName ? <p>Клиент: {marker.clientName}</p> : null}
            {marker.address ? <p>Адрес: {marker.address}</p> : null}
            {marker.city ? <p>Город: {marker.city}</p> : null}
            {marker.surveyTitle ? <p>Анкета: {marker.surveyTitle}</p> : null}
            {marker.payment != null ? <p>Оплата: {marker.payment} ₽</p> : null}
          </>
        )}

        {marker.isMasked && (
          <p className={styles.hint}>
            Детали точки скрыты до назначения. Можно подать заявку.
          </p>
        )}

        {marker.dueDate ? <p>Срок: {marker.dueDate}</p> : null}
        {marker.myClaimPending ? <p className={styles.pending}>Заявка отправлена</p> : null}
        {isOverdue ? (
          <p className={styles.error}>Проверка просрочена — действия недоступны</p>
        ) : null}
        {actionError ? <p className={styles.error}>{actionError}</p> : null}
      </div>

      <div className={styles.actions}>
        {canClaim && (
          <Button variant="primary" disabled={isBusy} loading={isBusy} onClick={() => onClaim(marker)}>
            Подать заявку
          </Button>
        )}
        {canCancelClaim && (
          <Button
            variant="default"
            appearance="ghost"
            disabled={isBusy}
            onClick={() => onCancelClaim(marker)}
          >
            Отменить заявку
          </Button>
        )}
        {canAccept && (
          <Button
            variant="primary"
            disabled={isBusy}
            loading={isBusy}
            onClick={() => onAcceptAssignment(marker)}
          >
            Принять
          </Button>
        )}
        {canAccept && (
          <Button
            variant="default"
            appearance="ghost"
            disabled={isBusy}
            onClick={() => onDeclineAssignment(marker)}
          >
            Отклонить
          </Button>
        )}
        {canOpenSurvey && (
          <a className={styles.link} href={`/pa/${marker.inviteToken}`}>
            Открыть анкету
          </a>
        )}
      </div>
    </aside>
  )
}

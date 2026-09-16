'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { MapMarker, MapStatus } from '@/entities/map-marker'

import styles from './auditor-map.module.scss'

type AuditorMapProps = {
  markers: MapMarker[]
  selectedId: string | null
  isLoading?: boolean
  onSelect: (markerId: string) => void
  children?: React.ReactNode
}

type YMapsNs = {
  ready: (cb: () => void) => void
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => YMapInstance
  Placemark: new (
    coords: number[],
    props: Record<string, unknown>,
    opts: Record<string, unknown>,
  ) => YPlacemark
}

type YMapInstance = {
  geoObjects: {
    add: (obj: YPlacemark) => void
    removeAll: () => void
  }
  setBounds: (bounds: number[][], opts?: Record<string, unknown>) => void
  setCenter: (center: number[], zoom?: number) => void
  destroy: () => void
}

type YPlacemark = {
  events: {
    add: (event: string, cb: () => void) => void
  }
}

declare global {
  interface Window {
    ymaps?: YMapsNs
  }
}

const STATUS_COLOR: Record<MapStatus, string> = {
  assigned: '#1f8ceb',
  in_progress: '#f97316',
  completed: '#16a34a',
  overdue: '#ef4444',
  free: '#4b5563',
}

function getYmapsKey(): string {
  return (process.env.NEXT_PUBLIC_YMAPS_API_KEY || '').trim()
}

function loadYmapsScript(apiKey: string): Promise<YMapsNs> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('SSR'))
  }
  if (window.ymaps) {
    return new Promise((resolve) => {
      window.ymaps!.ready(() => resolve(window.ymaps!))
    })
  }

  const existing = document.querySelector<HTMLScriptElement>('script[data-auditor-ymaps="1"]')
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => {
        if (!window.ymaps) {
          reject(new Error('YMaps failed'))
          return
        }
        window.ymaps.ready(() => resolve(window.ymaps!))
      })
      existing.addEventListener('error', () => reject(new Error('YMaps script error')))
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.dataset.auditorYmaps = '1'
    script.async = true
    const keyQs = apiKey ? `apikey=${encodeURIComponent(apiKey)}&` : ''
    script.src = `https://api-maps.yandex.ru/2.1/?${keyQs}lang=ru_RU`
    script.onload = () => {
      if (!window.ymaps) {
        reject(new Error('YMaps missing after load'))
        return
      }
      window.ymaps.ready(() => resolve(window.ymaps!))
    }
    script.onerror = () => reject(new Error('YMaps script error'))
    document.head.appendChild(script)
  })
}

function projectCssPosition(marker: MapMarker, index: number): { top: string; left: string } {
  if (marker.lat != null && marker.lng != null) {
    const top = Math.min(90, Math.max(8, ((70 - marker.lat) / (70 - 41)) * 82 + 8))
    const left = Math.min(92, Math.max(6, ((marker.lng - 19) / (170 - 19)) * 86 + 6))
    return { top: `${top}%`, left: `${left}%` }
  }
  return [
    { top: '28%', left: '18%' },
    { top: '48%', left: '42%' },
    { top: '66%', left: '58%' },
    { top: '22%', left: '70%' },
    { top: '76%', left: '32%' },
  ][index % 5]
}

function CssFallbackMap({
  markers,
  selectedId,
  onSelect,
}: {
  markers: MapMarker[]
  selectedId: string | null
  onSelect: (markerId: string) => void
}) {
  return (
    <>
      {markers.map((marker, index) => {
        const pos = projectCssPosition(marker, index)
        return (
          <button
            key={marker.markerId}
            type="button"
            className={[
              styles.cssMarker,
              styles[`status_${marker.mapStatus}`],
              selectedId === marker.markerId ? styles.cssMarkerActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ top: pos.top, left: pos.left }}
            title={
              marker.isMasked
                ? marker.mapStatusLabel
                : `${marker.clientName || ''}, ${marker.address || ''}`
            }
            onClick={() => onSelect(marker.markerId)}
          >
            {String(marker.checkPublicId).slice(-2)}
          </button>
        )
      })}
    </>
  )
}

/** Карта аудитора: Yandex Maps при наличии ключа, иначе CSS-fallback. */
export function AuditorMap({
  markers,
  selectedId,
  isLoading = false,
  onSelect,
  children,
}: AuditorMapProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<YMapInstance | null>(null)
  const onSelectRef = useRef(onSelect)
  const [engine, setEngine] = useState<'ymaps' | 'css' | 'loading'>('loading')
  const [engineError, setEngineError] = useState<string | null>(null)

  onSelectRef.current = onSelect

  const withCoords = useMemo(
    () => markers.filter((m) => m.hasCoordinates && m.lat != null && m.lng != null),
    [markers],
  )

  const markersSig = useMemo(
    () => withCoords.map((m) => `${m.markerId}:${m.mapStatus}:${m.lat}:${m.lng}`).join('|'),
    [withCoords],
  )

  useEffect(() => {
    let cancelled = false
    const apiKey = getYmapsKey()

    loadYmapsScript(apiKey)
      .then((ymaps) => {
        if (cancelled || !mapNodeRef.current) return
        if (mapRef.current) {
          mapRef.current.destroy()
          mapRef.current = null
        }
        const map = new ymaps.Map(mapNodeRef.current, {
          center: [55.75, 37.62],
          zoom: 10,
          controls: ['zoomControl', 'geolocationControl'],
        })
        mapRef.current = map
        setEngine('ymaps')
        setEngineError(null)
      })
      .catch(() => {
        if (cancelled) return
        setEngine('css')
        setEngineError(apiKey ? 'Не удалось загрузить Yandex Maps' : null)
      })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (engine !== 'ymaps' || !mapRef.current || !window.ymaps) return

    const map = mapRef.current
    const ymaps = window.ymaps
    map.geoObjects.removeAll()

    const bounds: number[][] = []
    withCoords.forEach((marker) => {
      const lat = marker.lat as number
      const lng = marker.lng as number
      const color = STATUS_COLOR[marker.mapStatus]
      const isSelected = marker.markerId === selectedId
      const placemark = new ymaps.Placemark(
        [lat, lng],
        {
          hintContent: marker.isMasked
            ? marker.mapStatusLabel
            : `${marker.clientName || marker.checkName}`,
        },
        {
          preset: 'islands#circleIcon',
          iconColor: color,
          zIndex: isSelected ? 1000 : undefined,
        },
      )
      placemark.events.add('click', () => onSelectRef.current(marker.markerId))
      map.geoObjects.add(placemark)
      bounds.push([lat, lng])
    })

    if (bounds.length === 1) {
      map.setCenter(bounds[0], 14)
    } else if (bounds.length > 1) {
      map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 })
    }
  }, [engine, markersSig, selectedId, withCoords])

  return (
    <div className={styles.root}>
      <div
        ref={mapNodeRef}
        className={styles.canvas}
        style={{ visibility: engine === 'ymaps' ? 'visible' : 'hidden' }}
      />

      {engine !== 'ymaps' && (
        <div className={styles.cssLayer}>
          <CssFallbackMap markers={withCoords} selectedId={selectedId} onSelect={onSelect} />
        </div>
      )}

      {isLoading && <div className={styles.overlay}>Загрузка…</div>}

      {!isLoading && withCoords.length === 0 && (
        <div className={styles.empty}>Нет маркеров с координатами</div>
      )}

      {engineError && engine === 'css' && (
        <div className={styles.engineHint}>{engineError} · показан упрощённый вид</div>
      )}

      {engine === 'css' && !getYmapsKey() && (
        <div className={styles.engineHint}>Задайте NEXT_PUBLIC_YMAPS_API_KEY для Яндекс.Карт</div>
      )}

      {children}
    </div>
  )
}

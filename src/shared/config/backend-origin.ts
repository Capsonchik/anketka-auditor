/**
 * Origin бэкенда (без /api/v1).
 * Браузер всегда ходит в `/api/proxy` → этот URL используется только на сервере Next.
 *
 * Локально: http://127.0.0.1:8000 (tunnel compose / uvicorn)
 * Прод: https://survey-all.ru (если API_URL не задан)
 */
export function getBackendOrigin(): string {
  const fromEnv = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '')
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'development') return 'http://127.0.0.1:8000'
  return 'https://survey-all.ru'
}

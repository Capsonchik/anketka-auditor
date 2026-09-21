import type { AuditorRatingStats } from '@/entities/stats/model/types'
import { getBackendOrigin } from '@/shared/config/backend-origin'

/**
 * Получает статистику рейтинга аудитора (в т.ч. активные и просроченные проверки).
 *
 * @param auditorId - ID аудитора.
 * @param companyId - ID компании.
 * @param accessToken - Токен доступа.
 * @returns Данные статистики или null.
 */
export async function fetchAuditorRatingStats(
  auditorId: string,
  companyId: string,
  accessToken: string,
): Promise<AuditorRatingStats | null> {
  try {
    const API_URL = getBackendOrigin()
    console.log(`[FetchRatingStats] Fetching stats for auditor: ${auditorId}`)
    const response = await fetch(`${API_URL}/api/v1/ratings/auditors/${auditorId}/rating-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Company-Id': companyId,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (response.ok) {
      return (await response.json()) as AuditorRatingStats
    }
    return null
  } catch (error) {
    console.error('[FetchRatingStats] Error:', error)
    return null
  }
}

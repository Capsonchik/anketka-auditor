import { getBackendOrigin } from '@/shared/config/backend-origin'

/**
 * Выполняет обновление токенов через API.
 * 
 * @param refreshToken - Токен обновления.
 * @returns Данные с новыми токенами или null в случае ошибки.
 */
export async function auditorAuthRefresh(refreshToken: string) {
  try {
    const API_URL = getBackendOrigin()
    console.log(`[AuditorAuthRefresh] Refreshing token at: ${API_URL}/api/v1/auditor-auth/refresh`)
    const response = await fetch(`${API_URL}/api/v1/auditor-auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'omit',
      cache: 'no-store',
    })

    if (response.ok) {
      return await response.json()
    }
    
    return null
  } catch (error) {
    console.error('[AuditorAuthRefresh] Critical error:', error)
    return null
  }
}

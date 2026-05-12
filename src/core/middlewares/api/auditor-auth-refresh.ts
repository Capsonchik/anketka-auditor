const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://survey-all.ru'

/**
 * Выполняет обновление токенов через API.
 * 
 * @param refreshToken - Токен обновления.
 * @returns Данные с новыми токенами или null в случае ошибки.
 */
export async function auditorAuthRefresh(refreshToken: string) {
  try {
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

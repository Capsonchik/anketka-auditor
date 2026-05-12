import { NextRequest } from 'next/server'
import { encrypt } from '@shared/lib/crypto'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://survey-all.ru'

/**
 * Выполняет запрос к API для получения данных текущего аудитора.
 * 
 * @param request - Объект запроса Next.js.
 * @param accessToken - Токен доступа.
 * @returns Объект с заголовками и данными аудитора или Response в случае ошибки.
 */
export async function fetchAuditorMe(request: NextRequest, accessToken: string) {
  try {
    console.log(`[FetchAuditorMe] Fetching: ${API_URL}/api/v1/auditor/me`)
    const response = await fetch(`${API_URL}/api/v1/auditor/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      credentials: 'omit',
      cache: 'no-store',
    })

    console.log(`[FetchAuditorMe] Response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      const auditor = data.auditor || data
      
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-token', accessToken)
      
      // Шифруем данные пользователя перед передачей в заголовке
      const userDataStr = JSON.stringify(auditor)
      const encryptedUserData = await encrypt(userDataStr)
      requestHeaders.set('x-user-data', encryptedUserData)

      return {
        headers: requestHeaders,
        auditor
      }
    }
    
    return response
  } catch (error) {
    console.error('[FetchAuditorMe] Error:', error)
    return null
  }
}

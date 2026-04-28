import { NextRequest, NextResponse } from 'next/server'
import { encrypt } from '@shared/lib/crypto'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://survey-all.ru'

export async function fetchAuditorMe(request: NextRequest, accessToken: string) {
  const { pathname } = request.nextUrl
  
  if (!pathname.startsWith('/auditor')) {
    return null
  }

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
      console.log('[FetchAuditorMe] Data received:', JSON.stringify(data))
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
    console.error('Fetch auditor me error:', error)
    return null
  }
}

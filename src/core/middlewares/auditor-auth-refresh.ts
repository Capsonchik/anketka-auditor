import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://survey-all.ru'

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

    console.log(`[AuditorAuthRefresh] Response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      console.log('[AuditorAuthRefresh] Refresh successful')
      return data
    }
    
    console.log('[AuditorAuthRefresh] Refresh failed')
    return null
  } catch (error) {
    console.error('[AuditorAuthRefresh] Critical error:', error)
    return null
  }
}

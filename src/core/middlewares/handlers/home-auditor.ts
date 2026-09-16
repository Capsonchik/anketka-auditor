import { NextRequest, NextResponse } from 'next/server'
import { fetchAuditorMe } from '../api/fetch-auditor-me'

/**
 * Главная `/`: лендинг отключён.
 * Авторизованный → /auditor, гость → /login.
 */
export async function homeAuditorHandler(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value

  if (accessToken) {
    const result = (await fetchAuditorMe(request, accessToken)) as any

    if (result && 'headers' in result) {
      return NextResponse.redirect(new URL('/auditor', request.url))
    }

    if (result instanceof Response && result.status === 401) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('accessToken')
      response.cookies.delete('refreshToken')
      return response
    }
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

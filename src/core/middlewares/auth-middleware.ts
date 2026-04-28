import { NextRequest, NextResponse } from 'next/server'
import { fetchAuditorMe } from './fetch-auditor-me'
import { auditorAuthRefresh } from './auditor-auth-refresh'

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`[AuthMiddleware] Request path: ${pathname}`)
  // Получаем токены из cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  console.log(`[AuthMiddleware] Tokens check:
    accessToken: ${accessToken ? `present (...${accessToken.slice(-8)})` : 'missing'}
    refreshToken: ${refreshToken ? `present (...${refreshToken.slice(-8)})` : 'missing'}
  `)

  // Проверяем, начинается ли путь с /auditor
  const isLkRoute = pathname.startsWith('/auditor')

  if (isLkRoute) {
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      console.log(`[AuthMiddleware] Checking path: ${pathname}`)
      const meResult = await fetchAuditorMe(request, accessToken)

      // Если ошибка 401 или 403
      if (meResult instanceof Response) {
        console.log(`[AuthMiddleware] Auth error response: ${meResult.status}`)
        if (meResult.status === 401 || meResult.status === 403) {
          if (!refreshToken) {
            console.log('[AuthMiddleware] No refresh token, redirecting to login')
            const response = NextResponse.redirect(new URL('/login', request.url))
            response.cookies.delete('accessToken')
            response.cookies.delete('refreshToken')
            return response
          }

          console.log('[AuthMiddleware] Attempting token refresh...')
          const refreshData = await auditorAuthRefresh(refreshToken)

          if (refreshData) {
            console.log('[AuthMiddleware] Token refresh successful')
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData
            const retryMeResult = await fetchAuditorMe(request, newAccessToken)

            if (retryMeResult && !(retryMeResult instanceof Response)) {
              console.log('[AuthMiddleware] Retry fetch me successful')
              const response = NextResponse.next({
                request: {
                  headers: retryMeResult.headers,
                },
              })

              const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/',
              }

              response.cookies.set('accessToken', newAccessToken, { 
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 7 // 7 дней
              })
              
              if (newRefreshToken) {
                response.cookies.set('refreshToken', newRefreshToken, { 
                  ...cookieOptions,
                  maxAge: 60 * 60 * 24 * 30 // 30 дней
                })
              }
              return response
            }
            console.log('[AuthMiddleware] Retry fetch me failed after refresh')
          } else {
            console.log('[AuthMiddleware] Token refresh failed')
          }

          const response = NextResponse.redirect(new URL('/login', request.url))
          response.cookies.delete('accessToken')
          response.cookies.delete('refreshToken')
          return response
        }
        
        // Для других ошибок Response (например, 500)
        return NextResponse.next()
      }

      // Если успешно получили данные пользователя (не Response и не null)
      if (meResult && 'headers' in meResult) {
        console.log('[AuthMiddleware] Auth successful')
        return NextResponse.next({
          request: {
            headers: meResult.headers,
          },
        })
      }
      console.log('[AuthMiddleware] No meResult and not a Response')
    } catch (error) {
      console.error('[AuthMiddleware] Critical error:', error)
    }
  }

  return null
}

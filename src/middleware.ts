import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Получаем токены из cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Проверяем, начинается ли путь с /lk
  const isLkRoute = pathname.startsWith('/lk')

  if (isLkRoute) {
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const meResponse = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
        credentials: 'omit',
        cache: 'no-store',
      })

      if (meResponse.ok) {
        const user = await meResponse.json()
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-token', accessToken)
        requestHeaders.set('x-user-data', JSON.stringify(user))

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }

      if (meResponse.status === 401 || meResponse.status === 403) {
        if (!refreshToken) {
          const response = NextResponse.redirect(new URL('/login', request.url))
          response.cookies.delete('accessToken')
          response.cookies.delete('refreshToken')
          return response
        }

        const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: `refresh_token=${encodeURIComponent(refreshToken)}`,
          credentials: 'omit',
          cache: 'no-store',
        })

        if (refreshResponse.ok) {
          const { access_token, refresh_token } = await refreshResponse.json()
          const retryMeResponse = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Accept': 'application/json',
            },
            credentials: 'omit',
            cache: 'no-store',
          })

          if (retryMeResponse.ok) {
            const user = await retryMeResponse.json()
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('x-user-token', access_token)
            requestHeaders.set('x-user-data', JSON.stringify(user))

            const response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })

            response.cookies.set('accessToken', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            response.cookies.set('refreshToken', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            return response
          }
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  if (accessToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/lk', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

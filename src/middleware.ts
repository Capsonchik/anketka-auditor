import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from './core/middlewares/auth-middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`[Middleware] Global check: ${pathname}`)

  // Выполняем проверку авторизации
  const authResponse = await authMiddleware(request)
  if (authResponse) {
    return authResponse
  }

  // Дополнительная логика для страниц входа/регистрации
  // const accessToken = request.cookies.get('accessToken')?.value
  // if (accessToken && (pathname === '/login' || pathname === '/register')) {
  //   return NextResponse.redirect(new URL('/lk', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

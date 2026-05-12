import { NextRequest, NextResponse } from 'next/server'
import { fetchAuditorMe } from '../api/fetch-auditor-me'

/**
 * Обработчик для гостевых страниц (логин, регистрация).
 * Если пользователь уже авторизован, перенаправляет его на главную страницу.
 * 
 * @param request - Объект запроса Next.js.
 * @returns NextResponse с редиректом на '/' или null, если пользователь не авторизован.
 */
export async function guestGuardHandler(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value

  if (accessToken) {
    const result = (await fetchAuditorMe(request, accessToken)) as any

    // Если удалось получить данные пользователя, значит он авторизован
    if (result && 'headers' in result) {
      console.log('[GuestGuard] User is already authorized, redirecting to /')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return null
}

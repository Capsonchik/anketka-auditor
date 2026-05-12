import { NextRequest, NextResponse } from 'next/server'
import { fetchAuditorMe } from '../api/fetch-auditor-me'

/**
 * Обработчик для главной страницы.
 * Проверяет наличие токена и подгружает данные аудитора в заголовки без редиректов.
 * 
 * @param request - Объект запроса Next.js.
 * @returns NextResponse с модифицированными заголовками или null.
 */
export async function homeAuditorHandler(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value

  if (accessToken) {
    const result = (await fetchAuditorMe(request, accessToken)) as any

    // Если запрос успешен, возвращаем NextResponse.next с новыми заголовками
    if (result && 'headers' in result) {
      return NextResponse.next({
        request: {
          headers: result.headers,
        },
      })
    }

    // Если токен невалиден (401), очищаем куки
    if (result instanceof Response && result.status === 401) {
      const response = NextResponse.next()
      response.cookies.delete('accessToken')
      response.cookies.delete('refreshToken')
      return response
    }
  }

  return null
}

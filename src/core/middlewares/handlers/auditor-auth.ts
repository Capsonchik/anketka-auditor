import { NextRequest, NextResponse } from 'next/server'
import { fetchAuditorMe } from '../api/fetch-auditor-me'
import { auditorAuthRefresh } from '../api/auditor-auth-refresh'
import { fetchAuditorRatingStats } from '../api/fetch-auditor-rating-stats'
import { encrypt } from '@shared/lib/crypto'

/**
 * Обработчик авторизации для приватной зоны аудитора (/auditor/*).
 * Выполняет проверку токенов, автоматическое обновление при истечении
 * и подгружает статистику рейтинга.
 * 
 * @param request - Объект запроса Next.js.
 * @returns NextResponse с редиректом или обновленными заголовками, либо null.
 */
export async function auditorAuthHandler(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Если токенов нет, отправляем на логин
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Если есть accessToken, проверяем его валидность
  if (accessToken) {
    const result = (await fetchAuditorMe(request, accessToken)) as any

    // Успешная авторизация (проверяем наличие данных аудитора, а не просто headers)
    if (result && 'auditor' in result && 'headers' in result) {
      console.log('[AuditorAuthHandler] Auth successful with accessToken')
      const headers = result.headers
      const auditor = result.auditor

      // Дополнительно подгружаем статистику рейтинга
      if (auditor?.id && auditor?.companyId) {
        const stats = await fetchAuditorRatingStats(auditor.id, auditor.companyId, accessToken)
        if (stats) {
          const encryptedStats = await encrypt(JSON.stringify(stats))
          headers.set('x-user-stats', encryptedStats)
        }
      }

      return NextResponse.next({
        request: {
          headers: headers,
        },
      })
    }

    console.log(`[AuditorAuthHandler] AccessToken invalid (status: ${result?.status}). RefreshToken present: ${!!refreshToken}`)

    // Если токен протух (401), но есть refreshToken — пытаемся обновить
    if (result instanceof Response && result.status === 401 && refreshToken) {
      console.log('[AuditorAuthHandler] Attempting token refresh...')
      return await handleTokenRefresh(request, refreshToken)
    }
  } 
  // Если accessToken нет, но есть refreshToken — пытаемся обновить
  else if (refreshToken) {
    return await handleTokenRefresh(request, refreshToken)
  }

  // В любой непонятной ситуации — на логин
  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

/**
 * Вспомогательная функция для обновления токенов.
 */
async function handleTokenRefresh(request: NextRequest, refreshToken: string) {
  console.log('[AuditorAuthHandler] Calling auditorAuthRefresh API...')
  const refreshData = await auditorAuthRefresh(refreshToken)

  if (refreshData?.accessToken) {
    console.log('[AuditorAuthHandler] Refresh successful, retrying fetchAuditorMe...')
    // Повторно запрашиваем данные пользователя с новым токеном
    const retryResult = (await fetchAuditorMe(request, refreshData.accessToken)) as any

    if (retryResult && 'headers' in retryResult) {
      console.log('[AuditorAuthHandler] Retry fetchAuditorMe successful, setting cookies')
      const headers = retryResult.headers
      const auditor = retryResult.auditor

      // Подгружаем статистику с новым токеном
      if (auditor?.id && auditor?.companyId) {
        const stats = await fetchAuditorRatingStats(auditor.id, auditor.companyId, refreshData.accessToken)
        if (stats) {
          const encryptedStats = await encrypt(JSON.stringify(stats))
          headers.set('x-user-stats', encryptedStats)
        }
      }

      const response = NextResponse.next({
        request: {
          headers: headers,
        },
      })

      // Сохраняем новые токены в куки
      response.cookies.set('accessToken', refreshData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      if (refreshData.refreshToken) {
        response.cookies.set('refreshToken', refreshData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })
      }

      return response
    }
  }

  console.log('[AuditorAuthHandler] Refresh failed or retry fetch failed, redirecting to login')
  // Если обновление не удалось
  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

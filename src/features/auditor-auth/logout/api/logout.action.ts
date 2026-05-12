'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logoutAction() {
  console.log('[LogoutAction] Starting logout process')
  const cookieStore = await cookies()
  
  const hasAccess = cookieStore.has('accessToken')
  const hasRefresh = cookieStore.has('refreshToken')
  console.log(`[LogoutAction] Cookies before delete - access: ${hasAccess}, refresh: ${hasRefresh}`)

  // Удаляем куки на стороне сервера
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  
  console.log('[LogoutAction] Cookies deleted, revalidating path /')
  // Сбрасываем кэш для всех страниц, чтобы заголовки x-user-data обновились
  revalidatePath('/', 'layout')
  
  console.log('[LogoutAction] Redirecting to /login')
  // Перенаправляем на страницу логина
  redirect('/login')
}

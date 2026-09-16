import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Публичный лендинг отключён (виджеты в `widgets/public/landing` сохранены).
 * SSR-fallback на случай обхода middleware.
 */
export default async function HomePage() {
  const cookieStore = await cookies()
  if (cookieStore.has('accessToken')) {
    redirect('/auditor')
  }
  redirect('/login')
}

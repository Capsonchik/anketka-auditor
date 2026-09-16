import { createMiddleware } from './core/middlewares/shared/utils'
import { homeAuditorHandler } from './core/middlewares/handlers/home-auditor'
import { auditorAuthHandler } from './core/middlewares/handlers/auditor-auth'
import { guestGuardHandler } from './core/middlewares/handlers/guest-guard'

/**
 * Глобальный диспетчер middleware.
 * Маршрутизирует запросы на соответствующие обработчики в зависимости от пути.
 */
export const middleware = createMiddleware({
  // Главная: лендинг отключён — гость → /login, авторизованный → /auditor
  '/': homeAuditorHandler,
  
  // Гостевые страницы: если авторизован — редирект в кабинет
  '/login': guestGuardHandler,
  '/register': guestGuardHandler,
  
  // Приватная зона аудитора: строгая проверка авторизации и редиректы
  '/auditor/*': auditorAuthHandler,
})
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

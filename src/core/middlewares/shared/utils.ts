import { NextRequest, NextResponse } from 'next/server'

/**
 * Тип для обработчика middleware.
 * Возвращает NextResponse, если обработка завершена, или null, если нужно передать управление следующему обработчику.
 */
export type MiddlewareHandler = (
  request: NextRequest
) => Promise<NextResponse | null>

/**
 * Создает диспетчер middleware на основе карты путей.
 * 
 * @param handlers - Объект, где ключи — паттерны путей ('/', '/auditor/*', '*'), а значения — обработчики.
 * @returns Функция middleware для Next.js.
 * 
 * @example
 * export const middleware = createMiddleware({
 *   '/': homeHandler,
 *   '/profile/*': authHandler
 * })
 */
export function createMiddleware(
  handlers: Record<string, MiddlewareHandler | MiddlewareHandler[]>
) {
  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl

    for (const [pathPattern, handler] of Object.entries(handlers)) {
      const isMatch = pathPattern === '*' || 
                      (pathPattern.endsWith('/*') 
                        ? pathname.startsWith(pathPattern.slice(0, -2)) 
                        : pathname === pathPattern)

      if (isMatch) {
        const handlerList = Array.isArray(handler) ? handler : [handler]
        
        for (const h of handlerList) {
          const response = await h(request)
          if (response) return response
        }
      }
    }

    return NextResponse.next()
  }
}

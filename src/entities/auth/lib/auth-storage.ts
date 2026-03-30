import { cookies } from 'next/headers';

/**
 * Сервис для работы с токенами аутентификации в cookies
 * 
 * @description
 * Управляет хранением access_token и refresh_token в HTTP cookies.
 * Использует Next.js cookies API из next/headers.
 * 
 * @example
 * ```tsx
 * // В Server Component или Server Action
 * import { authStorage } from '@entities/auth';
 * 
 * // Сохранить токены
 * await authStorage.setTokens('access_token_value', 'refresh_token_value');
 * 
 * // Получить access token
 * const token = await authStorage.getAccessToken();
 * 
 * // Очистить при выходе
 * await authStorage.clear();
 * ```
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Опции для установки cookie
 */
interface CookieOptions {
  /** Время жизни в секундах (по умолчанию 1 день для access, 30 дней для refresh) */
  maxAge?: number;
  /** Путь cookie (по умолчанию '/') */
  path?: string;
  /** SameSite атрибут (по умолчанию 'lax') */
  sameSite?: 'strict' | 'lax' | 'none';
  /** Secure флаг (по умолчанию true) */
  secure?: boolean;
  /** HttpOnly флаг (по умолчанию false для доступа из JS) */
  httpOnly?: boolean;
}

/**
 * Сервис управления токенами аутентификации
 */
export const authStorage = {
  /**
   * Сохранить пару токенов
   * 
   * @param accessToken - JWT токен доступа
   * @param refreshToken - JWT токен обновления
   * 
   * @example
   * ```tsx
   * // В Server Action
   * const { access_token, refresh_token } = await verifyCode(credentials);
   * await authStorage.setTokens(access_token, refresh_token);
   * ```
   */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    const cookieStore = await cookies();
    
    // Access token: 1 день (обновляется часто)
    cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 60 * 60 * 24, // 1 день в секундах
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Доступ из JS для добавления в заголовки
    });
    
    // Refresh token: 30 дней (долгоживущий)
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 дней в секундах
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });
  },
  
  /**
   * Получить access token
   * 
   * @returns Access token или null если не найден
   * 
   * @example
   * ```tsx
   * // В Server Component
   * const token = await authStorage.getAccessToken();
   * if (token) {
   *   // Пользователь аутентифицирован
   * }
   * ```
   */
  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_KEY)?.value ?? null;
  },
  
  /**
   * Получить refresh token
   * 
   * @returns Refresh token или null если не найден
   * 
   * @example
   * ```tsx
   * const refreshToken = await authStorage.getRefreshToken();
   * if (refreshToken) {
   *   await refreshAccessToken(refreshToken);
   * }
   * ```
   */
  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_KEY)?.value ?? null;
  },
  
  /**
   * Проверить наличие токенов
   * 
   * @returns true если оба токена присутствуют
   * 
   * @example
   * ```tsx
   * if (await authStorage.hasTokens()) {
   *   // Пользователь аутентифицирован
   * }
   * ```
   */
  async hasTokens(): Promise<boolean> {
    const cookieStore = await cookies();
    return (
      cookieStore.has(ACCESS_TOKEN_KEY) &&
      cookieStore.has(REFRESH_TOKEN_KEY)
    );
  },
  
  /**
   * Очистить все токены (при выходе из системы)
   * 
   * @example
   * ```tsx
   * // В Server Action
   * const handleLogout = async () => {
   *   await authStorage.clear();
   *   redirect('/login');
   * };
   * ```
   */
  async clear(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_KEY);
    cookieStore.delete(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Получить пару токенов
   * 
   * @returns Объект с токенами или null
   * 
   * @example
   * ```tsx
   * const tokens = await authStorage.getTokens();
   * if (tokens) {
   *   console.log('Access:', tokens.accessToken);
   *   console.log('Refresh:', tokens.refreshToken);
   * }
   * ```
   */
  async getTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value ?? null;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value ?? null;
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    
    return null;
  },
};

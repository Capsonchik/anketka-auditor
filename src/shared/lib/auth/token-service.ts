// shared/lib/auth/token-service.ts

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_TYPE: 'tokenType',
  EXPIRES_IN: 'expiresInSeconds',
} as const;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

/**
 * Клиентский сервис для работы с токенами (браузер)
 * Использует localStorage + cookies для middleware
 */
class TokenService {
  /**
   * Установка cookie (клиентская часть)
   */
  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const isProduction = process.env.NODE_ENV === 'production';
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}${isProduction ? '; Secure' : ''}; SameSite=Lax`;
  }

  /**
   * Удаление cookie
   */
  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
   * Получение cookie
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  /**
   * Сохраняет все токены
   */
  setTokens(tokens: Tokens): void {
    // Удалено сохранение в localStorage и ручная установка кук для безопасности
  }

  /**
   * Получает access токен
   */
  getAccessToken(): string | null {
    return null;
  }

  /**
   * Получает refresh токен
   */
  getRefreshToken(): string | null {
    return null;
  }

  /**
   * Получает тип токена
   */
  getTokenType(): string | null {
    return 'Bearer';
  }

  /**
   * Получает полный токен с типом для заголовков
   */
  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    const tokenType = this.getTokenType();
    
    if (!token) return null;
    
    return `${tokenType || 'Bearer'} ${token}`;
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getAccessToken();
  }

  /**
   * Удаляет все токены (выход из системы)
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    // Удаляем из localStorage
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.TOKEN_TYPE);
    localStorage.removeItem(TOKEN_KEYS.EXPIRES_IN);
    
    // Удаляем из cookies
    this.deleteCookie(TOKEN_KEYS.ACCESS_TOKEN);
    this.deleteCookie(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Обновляет токены
   */
  updateTokens(tokens: Tokens): void {
    this.setTokens(tokens);
  }
}

export const tokenService = new TokenService();
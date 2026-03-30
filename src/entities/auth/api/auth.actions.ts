'use server';

import { authStorage } from '../lib/auth-storage';

/**
 * Server Action для сохранения токенов аутентификации в cookies
 * 
 * @description
 * Обертка над authStorage для возможности вызова из клиентских компонентов.
 * Использует 'use server' директиву.
 * 
 * @param accessToken - JWT токен доступа
 * @param refreshToken - JWT токен обновления
 */
export async function setAuthTokensAction(accessToken: string, refreshToken: string) {
  await authStorage.setTokens(accessToken, refreshToken);
}

/**
 * Server Action для удаления токенов (выход из системы)
 */
export async function clearAuthTokensAction() {
  await authStorage.clear();
}

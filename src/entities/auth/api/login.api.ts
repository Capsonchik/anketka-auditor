import { api } from '@shared/api';
import type { LoginCredentials, LoginResponse } from '../types/auth.types';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * API для аутентификации пользователя (POST /auth/login)
 *
 * @description
 * Первый шаг процесса аутентификации:
 * 1. Аутентификация в Keycloak по логину и паролю
 * 2. Инициация 2FA-сессии
 * 3. Проверка IP whitelist
 *
 * После успешного логина пользователю отправляется код 2FA через
 * выбранный канал связи (SMS, email, Telegram).
 *
 * @example
 * ```tsx
 * const [login, { isLoading, error }] = useLoginMutation();
 *
 * const handleLogin = async (credentials: LoginCredentials) => {
 *   const response = await login(credentials).unwrap();
 *   // response.tfa_session используется для отправки кода
 * };
 * ```
 */
export const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Аутентификация пользователя (логин + пароль)
     *
     * @param credentials - Логин и пароль пользователя
     * @returns session_id для последующей 2FA верификации
     */
    login: build.mutation<LoginResponse, LoginCredentials>({
      query: ({ username, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: new URLSearchParams({ username, password }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
  }),
  overrideExisting: true,
});

/**
 * Хук для выполнения запроса логина
 */
export const { useLoginMutation } = loginApi;

import { api } from '@shared/api';
import type { VerifyCodeCredentials, VerifyResponse } from '../types/auth.types';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * API для верификации 2FA кода (POST /auth/2fa/verify)
 *
 * @description
 * Третий (финальный) шаг процесса аутентификации:
 * Проверяет код 2FA и возвращает пару токенов (access + refresh).
 *
 * После успешной верификации пользователь считается аутентифицированным.
 * Access token используется для всех последующих запросов к API.
 * Refresh token используется для обновления access token по истечении его срока действия.
 *
 * @example
 * ```tsx
 * const [verifyCode, { isLoading, error }] = useVerifyCodeMutation();
 *
 * const handleVerify = async (sessionId: string, code: string) => {
 *   const tokens = await verifyCode({ session_id: sessionId, code }).unwrap();
 *   // Сохраняем токены: tokens.access_token, tokens.refresh_token
 * };
 * ```
 */
export const verifyCodeApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Верификация 2FA кода и получение токенов
     *
     * @param credentials - session_id и код 2FA
     * @returns Пара токенов: access_token и refresh_token
     */
    verifyCode: build.mutation<VerifyResponse, VerifyCodeCredentials>({
      query: ({ session_id, code }) => ({
        url: '/auth/2fa/verify',
        method: 'POST',
        body: new URLSearchParams({ session_id, code }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
  }),
  overrideExisting: true,
});

/**
 * Хук для выполнения запроса верификации кода
 */
export const { useVerifyCodeMutation } = verifyCodeApi;

import { api } from '@shared/api';
import type { SendCodeCredentials } from '../types/auth.types';

/**
 * API для отправки 2FA кода (POST /auth/send-code)
 * 
 * @description
 * Второй шаг процесса аутентификации:
 * Отправляет код 2FA пользователю через выбранный канал связи.
 * 
 * Каналы доставки:
 * - Telegram Bot (через Redis Stream)
 * - Email
 * - SMS
 * 
 * @example
 * ```tsx
 * const [sendCode, { isLoading, error }] = useSendCodeMutation();
 * 
 * const handleSendCode = async (sessionId: string) => {
 *   await sendCode({ session_id: sessionId }).unwrap();
 *   // Код отправлен пользователю
 * };
 * ```
 */
export const sendCodeApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Отправить 2FA код пользователю
     * 
     * @param credentials - session_id, полученный после логина
     * @returns void (204 No Content)
     */
    sendCode: build.mutation<void, SendCodeCredentials>({
      query: ({ session_id }) => ({
        url: '/auth/send-code',
        method: 'POST',
        body: new URLSearchParams({ session_id }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
      // 204 No Content не имеет тела ответа
      transformResponse: () => undefined,
    }),
  }),
  overrideExisting: true,
});

/**
 * Хук для выполнения запроса отправки кода
 */
export const { useSendCodeMutation } = sendCodeApi;

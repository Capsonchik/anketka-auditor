/**
 * Сущность Auth - аутентификация пользователя
 * 
 * @module entities/auth
 * 
 * @description
 * Предоставляет API и хуки для полного цикла аутентификации:
 * 1. Логин (username + password) → session_id
 * 2. Отправка 2FA кода → код пользователю
 * 3. Верификация кода → access_token + refresh_token
 * 
 * Токены хранятся в cookies через authStorage.
 * 
 * @example
 * ```tsx
 * // В Server Action - сохранение токенов
 * import { authStorage } from '@entities/auth';
 * 
 * async function loginAction(formData: FormData) {
 *   const tokens = await authenticateUser(formData);
 *   await authStorage.setTokens(tokens.access_token, tokens.refresh_token);
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // В клиентском компоненте - использование хука
 * import { useAuth } from '@entities/auth';
 * 
 * function AuthFlow() {
 *   const { step, login, verifyCode } = useAuth();
 *   // ...
 * }
 * ```
 */

// Типы
export type {
  LoginCredentials,
  LoginResponse,
  SendCodeCredentials,
  VerifyCodeCredentials,
  VerifyResponse,
} from './types';

// API
export {
  loginApi,
  useLoginMutation,
  sendCodeApi,
  useSendCodeMutation,
  verifyCodeApi,
  useVerifyCodeMutation,
  setAuthTokensAction,
  clearAuthTokensAction,
} from './api';

// Storage (cookies)
export { authStorage } from './lib/auth-storage';

// Hooks
export { useAuth } from './hooks';

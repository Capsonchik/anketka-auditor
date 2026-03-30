import { useCallback, useState } from 'react';
import { useLoginMutation } from '../api/login.api';
import { useSendCodeMutation } from '../api/send-code.api';
import { useVerifyCodeMutation } from '../api/verify.api';
import type { LoginCredentials } from '../types/auth.types';

/**
 * Результат работы хука useAuth
 */
interface UseAuthResult {
  /** Текущий шаг аутентификации */
  step: 'login' | 'code' | 'success';
  /** session_id для 2FA (после логина) */
  tfaSession: string | null;
  /** Флаг загрузки */
  isLoading: boolean;
  /** Ошибка */
  error: unknown;
  /** Выполнить логин */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Отправить код 2FA */
  sendCode: () => Promise<void>;
  /** Верифицировать код 2FA */
  verifyCode: (code: string) => Promise<void>;
  /** Сбросить процесс аутентификации */
  reset: () => void;
}

/**
 * Хук для управления процессом аутентификации
 * 
 * @description
 * Управляет полным циклом аутентификации:
 * 1. Логин (username + password) → получаем session_id
 * 2. Отправка кода 2FA → код отправляется пользователю
 * 3. Верификация кода → получаем access_token и refresh_token
 * 
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { step, login, sendCode, verifyCode, isLoading, error } = useAuth();
 *   
 *   const handleLogin = async (credentials: LoginCredentials) => {
 *     await login(credentials);
 *     // Переход на шаг ввода кода
 *   };
 *   
 *   const handleVerify = async (code: string) => {
 *     await verifyCode(code);
 *     // Успех — пользователь аутентифицирован
 *   };
 *   
 *   if (step === 'login') {
 *     return <LoginForm onSubmit={handleLogin} />;
 *   }
 *   
 *   if (step === 'code') {
 *     return <CodeForm onSendCode={sendCode} onVerify={handleVerify} />;
 *   }
 * }
 * ```
 */
export function useAuth(): UseAuthResult {
  const [tfaSession, setTfaSession] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'code' | 'success'>('login');
  
  const [loginMutation, loginResult] = useLoginMutation();
  const [sendCodeMutation, sendCodeResult] = useSendCodeMutation();
  const [verifyCodeMutation, verifyCodeResult] = useVerifyCodeMutation();
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginMutation(credentials).unwrap();
    setTfaSession(response.tfa_session);
    setStep('code');
  }, [loginMutation]);
  
  const sendCode = useCallback(async () => {
    if (!tfaSession) {
      throw new Error('TFA session not initialized');
    }
    await sendCodeMutation({ session_id: tfaSession }).unwrap();
  }, [sendCodeMutation, tfaSession]);
  
  const verifyCode = useCallback(async (code: string) => {
    if (!tfaSession) {
      throw new Error('TFA session not initialized');
    }
    await verifyCodeMutation({ session_id: tfaSession, code }).unwrap();
    setStep('success');
    setTfaSession(null);
  }, [verifyCodeMutation, tfaSession]);
  
  const reset = useCallback(() => {
    setTfaSession(null);
    setStep('login');
  }, []);
  
  // Объединяем состояния загрузки и ошибок всех мутаций
  const isLoading = loginResult.isLoading || sendCodeResult.isLoading || verifyCodeResult.isLoading;
  const error = loginResult.error || sendCodeResult.error || verifyCodeResult.error;
  
  return {
    step,
    tfaSession,
    isLoading,
    error,
    login,
    sendCode,
    verifyCode,
    reset,
  };
}

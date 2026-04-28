// hooks/useAutoClearErrors.ts
import React from 'react';
import { UseFormClearErrors } from 'react-hook-form';

export interface UseAutoClearErrorsOptions {
  /** Задержка перед очисткой ошибки в миллисекундах (по умолчанию 5000) */
  delay?: number;
  /** Очищать ли ошибки автоматически (по умолчанию true) */
  enabled?: boolean;
}

/**
 * Хук для автоматической очистки всех ошибок формы через заданный интервал
 * @param clearErrors - функция clearErrors из react-hook-form
 * @param errors - объект ошибок из formState
 * @param options - настройки хука
 */
export const useAutoClearErrors = (
  clearErrors: UseFormClearErrors<any>,
  errors: Record<string, any>,
  options: UseAutoClearErrorsOptions = {}
) => {
  const { delay = 5000, enabled = true } = options;
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const prevHasErrorsRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!enabled) return;

    const hasErrors = Object.keys(errors).length > 0;

    // Если появились ошибки
    if (hasErrors && !prevHasErrorsRef.current) {
      // Очищаем старый таймер
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Устанавливаем новый таймер
      timerRef.current = setTimeout(() => {
        clearErrors();
        console.log('[useAutoClearErrors] Автоматическая очистка ошибок через', delay, 'мс');
      }, delay);
    }
    
    // Если ошибок нет, очищаем таймер
    if (!hasErrors && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    prevHasErrorsRef.current = hasErrors;

    // Очистка таймера при размонтировании
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [errors, clearErrors, delay, enabled]);
};
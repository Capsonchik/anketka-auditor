import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

/**
 * Интерфейс для маппинга полей бэкенда на поля формы
 */
export type FieldMapping<T extends FieldValues> = Record<string, Path<T>>;

/**
 * Обработчик ошибок формы от API.
 * Парсит ответ бэкенда и устанавливает ошибки в соответствующие поля react-hook-form.
 * 
 * @param error - Объект ошибки от API
 * @param setError - Функция setError из useForm
 * @param fieldMapping - Объект для сопоставления имен полей API с именами полей в форме
 * @param fallbackMessage - Сообщение об ошибке по умолчанию
 */
export function handleFormErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
  fieldMapping?: FieldMapping<T>,
  fallbackMessage: string = 'Произошла непредвиденная ошибка'
) {
  const errorData = error?.data;

  // 1. Обработка ошибок валидации полей (формат { errors: { field: 'message' } })
  if (errorData?.errors) {
    Object.entries(errorData.errors).forEach(([apiField, message]) => {
      const formField = fieldMapping?.[apiField] || (apiField as Path<T>);
      setError(formField, {
        type: 'manual',
        message: String(message),
      });
    });
    return;
  }

  // 2. Обработка ошибок в формате detail (FastAPI style или Keycloak)
  if (errorData?.detail) {
    const detail = errorData.detail;

    // Проверка на Keycloak/RAW ошибку (как в примере пользователя)
    if (detail.raw && typeof detail.raw === 'string') {
      try {
        const rawParsed = JSON.parse(detail.raw);
        // Приоритет отдаем error_description, так как там обычно более понятное сообщение
        const message = rawParsed.error_description || rawParsed.message || detail.message;
        
        if (message) {
          setError('root' as Path<T>, {
            type: 'manual',
            message: String(message),
          });
          return;
        }
      } catch (e) {
        console.error('[handleFormErrors] Failed to parse raw error JSON', e);
      }
    } else if (detail.message || detail.code) {
      // Если это объект с message или code (но без raw)
      setError('root' as Path<T>, {
        type: 'manual',
        message: String(detail.message || detail.code),
      });
      return;
    }

    if (Array.isArray(detail)) {
      // Если это массив ошибок валидации FastAPI
      errorData.detail.forEach((err: any) => {
        const apiField = err.loc?.[err.loc.length - 1];
        const message = err.msg;
        
        if (apiField) {
          const formField = fieldMapping?.[apiField] || (apiField as Path<T>);
          setError(formField, {
            type: 'manual',
            message: String(message),
          });
        }
      });
    } else {
      // Если это просто строка с ошибкой
      setError('root' as Path<T>, {
        type: 'manual',
        message: String(errorData.detail),
      });
    }
    return;
  }

  // 3. Обработка общих ошибок (формат { error: 'message' })
  if (errorData?.error) {
    setError('root' as Path<T>, {
      type: 'manual',
      message: String(errorData.error),
    });
    return;
  }

  // 4. Fallback на сообщение по умолчанию
  setError('root' as Path<T>, {
    type: 'manual',
    message: fallbackMessage,
  });
}

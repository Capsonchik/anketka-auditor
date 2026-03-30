/**
 * Параметры для входа (логин + пароль)
 */
export interface LoginCredentials {
  /** Имя пользователя или email */
  username: string;
  /** Пароль пользователя */
  password: string;
}

/**
 * Ответ на успешный запрос логина
 * 
 * @description
 * Содержит session_id для последующей 2FA верификации.
 * После логина пользователю отправляется код через выбранный канал (SMS, email, Telegram).
 */
export interface LoginResponse {
  /** Идентификатор сессии 2FA */
  tfa_session: string;
}

/**
 * Параметры для отправки 2FA кода
 */
export interface SendCodeCredentials {
  /** Идентификатор сессии, полученный после логина */
  session_id: string;
}

/**
 * Параметры для верификации 2FA кода
 */
export interface VerifyCodeCredentials {
  /** Идентификатор сессии, полученный после логина */
  session_id: string;
  /** Код 2FA, полученный пользователем */
  code: string;
}

/**
 * Ответ на успешную верификацию 2FA кода
 * 
 * @description
 * Содержит пару токенов для аутентификации в системе.
 * Access token используется для доступа к API.
 * Refresh token используется для обновления access token.
 */
export interface VerifyResponse {
  /** JWT токен доступа (короткоживущий) */
  access_token: string;
  /** JWT токен обновления (долгоживущий) */
  refresh_token: string;
}

/**
 * Детали ошибки валидации
 */
export interface ValidationErrorDetail {
  /** Путь к полю с ошибкой */
  loc: (string | number)[];
  /** Сообщение об ошибке */
  msg: string;
  /** Тип ошибки */
  type: string;
  /** Входное значение, вызвавшее ошибку */
  input?: string;
  /** Дополнительный контекст ошибки */
  ctx?: Record<string, unknown>;
}

/**
 * Ответ при ошибке валидации (422)
 */
export interface ValidationErrorResponse {
  /** Список деталей ошибок */
  detail: ValidationErrorDetail[];
}

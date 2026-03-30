/**
 * Модель пользователя системы
 */
export interface IUser {
  /** Уникальный идентификатор пользователя (UUID) */
  id: string;
  
  /** Имя пользователя (логин) */
  username: string;
  
  /** Электронная почта */
  email: string;
  
  /** Имя */
  first_name: string;
  
  /** Фамилия */
  last_name: string;
  
  /** Роль пользователя в системе */
  role: string;
  
  /** Название клиента/организации */
  client_name: string;
  
  /** Имя пользователя в Telegram */
  telegram_username: string;
  
  /** Номер телефона */
  phone_number: string;
  
  /** Тип двухфакторной аутентификации */
  two_factor_type: string;
  
  /** Является ли пользователем менеджером */
  is_manager: boolean;
  
  /** Идентификатор клиента */
  client_id: number;
}

/**
 * Ответ API на запрос GET /me
 */
export type UserMeResponse = IUser;

import { useGetMeQuery } from '../api/user.api';
import type { IUser } from '../types/user.types';

/**
 * Результат работы хука useUser
 */
interface UseUserResult {
  /** Данные пользователя */
  user: IUser | null;
  /** Флаг загрузки данных */
  isLoading: boolean;
  /** Флаг ошибки загрузки */
  isError: boolean;
}

/**
 * Хук для работы с сущностью пользователя
 * 
 * @description
 * Предоставляет данные текущего пользователя через RTK Query.
 * Если API возвращает пользователя — вы авторизованы.
 * 
 * @returns Объект с данными пользователя и флагами состояния
 * 
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, isLoading, isError } = useUser();
 *   
 *   if (isLoading) return <Loader />;
 *   if (isError) return <ErrorPage />;
 *   if (!user) return <LoginForm />;
 *   
 *   return <div>{user.username}</div>;
 * }
 * ```
 */
export function useUser(): UseUserResult {
  const { data, isLoading, isError } = useGetMeQuery();
  
  return {
    user: data ?? null,
    isLoading,
    isError,
  };
}

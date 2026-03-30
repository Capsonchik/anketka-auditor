/**
 * Сущность User - управление данными текущего пользователя
 * 
 * @module entities/user
 * 
 * @description
 * Предоставляет API и хуки для работы с данными текущего
 * аутентифицированного пользователя.
 * 
 * @example
 * ```tsx
 * // Получение данных пользователя в компоненте
 * import { useUser } from '@entities/user';
 * 
 * function Profile() {
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

// Типы
export type { IUser, UserMeResponse } from './types';

// API
export { userApi, useGetMeQuery } from './api';

// Model (Redux)
export { userReducer, clearUser, setUser, userSelectors } from './model';
export type { UserState } from './model';

// Hooks
export { useUser } from './hooks';

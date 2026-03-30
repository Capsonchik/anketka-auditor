import { api } from '@shared/api';
import type { IUser, UserMeResponse } from '../types/user.types';

/**
 * API для работы с сущностью пользователя
 */
export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Получить информацию о текущем пользователе
     * 
     * @description Запрос требует Bearer токен в заголовке Authorization
     * @returns Полная информация о текущем аутентифицированном пользователе
     */
    getMe: build.query<UserMeResponse, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

/**
 * Хук для получения данных текущего пользователя
 */
export const { useGetMeQuery } = userApi;

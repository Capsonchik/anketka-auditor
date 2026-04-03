import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryApi } from '@reduxjs/toolkit/query'

const API_URL =  'https://dev.bi.romir.ru/back'

/**
 * Базовый API для взаимодействия с бэкендом
 *
 * @description
 * Использует RTK Query для кэширования и управления состоянием.
 * Все эндпоинты сущностей инжектятся в этот экземпляр API.
 *
 * @example
 * // В сущности:
 * export const userApi = api.injectEndpoints({
 *   endpoints: (build) => ({
 *     getUser: build.query<User, number>({
 *       query: (id) => `/users/${id}`,
 *       providesTags: ['User'],
 *     }),
 *   }),
 * });
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      let token;

      if (typeof window !== 'undefined') {
        // На клиенте
        token = document?.cookie
          ?.split('; ')
          ?.find(row => row.startsWith('accessToken='))
          ?.split('=')[1];
      }
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      
      headers.set('Accept', 'application/json')
      
      return headers
    },
  }),
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
})

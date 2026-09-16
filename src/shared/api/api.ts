import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryApi } from '@reduxjs/toolkit/query'

const API_URL = '/api/proxy'

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
      headers.set('Accept', 'application/json')
      return headers
    },
  }),
  tagTypes: ['User', 'Auth', 'Assignments', 'MapMarkers', 'MapFilters'],
  endpoints: () => ({}),
})

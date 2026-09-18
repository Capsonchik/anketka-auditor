import { api } from '@/shared/api/api'
import type {
  PublicPaDraftBody,
  PublicPaDraftResponse,
  PublicPaDraftSaveResponse,
  PublicPaOptionsResponse,
  PublicPaSession,
  PublicPaSubmitBody,
} from '../model/types'

export type GetPublicPaDraftArg = {
  token: string
  checkId?: string | null
}

export type GetPublicPaOptionsArg = {
  token: string
  params: Record<string, string>
}

export const publicPaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPublicPa: build.query<PublicPaSession, string>({
      query: (token) => `/api/v1/public/pa/${token}`,
      providesTags: (_r, _e, token) => [{ type: 'PublicPa', id: token }],
    }),
    getPublicPaDraft: build.query<PublicPaDraftResponse, GetPublicPaDraftArg | string>({
      query: (arg) => {
        const token = typeof arg === 'string' ? arg : arg.token
        const checkId = typeof arg === 'string' ? undefined : arg.checkId || undefined
        return {
          url: `/api/v1/public/pa/${token}/draft`,
          params: checkId ? { checkId } : undefined,
        }
      },
      providesTags: (_r, _e, arg) => {
        const token = typeof arg === 'string' ? arg : arg.token
        return [{ type: 'PublicPaDraft', id: token }]
      },
    }),
    getPublicPaOptions: build.query<PublicPaOptionsResponse, GetPublicPaOptionsArg>({
      query: ({ token, params }) => ({
        url: `/api/v1/public/pa/${token}/options`,
        params,
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const entries = Object.entries(queryArgs.params)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
        return `${queryArgs.token}?${entries}`
      },
    }),
    savePublicPaDraft: build.mutation<
      PublicPaDraftSaveResponse,
      { token: string; body: PublicPaDraftBody }
    >({
      query: ({ token, body }) => ({
        url: `/api/v1/public/pa/${token}/draft`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { token }) => [{ type: 'PublicPaDraft', id: token }],
    }),
    submitPublicPa: build.mutation<null, { token: string; body: PublicPaSubmitBody }>({
      query: ({ token, body }) => ({
        url: `/api/v1/public/pa/${token}/submit`,
        method: 'POST',
        body,
        // 204 / пустое тело: нельзя вернуть undefined — RTK падает с «neither error nor result»
        responseHandler: async (response) => {
          if (response.status === 204) return null
          const text = await response.text()
          if (!text) return null
          try {
            return JSON.parse(text) as unknown
          } catch {
            return null
          }
        },
      }),
      invalidatesTags: ['Assignments', 'PublicPaDraft', 'MapMarkers'],
    }),
  }),
})

export const {
  useGetPublicPaQuery,
  useGetPublicPaDraftQuery,
  useGetPublicPaOptionsQuery,
  useLazyGetPublicPaQuery,
  useLazyGetPublicPaDraftQuery,
  useLazyGetPublicPaOptionsQuery,
  useSavePublicPaDraftMutation,
  useSubmitPublicPaMutation,
} = publicPaApi

import { api } from '@/shared/api/api'
import type {
  PublicPaDraftBody,
  PublicPaDraftResponse,
  PublicPaDraftSaveResponse,
  PublicPaSession,
  PublicPaSubmitBody,
} from '../model/types'

export const publicPaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPublicPa: build.query<PublicPaSession, string>({
      query: (token) => `/api/v1/public/pa/${token}`,
      providesTags: (_r, _e, token) => [{ type: 'PublicPa', id: token }],
    }),
    getPublicPaDraft: build.query<PublicPaDraftResponse, string>({
      query: (token) => `/api/v1/public/pa/${token}/draft`,
      providesTags: (_r, _e, token) => [{ type: 'PublicPaDraft', id: token }],
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
    submitPublicPa: build.mutation<void, { token: string; body: PublicPaSubmitBody }>({
      query: ({ token, body }) => ({
        url: `/api/v1/public/pa/${token}/submit`,
        method: 'POST',
        body,
        responseHandler: async (response) => {
          if (response.status === 204) return undefined
          const text = await response.text()
          return text ? JSON.parse(text) : undefined
        },
      }),
      invalidatesTags: ['Assignments', 'PublicPaDraft', 'MapMarkers'],
    }),
  }),
})

export const {
  useGetPublicPaQuery,
  useGetPublicPaDraftQuery,
  useLazyGetPublicPaQuery,
  useLazyGetPublicPaDraftQuery,
  useSavePublicPaDraftMutation,
  useSubmitPublicPaMutation,
} = publicPaApi

import { api } from '@shared/api/api';
import type { AuditorUpdateRequest, MeResponse } from '../model/types';

export const auditorApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => '/api/v1/auditor/me',
      providesTags: ['User'],
    }),
    updateAuditor: build.mutation<MeResponse, AuditorUpdateRequest>({
      query: (body) => ({
        url: '/api/v1/auditor/update',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetMeQuery, useUpdateAuditorMutation } = auditorApi;

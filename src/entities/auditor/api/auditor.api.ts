import { api } from '@shared/api/api';
import { 
  MeResponse, 
  ListAssignmentsResponse 
} from '../model/types';

export const auditorApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => '/api/v1/auditor/me',
      providesTags: ['User'],
    }),
    getAssignments: build.query<ListAssignmentsResponse, void>({
      query: () => '/api/v1/auditor/assignments',
    }),
  }),
});

export const { 
  useGetMeQuery, 
  useGetAssignmentsQuery 
} = auditorApi;

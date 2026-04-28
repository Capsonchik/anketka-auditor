import { api } from '@/shared/api/api';
import { AssignmentsResponse } from '../model/types';

export const assignmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAssignments: build.query<AssignmentsResponse, void>({
      query: () => '/api/v1/auditor/assignments',
      providesTags: ['Assignments' as any],
    }),
  }),
});

export const { useGetAssignmentsQuery } = assignmentApi;

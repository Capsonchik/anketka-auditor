import { api } from '@/shared/api/api'
import type { Assignment, AssignmentsResponse } from '../model/types'

export type AssignmentStatusUpdate = {
  projectId: string
  checkId: string
  status: 'accepted' | 'declined'
}

export const assignmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAssignments: build.query<AssignmentsResponse, void>({
      query: () => '/api/v1/auditor/assignments',
      providesTags: ['Assignments'],
    }),
    getAssignment: build.query<Assignment, string>({
      query: (checkId) => `/api/v1/auditor/assignments/${checkId}`,
      providesTags: (_result, _error, checkId) => [{ type: 'Assignments', id: checkId }],
    }),
    updateAssignmentStatus: build.mutation<void, AssignmentStatusUpdate>({
      query: ({ projectId, checkId, status }) => ({
        url: `/api/v1/auditor/assignments/${projectId}/${checkId}/status`,
        method: 'POST',
        body: { status },
        responseHandler: async (response) => {
          if (response.status === 204) return undefined
          const text = await response.text()
          return text ? JSON.parse(text) : undefined
        },
      }),
      invalidatesTags: ['Assignments', 'MapMarkers', 'MapFilters'],
    }),
  }),
})

export const {
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useUpdateAssignmentStatusMutation,
} = assignmentApi

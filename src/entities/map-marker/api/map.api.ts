import { api } from '@/shared/api/api'
import type {
  CheckClaimResponse,
  CreateCheckClaimBody,
  MapFiltersResponse,
  MapMarkersQuery,
  MapMarkersResponse,
} from '../model/types'

function appendList(params: URLSearchParams, key: string, values?: string[]) {
  if (!values?.length) return
  for (const value of values) {
    if (value) params.append(key, value)
  }
}

function buildMarkersParams(query: MapMarkersQuery = {}): string {
  const params = new URLSearchParams()
  appendList(params, 'projectIds', query.projectIds)
  appendList(params, 'status', query.status)
  appendList(params, 'surveyIds', query.surveyIds)
  if (query.search?.trim()) params.set('search', query.search.trim())
  if (query.dateFrom) params.set('dateFrom', query.dateFrom)
  if (query.dateTo) params.set('dateTo', query.dateTo)
  if (query.bbox) params.set('bbox', query.bbox)
  params.set('limit', String(query.limit ?? 500))
  params.set('offset', String(query.offset ?? 0))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const mapApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMapMarkers: build.query<MapMarkersResponse, MapMarkersQuery | void>({
      query: (query) => `/api/v1/auditor/map/markers${buildMarkersParams(query || {})}`,
      providesTags: ['MapMarkers'],
    }),
    getMapFilters: build.query<MapFiltersResponse, void>({
      query: () => '/api/v1/auditor/map/filters',
      providesTags: ['MapFilters'],
    }),
    createCheckClaim: build.mutation<CheckClaimResponse, CreateCheckClaimBody>({
      query: (body) => ({
        url: '/api/v1/auditor/map/claims',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MapMarkers', 'MapFilters', 'Assignments'],
    }),
    cancelCheckClaim: build.mutation<CheckClaimResponse, string>({
      query: (claimId) => ({
        url: `/api/v1/auditor/map/claims/${claimId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MapMarkers', 'MapFilters', 'Assignments'],
    }),
  }),
})

export const {
  useGetMapMarkersQuery,
  useLazyGetMapMarkersQuery,
  useGetMapFiltersQuery,
  useCreateCheckClaimMutation,
  useCancelCheckClaimMutation,
} = mapApi

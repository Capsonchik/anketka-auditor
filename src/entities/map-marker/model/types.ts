export type MapStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'free'

export type MapMarker = {
  markerId: string
  checkId: string
  checkPublicId: number
  checkName: string
  projectId: string
  projectName: string
  shopPointId: string | null
  lat: number | null
  lng: number | null
  hasCoordinates: boolean
  mapStatus: MapStatus
  mapStatusLabel: string
  isMasked: boolean
  address: string | null
  city: string | null
  clientName: string | null
  surveyId: string | null
  surveyTitle: string | null
  surveyCategory: string | null
  payment: number | null
  dueDate: string | null
  assignmentStatus: string | null
  myClaimPending: boolean
  myClaimId: string | null
  claimsCount: number
  inviteToken: string | null
}

export type MapMarkersResponse = {
  items: MapMarker[]
  total: number
}

export type MapFilterOption = {
  id: string
  name: string
}

export type MapSurveyFilterOption = {
  id: string
  title: string
  projectId: string
}

export type MapStatusOption = {
  value: MapStatus
  label: string
}

export type MapFiltersResponse = {
  projects: MapFilterOption[]
  surveys: MapSurveyFilterOption[]
  statuses: MapStatusOption[]
}

export type MapMarkersQuery = {
  projectIds?: string[]
  status?: MapStatus[]
  search?: string
  dateFrom?: string
  dateTo?: string
  surveyIds?: string[]
  bbox?: string
  limit?: number
  offset?: number
}

export type CreateCheckClaimBody = {
  projectId: string
  checkId: string
}

export type CheckClaimResponse = {
  claimId: string
  status: string
  projectId: string
  checkId: string
}

export const MAP_STATUS_LABELS: Record<MapStatus, string> = {
  assigned: 'Назначено',
  in_progress: 'В работе',
  completed: 'Выполнено',
  overdue: 'Просрочено',
  free: 'Свободное',
}

export const emptyMapMarkersQuery: MapMarkersQuery = {
  search: '',
  status: undefined,
  projectIds: undefined,
}

export interface AuditorRatingStats {
  auditorId: string;
  publicId: number;
  lastName: string;
  firstName: string;
  middleName: string;
  evaluationsCount: number;
  avgScoreTotal: number;
  avgRatingOutOf5: number;
}

export interface GetAuditorRatingStatsParams {
  q?: string | null;
  limit?: number;
  offset?: number;
  companyId?: string | null;
}

export interface GetAuditorRatingStatsResponse {
  items: AuditorRatingStats[];
  total: number;
  limit: number;
  offset: number;
}

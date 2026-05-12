export interface AuditorRatingStats {
  auditorId: string;
  publicId: number;
  lastName: string;
  firstName: string;
  middleName: string | null;
  evaluationsCount: number;
  avgScoreTotal: number;
  avgRatingOutOf5: number;
  /** Есть в ответе GET `/auditors/{id}/rating-stats` и при расширении списка */
  activeChecksCount?: number;
  overdueChecksCount?: number;
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

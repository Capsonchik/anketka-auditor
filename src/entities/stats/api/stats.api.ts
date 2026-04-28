import { api } from '@shared/api/api';
import { 
  GetAuditorRatingStatsResponse, 
  GetAuditorRatingStatsParams 
} from '../model/types';

export const statsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAuditorRatingStats: build.query<GetAuditorRatingStatsResponse, GetAuditorRatingStatsParams>({
      query: ({ q, limit = 200, offset = 0, companyId }) => ({
        url: '/api/v1/ratings/auditors/rating-stats',
        params: { q, limit, offset },
        headers: companyId ? { 'X-Company-Id': companyId } : {},
      }),
    }),
  }),
});

export const { 
  useGetAuditorRatingStatsQuery 
} = statsApi;

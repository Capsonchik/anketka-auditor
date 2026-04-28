import { api } from '@shared/api/api';
import { 
  LogoutRequest,
} from '../model/types';

export const logoutApi = api.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, LogoutRequest>({
      query: (body) => ({
        url: '/api/v1/auditor-auth/logout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useLogoutMutation, 
} = logoutApi;

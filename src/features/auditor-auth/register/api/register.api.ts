import { api } from '@shared/api/api';
import { 
  AuditorRegisterRequest,
  AuditorAuthResponse
} from '../model/types';

export const registerApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<AuditorAuthResponse, AuditorRegisterRequest>({
      query: (body) => ({
        url: '/api/v1/auditor-auth/register',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useRegisterMutation,
} = registerApi;

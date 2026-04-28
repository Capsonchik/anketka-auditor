import { api } from '@shared/api/api';
import { 
  LoginRequest, 
  LoginResponse,
} from '../model/types';

export const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/api/v1/auditor-auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
} = loginApi;

import { Auditor } from '@entities/auditor/model/types';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  auditor: Auditor;
  tokens: Tokens;
}

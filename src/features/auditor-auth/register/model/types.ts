import { Auditor } from '@entities/auditor/model/types';

export type AuditorGender = 'male' | 'female';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface AuditorRegisterRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  phone?: string;
  city: string;
  birthDate: string; // ISO date
  gender: AuditorGender;
  age?: number;
  visitLocations?: string[]
  education?: string;
  companyActivity?: string;
  experienceInfo?: string;
  hasDriverLicense?: boolean;
  driverCategories?: string;
  hasCar?: boolean;
  carInfo?: string;
  jobSearchType?: string;
  snils?: string;
  passportData?: string;
  accountId?: string;
}

export interface AuditorAuthResponse {
  auditor: Auditor;
  tokens: Tokens;
}

export interface Auditor {
  id: string;
  publicId: number;
  companyId: string | null;
  accountId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string | null;
  email: string | null;
  city: string;
  birthDate?: string | null;  // ISO date string
  gender?: string | null;
  age?: number | null;
  visitLocations?: string | null;
  education?: string | null;
  companyActivity?: string | null;
  experienceInfo?: string | null;
  hasDriverLicense?: boolean | null;
  driverCategories?: string | null;
  hasCar?: boolean | null;
  carInfo?: string | null;
  jobSearchType?: string | null;
  snils?: string | null;
  passportData?: string | null;
  isModerated: boolean;
  createdAt: string;  // ISO datetime string
}

export interface MeResponse {
  auditor: Auditor;
}

/** PATCH /api/v1/auditor/update — только переданные поля (camelCase, как в Pydantic). */
export type AuditorUpdateRequest = Partial<
  Pick<
    Auditor,
    | 'firstName'
    | 'lastName'
    | 'middleName'
    | 'phone'
    | 'city'
    | 'birthDate'
    | 'gender'
    | 'age'
    | 'visitLocations'
    | 'education'
    | 'companyActivity'
    | 'experienceInfo'
    | 'hasDriverLicense'
    | 'driverCategories'
    | 'hasCar'
    | 'carInfo'
    | 'jobSearchType'
    | 'snils'
    | 'passportData'
  >
>;

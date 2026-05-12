import type { AuditorUpdateRequest } from '@/entities/auditor/model/types';
import type { PersonalFormValues } from '../model/types';

export function mapPersonalProfileUpdate(data: PersonalFormValues): AuditorUpdateRequest {
  return {
    lastName: data.lastName,
    firstName: data.firstName,
    middleName: data.middleName || undefined,
    birthDate: data.birthDate,
    gender: data.gender,
    city: data.city,
  };
}

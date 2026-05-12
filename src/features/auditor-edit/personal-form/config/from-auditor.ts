import type { Auditor } from '@/entities/auditor/model/types';
import type { PersonalFormValues } from '../model/types';
import { emptyPersonalFormValues } from './defaults';

export function personalFormValuesFromAuditor(auditor: Auditor | null): PersonalFormValues {
  if (!auditor) return { ...emptyPersonalFormValues };

  const gender =
    auditor.gender === 'female' || auditor.gender === 'male'
      ? auditor.gender
      : 'male';

  return {
    lastName: auditor.lastName ?? '',
    firstName: auditor.firstName ?? '',
    middleName: auditor.middleName ?? '',
    birthDate: auditor.birthDate ?? '',
    gender,
    city: auditor.city ?? '',
  };
}

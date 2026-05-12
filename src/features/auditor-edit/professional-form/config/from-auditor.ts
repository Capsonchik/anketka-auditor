import type { Auditor } from '@/entities/auditor/model/types';
import type { ProfessionalFormValues } from '../model/types';
import { emptyProfessionalFormValues } from './defaults';

export function professionalFormValuesFromAuditor(auditor: Auditor | null): ProfessionalFormValues {
  if (!auditor) return { ...emptyProfessionalFormValues };

  return {
    education: auditor.education ?? '',
    companyActivity: auditor.companyActivity ?? '',
    jobSearchType: auditor.jobSearchType ?? '',
    experienceInfo: auditor.experienceInfo ?? '',
    hasDriverLicense: Boolean(auditor.hasDriverLicense),
    driverCategories: auditor.driverCategories ?? '',
    hasCar: Boolean(auditor.hasCar),
    carInfo: auditor.carInfo ?? '',
    snils: auditor.snils ?? '',
    passportData: auditor.passportData ?? '',
  };
}

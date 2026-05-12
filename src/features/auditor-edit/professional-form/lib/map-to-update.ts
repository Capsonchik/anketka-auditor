import type { AuditorUpdateRequest } from '@/entities/auditor/model/types';
import type { ProfessionalFormValues } from '../model/types';

export function mapProfessionalProfileUpdate(data: ProfessionalFormValues): AuditorUpdateRequest {
  return {
    education: data.education || undefined,
    companyActivity: data.companyActivity || undefined,
    jobSearchType: data.jobSearchType || undefined,
    experienceInfo: data.experienceInfo || undefined,
    hasDriverLicense: data.hasDriverLicense,
    driverCategories: data.driverCategories || undefined,
    hasCar: data.hasCar,
    carInfo: data.carInfo || undefined,
    snils: data.snils || undefined,
    passportData: data.passportData || undefined,
  };
}

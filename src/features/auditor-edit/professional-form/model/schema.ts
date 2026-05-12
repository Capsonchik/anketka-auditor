import * as yup from 'yup';
import type { ProfessionalFormValues } from './types';

export const professionalProfileFormSchema = yup.object({
  education: yup.string().max(500).default(''),
  companyActivity: yup.string().max(500).default(''),
  jobSearchType: yup.string().max(200).default(''),
  experienceInfo: yup.string().max(5000).default(''),
  hasDriverLicense: yup.boolean().default(false),
  driverCategories: yup.string().max(100).default(''),
  hasCar: yup.boolean().default(false),
  carInfo: yup.string().max(500).default(''),
  snils: yup.string().max(50).default(''),
  passportData: yup.string().max(200).default(''),
}) as yup.ObjectSchema<ProfessionalFormValues>;

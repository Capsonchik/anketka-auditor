/** Значения формы проф. данных и документов (редактирование профиля, PATCH update). */
export interface ProfessionalFormValues {
  education: string;
  companyActivity: string;
  jobSearchType: string;
  experienceInfo: string;
  hasDriverLicense: boolean;
  driverCategories: string;
  hasCar: boolean;
  carInfo: string;
  snils: string;
  passportData: string;
}

export interface ProfessionalFormProps {
  defaultValues: ProfessionalFormValues;
}

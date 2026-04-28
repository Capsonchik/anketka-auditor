import * as yup from 'yup';
import { AuditorRegisterRequest } from './types';
import { nameSchemas } from '@/shared/lib';

export const registerSchema = yup.object({
  email: yup.string().email('Неверный формат email').required('Введите email'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Введите пароль'),
  
  lastName: nameSchemas.lastName(),
  firstName: nameSchemas.firstName(),
  middleName: nameSchemas.middleName(),
  
  phone: yup.string().default(undefined),
  city: yup.string().required('Введите город'),
  birthDate: yup.string().required('Введите дату рождения'),
  
  gender: yup
    .string()
    .oneOf(['male', 'female'] as const, 'Выберите пол')
    .required('Выберите пол'),
  
  age: yup
    .number()
    .typeError('Введите число')
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .nullable()
    .optional()
    .positive('Возраст не может быть отрицательным')
    .max(120, 'Возраст не может быть более 120 лет'),
  
  visitLocations: yup.array().of(yup.string()).optional(),
  education: yup.string().default(undefined),
  companyActivity: yup.string().default(undefined),
  experienceInfo: yup.string().default(undefined),
  hasDriverLicense: yup.boolean().default(undefined),
  driverCategories: yup.string().default(undefined),
  hasCar: yup.boolean().default(undefined),
  carInfo: yup.string().default(undefined),
  jobSearchType: yup.string().default(undefined),
  snils: yup.string().default(undefined),
  passportData: yup.string().default(undefined),
  accountId: yup.string().default(undefined),
}) as yup.ObjectSchema<AuditorRegisterRequest>;
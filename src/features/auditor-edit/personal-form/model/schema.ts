import * as yup from 'yup';
import { nameSchemas } from '@/shared/lib';
import type { PersonalFormValues } from './types';

export const personalProfileFormSchema = yup.object({
  lastName: nameSchemas.lastName(),
  firstName: nameSchemas.firstName(),
  middleName: nameSchemas.middleName(),
  birthDate: yup.string().required('Введите дату рождения'),
  gender: yup
    .string()
    .oneOf(['male', 'female'] as const, 'Выберите пол')
    .required('Выберите пол'),
  city: yup.string().required('Введите город'),
}) as yup.ObjectSchema<PersonalFormValues>;

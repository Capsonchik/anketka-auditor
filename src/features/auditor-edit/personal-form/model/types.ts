export type PersonalProfileGender = 'male' | 'female';

/** Значения формы личных данных (редактирование профиля, PATCH update). */
export interface PersonalFormValues {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: PersonalProfileGender;
  city: string;
}

export interface PersonalFormProps {
  defaultValues: PersonalFormValues;
  /** Подпись в аватаре (например инициалы с сервера). */
  avatarLabel?: string;
}

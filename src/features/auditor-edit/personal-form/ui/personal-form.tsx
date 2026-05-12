'use client';

import React from 'react';
import { Controller, FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, FormField } from '@/shared/ui';
import { SelectPicker } from '@/shared/ui/picker';
import { genderOptions } from '@/features/auditor-auth/register/config';
import type { PersonalFormProps, PersonalFormValues } from '../model';
import { personalProfileFormSchema } from '../model/schema';
import { useSubmitPersonalProfile } from '../hooks/use-submit-personal-profile';
import styles from './personal-form.module.scss';

export const PersonalForm: React.FC<PersonalFormProps> = ({ defaultValues, avatarLabel }) => {
  const { submit, isLoading } = useSubmitPersonalProfile();

  const methods = useForm<PersonalFormValues>({
    resolver: yupResolver(personalProfileFormSchema),
    mode: 'onChange',
    defaultValues,
  });

  const { register, control, handleSubmit } = methods;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: PersonalFormValues) => {
    try {
      await submit(data);
    } catch (e) {
      console.error('Не удалось сохранить личные данные', e);
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formContent}>
          <div className={styles.profileLayout}>
            <div className={styles.leftCol}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>{avatarLabel ?? 'АУ'}</div>
              </div>
              <div className={styles.roleBadge}>Аудитор</div>
            </div>
            <div className={styles.rightCol}>
              <div className={styles.fieldsGrid}>
                <FormField label="Фамилия" required>
                  <Input
                    {...register('lastName')}
                    placeholder="Иванов"
                    disabled={isLoading}
                    error={errors.lastName?.message}
                  />
                </FormField>
                <FormField label="Имя" required>
                  <Input
                    {...register('firstName')}
                    placeholder="Иван"
                    disabled={isLoading}
                    error={errors.firstName?.message}
                  />
                </FormField>
                <FormField label="Отчество">
                  <Input
                    {...register('middleName')}
                    placeholder="Иванович"
                    disabled={isLoading}
                    error={errors.middleName?.message}
                  />
                </FormField>
                <FormField label="Дата рождения" required>
                  <Input
                    {...register('birthDate')}
                    type="date"
                    disabled={isLoading}
                    error={errors.birthDate?.message}
                  />
                </FormField>
                <FormField label="Пол" required>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <SelectPicker
                        data={genderOptions}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        error={errors.gender?.message}
                        block
                      />
                    )}
                  />
                </FormField>
                <FormField label="Город проживания" required>
                  <Input
                    {...register('city')}
                    placeholder="Москва"
                    disabled={isLoading}
                    error={errors.city?.message}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

'use client';

import React from 'react';
import { useFormContext, Controller, useFormState } from 'react-hook-form';
import { Input, FormField } from '@/shared/ui';
import { SelectPicker } from '@/shared/ui/picker';
import { AuditorRegisterRequest } from '../../../../model/types';
import { genderOptions, cityOptions } from '../../../../config';
import styles from './personal-data.module.scss';
import { useAutoClearErrors } from '@/shared/hooks';

interface PersonalDataProps {
  isLoading?: boolean;
}

export const PersonalData: React.FC<PersonalDataProps> = ({ isLoading }) => {
  const { register, control ,clearErrors} = useFormContext<AuditorRegisterRequest>();
  const { errors } = useFormState({ control });
  // Просто вызываем хук с ошибками
  useAutoClearErrors(clearErrors, errors, {
    delay: 5000,
    enabled: true,
  });

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Личные данные</h3>
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
        <FormField label="Возраст">
          <Input
            {...register('age')}
            type="number"
            placeholder="25"
            disabled={isLoading}
            error={errors.age?.message}
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
        <FormField label="Регионы для визитов">
          <Controller
            name="visitLocations"
            control={control}
            render={({ field }) => (
              <SelectPicker
                data={cityOptions}
                value={field.value as unknown as string}
                onChange={field.onChange}
                disabled={isLoading}
                placeholder="Выберите города"
                block
              />
            )}
          />
        </FormField>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useFormContext, Controller, useFormState } from 'react-hook-form';
import { Input, FormField, Textarea } from '@/shared/ui';
import { SelectPicker } from '@/shared/ui/picker';
import { AuditorRegisterRequest } from '../../../../model/types';
import { educationOptions, jobSearchOptions } from '../../../../config';
import styles from './professional-data.module.scss';

interface ProfessionalDataProps {
  isLoading?: boolean;
}

export const ProfessionalData: React.FC<ProfessionalDataProps> = ({ isLoading }) => {
  const { register, control } = useFormContext<AuditorRegisterRequest>();
  const { errors } = useFormState({ control });

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Профессиональные данные</h3>
      <div className={styles.fieldsGrid}>
        <FormField label="Образование">
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <SelectPicker
                data={educationOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                placeholder="Выберите образование"
                error={errors.education?.message}
                block
              />
            )}
          />
        </FormField>
        <FormField label="Сфера деятельности компании">
          <Input
            {...register('companyActivity')}
            placeholder="IT, Ритейл и т.д."
            disabled={isLoading}
            error={errors.companyActivity?.message}
          />
        </FormField>
        <FormField label="Тип поиска работы">
          <Controller
            name="jobSearchType"
            control={control}
            render={({ field }) => (
              <SelectPicker
                data={jobSearchOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                placeholder="Выберите тип"
                error={errors.jobSearchType?.message}
                block
              />
            )}
          />
        </FormField>
      </div>
      <FormField label="Опыт работы">
        <Textarea
          className={styles.textarea}
          {...register('experienceInfo')}
          placeholder="Опишите ваш опыт работы тайным покупателем"
          disabled={isLoading}
          error={errors.experienceInfo?.message}
          // as='textarea'
        />
      </FormField>
    </div>
  );
};

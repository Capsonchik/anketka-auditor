'use client';

import React from 'react';
import { useFormContext, Controller, useFormState } from 'react-hook-form';
import { Input, FormField } from '@/shared/ui';
import { SelectPicker } from '@/shared/ui/picker';
import { AuditorRegisterRequest } from '../../../../model/types';
import { booleanOptions } from '../../../../config';
import styles from './car-and-documents.module.scss';

interface CarAndDocumentsProps {
  isLoading?: boolean;
}

export const CarAndDocuments: React.FC<CarAndDocumentsProps> = ({ isLoading }) => {
  const { register, control, watch } = useFormContext<AuditorRegisterRequest>();
  const { errors } = useFormState({ control });

  const hasCar = watch('hasCar');
  const hasDriverLicense = watch('hasDriverLicense');

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Автомобиль и документы</h3>
      <div className={styles.fieldsGrid}>
        <FormField label="Водительское удостоверение">
          <Controller
            name="hasDriverLicense"
            control={control}
            render={({ field }) => (
              <SelectPicker
                data={booleanOptions}
                value={field.value ? 1 : 0}
                onChange={(val) => field.onChange(val === 1)}
                disabled={isLoading}
                error={errors.hasDriverLicense?.message}
                block
                placeholder='Выберите значение'
              />
            )}
          />
        </FormField>
        {hasDriverLicense && (
          <FormField label="Категории">
            <Input
              {...register('driverCategories')}
              placeholder="B, C"
              disabled={isLoading}
              error={errors.driverCategories?.message}
            />
          </FormField>
        )}
        <FormField label="Наличие автомобиля">
          <Controller
            name="hasCar"
            control={control}
            render={({ field }) => (
              <SelectPicker
                data={booleanOptions}
                value={field.value ? 1 : 0}
                onChange={(val) => field.onChange(val === 1)}
                disabled={isLoading}
                error={errors.hasCar?.message}
                block
                placeholder='Выберите значение'
              />
            )}
          />
        </FormField>
        {hasCar && (
          <FormField label="Информация об авто">
            <Input
              {...register('carInfo')}
              placeholder="Марка, модель"
              disabled={isLoading}
              error={errors.carInfo?.message}
            />
          </FormField>
        )}
        <FormField label="СНИЛС">
          <Input
            {...register('snils')}
            placeholder="000-000-000 00"
            disabled={isLoading}
            error={errors.snils?.message}
          />
        </FormField>
        <FormField label="Паспортные данные">
          <Input
            {...register('passportData')}
            placeholder="Серия, номер"
            disabled={isLoading}
            error={errors.passportData?.message}
          />
        </FormField>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Controller, FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, FormField, Textarea } from '@/shared/ui';
import { SelectPicker } from '@/shared/ui/picker';
import { educationOptions, jobSearchOptions, booleanOptions } from '@/features/auditor-auth/register/config';
import type { ProfessionalFormProps, ProfessionalFormValues } from '../model';
import { professionalProfileFormSchema } from '../model/schema';
import { useSubmitProfessionalProfile } from '../hooks/use-submit-professional-profile';
import styles from './professional-form.module.scss';

export const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ defaultValues }) => {
  const { submit, isLoading } = useSubmitProfessionalProfile();

  const methods = useForm<ProfessionalFormValues>({
    resolver: yupResolver(professionalProfileFormSchema),
    mode: 'onChange',
    defaultValues,
  });

  const { register, control, handleSubmit, watch } = methods;
  const { errors } = useFormState({ control });

  const hasCar = watch('hasCar');
  const hasDriverLicense = watch('hasDriverLicense');

  const onSubmit = async (data: ProfessionalFormValues) => {
    try {
      await submit(data);
    } catch (e) {
      console.error('Не удалось сохранить профессиональные данные', e);
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Образование и опыт</h3>
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
                {...register('experienceInfo')}
                placeholder="Опишите ваш опыт работы тайным покупателем"
                disabled={isLoading}
                error={errors.experienceInfo?.message}
              />
            </FormField>
          </div>

          <div className={styles.section} style={{ marginTop: '32px' }}>
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
                      placeholder="Выберите значение"
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
                      placeholder="Выберите значение"
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
        </div>
      </form>
    </FormProvider>
  );
};

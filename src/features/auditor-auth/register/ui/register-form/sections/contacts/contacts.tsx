'use client';

import React, { useState } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Input, FormField } from '@/shared/ui';
import { EyeIcon } from '@/shared/icons';
import { AuditorRegisterRequest } from '../../../../model/types';
import styles from './contacts.module.scss';
import { useAutoClearErrors } from '@/shared/hooks';

interface ContactsProps {
  isLoading?: boolean;
}

export const Contacts: React.FC<ContactsProps> = ({ isLoading }) => {
  const { register, control,clearErrors } = useFormContext<AuditorRegisterRequest>();
  const { errors } = useFormState({ control });
  const [showPassword, setShowPassword] = useState(false);

    useAutoClearErrors(clearErrors, errors, {
      delay: 5000,
      enabled: true,
    });

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Контакты и доступ</h3>
      <div className={styles.fieldsGrid}>
        <FormField label="Email" required>
          <Input
            {...register('email')}
            placeholder="user@example.com"
            disabled={isLoading}
            error={errors.email?.message}
          />
        </FormField>
        <FormField label="Пароль" required>
          <div className={styles.passwordField}>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.password?.message}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              <EyeIcon isOpen={showPassword} />
            </button>
          </div>
        </FormField>
        <FormField label="Телефон">
          <Input
            {...register('phone')}
            placeholder="+7 (999) 000-00-00"
            disabled={isLoading}
            error={errors.phone?.message}
          />
        </FormField>
      </div>
    </div>
  );
};

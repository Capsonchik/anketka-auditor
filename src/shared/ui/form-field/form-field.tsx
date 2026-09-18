'use client';

import React from 'react';
import { clsx } from '@shared/lib/clsx';
import styles from './form-field.module.scss';

export interface FormFieldProps {
  label?: React.ReactNode;
  required?: boolean;
  error?: string | boolean;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  hint,
  className,
  children,
  id,
}) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.control}>
        {children}
      </div>
      {typeof error === 'string' && error ? <p className={styles.error}>{error}</p> : null}
      {hint && !error ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
};

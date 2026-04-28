'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';
import styles from '../recovery.module.scss';
import authStyles from '../../auth-layout.module.scss';
import clsx from 'clsx';

export default function RegistrationSuccessPage() {
  return (
    <div className={clsx(authStyles.card, styles.recovery)}>
      <div className={styles.successIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h1 className={styles.title}>Регистрация успешна!</h1>
      <p className={styles.subtitle}>
        Вы успешно зарегистрировались в системе. Теперь вы можете войти в свой аккаунт.
      </p>

      <Link href="/login" style={{ width: '100%' }}>
        <Button variant="primary" style={{ width: '100%', height: '52px', fontWeight: 800 }}>
          Войти в аккаунт
        </Button>
      </Link>
    </div>
  );
}
'use client';

import { Suspense } from 'react';
import { LoginForm } from '@features/auth/login-form';
import styles from './login.module.scss';

/**
 * Страница входа (Public)
 * Обернута в Suspense для корректной работы useSearchParams внутри LoginForm
 */
export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Suspense fallback={
        <div className={styles.loaderContainer}>Загрузка...</div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

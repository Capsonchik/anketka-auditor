'use client';

import { Suspense } from 'react';
import { SendCodeForm } from '@features/auth/send-code-form';
import styles from '../login.module.scss';

/**
 * Страница подтверждения кода (Public)
 * Обернута в Suspense для корректной работы useSearchParams внутри SendCodeForm
 */
export default function SendCodePage() {
  return (
    <div className={styles.loginPage}>
      <Suspense fallback={
        <div className={styles.loaderContainer}>Загрузка...</div>
      }>
        <SendCodeForm />
      </Suspense>
    </div>
  );
}

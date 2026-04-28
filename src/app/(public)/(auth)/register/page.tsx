'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/features/auditor-auth';
import { PillSwitchFlexible } from '@/shared/ui';
import { UserIcon, DemographyIcon, AuditorIcon, ControllerIcon } from '@/shared/icons';
import { clsx } from '@/shared/lib/clsx';
import styles from './register.module.scss';
import authStyles from '../auth-layout.module.scss';
import { useRoleParam } from '../use-role-param';

function RegisterContent() {
  
  const { role, handleRoleChange } = useRoleParam('auditor');

  return (
    <div className={clsx(authStyles.card, styles.register)}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Регистрация</h1>
          <p className={styles.subtitle}>
            Заполните анкету, чтобы стать аудитором и получать задания
          </p>
        </div>

        <PillSwitchFlexible
          className={styles.roleSwitch}
          size="large"
          value={role}
          onChange={handleRoleChange}
          data={[
            {
              label: 'Аудитор',
              value: 'auditor',
              icon: <AuditorIcon width={18} height={18} />,
            },
            {
              label: 'Контролер',
              value: 'controler',
              icon: <ControllerIcon width={18} height={18} />,
            },
          ]}
        />
      </div>

      {role === 'auditor' ? (
        <RegisterForm />
      ) : (
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className={styles.comingSoonTitle}>Доступ для контроллеров</h2>
          <p className={styles.comingSoonText}>
            Мы работаем над личным кабинетом контроллера. Совсем скоро здесь появится возможность зарегистрироваться.
          </p>
        </div>
      )}

      <div className={styles.footer}>
        <p className={styles.loginText}>
          Уже есть аккаунт?{' '}
          <Link href={`/login?role=${role}`} className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

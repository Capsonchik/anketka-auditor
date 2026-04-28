'use client'

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, PillSwitchFlexible } from '@/shared/ui';
import { EyeIcon, UserIcon, DemographyIcon, AuditorIcon, ControllerIcon } from '@/shared/icons';
import { LoginForm as AuditorLoginForm } from '@/features/auditor-auth';
import styles from './login.module.scss';
import authStyles from '../auth-layout.module.scss';
import clsx from 'clsx';
import { useRoleParam } from '../use-role-param';

function LoginContent() {
  const { role, handleRoleChange } = useRoleParam('auditor');

  return (
    <div className={clsx(authStyles.card, styles.login)}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Вход</h1>
          <p className={styles.subtitle}>Используйте логин или email и пароль</p>
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
        <AuditorLoginForm />
      ) : (
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h2 className={styles.comingSoonTitle}>Доступ для контроллеров</h2>
          <p className={styles.comingSoonText}>
            Мы работаем над личным кабинетом контроллера. Совсем скоро здесь появится возможность авторизоваться.
          </p>
        </div>
      )}

      {role === 'auditor' && (
        <div className={styles.footer}>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Забыли пароль?
          </Link>
          <div className={styles.registerPrompt}>
            Нет аккаунта?{' '}
            <Link href={`/register?role=${role}`} className={styles.registerLink}>
              Зарегистрироваться
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginContent />
    </Suspense>
  );
}

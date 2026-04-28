'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/shared/ui';
import { clsx } from '@/shared/lib/clsx';
import styles from './recovery.module.scss';
import authStyles from '../auth-layout.module.scss';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Имитация отправки и переход на страницу успеха
    router.push('/forgot-password/success');
  };

  return (
    <div className={clsx(authStyles.card, styles.recovery)}>
      <h1 className={styles.title}>Восстановление пароля</h1>
      <p className={styles.subtitle}>Введите ваш email, мы отправим инструкции по сбросу пароля</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <Input
            
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="primary" className={styles.submitBtn}>
          Отправить инструкции
        </Button>
      </form>

      <div className={styles.backToLogin}>
        <Link href="/login" className={styles.link}>
          Вернуться ко входу
        </Link>
      </div>
    </div>
  );
}

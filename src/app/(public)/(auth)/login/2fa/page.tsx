'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui';
import { clsx } from '@/shared/lib/clsx';
import styles from './2fa.module.scss';
import authStyles from '../../auth-layout.module.scss';

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'Enter' && !code.some(d => !d)) {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    const enteredCode = code.join('');
    if (enteredCode === '123456') {
      const role = searchParams.get('role');
      if (role === 'auditor') {
        router.push('/auditor');
      } else {
        router.push('/');
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className={clsx(authStyles.card, styles.twofa)}>
      <h1 className={styles.title}>Введите полученный код</h1>
      <p className={styles.subtitle}>Код подтверждения отправлен на вашу почту(123456)</p>

      <div className={styles.codeInputs}>
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            className={styles.codeInput}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            // placeholder="○"
          />
        ))}
      </div>

      {error && (
        <div className={styles.error}>
          Неверный код. Попробуйте 123456
        </div>
      )}

      <div className={styles.actions}>
        <Button
          variant="default"
          appearance="ghost"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          Назад
        </Button>
        <Button
          variant="primary"
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={code.some(d => !d)}
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
}

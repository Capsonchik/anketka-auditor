'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@/shared/ui';
import { EyeIcon } from '@/shared/icons';
import { useLoginMutation } from '../../api/login.api';
import { LoginRequest } from '../../model/types';
import { loginSchema } from '../../model/schema';
import { handleFormErrors } from '@/shared/lib/handle-form-errors';
import styles from './login-form.module.scss';
import { tokenService } from '@/shared/lib/auth/token-service';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();

    const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login(data).unwrap();
      
      // Сохраняем токены
      if (response.tokens) {
        // 1. Сохраняем в localStorage для клиентской части
        tokenService.setTokens(response.tokens);
        
        // 2. Устанавливаем HttpOnly куки через API Route
        await fetch('/api/auth/set-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokens: response.tokens }),
        });
      }
      
      const role = searchParams.get('role');
      const nextUrl = role ? `/login/2fa?role=${role}` : '/login/2fa';
      router.push(nextUrl);
    } catch (err) {
      handleFormErrors(err, setError);
    }
  };

  return (
    <>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Логин или email</label>
          <Input
            {...register('email')}
            placeholder="admin или user@example.com"
            disabled={isLoading}
            error={errors.email?.message}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <div className={styles.passwordWrapper}>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.password?.message}
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              disabled={isLoading}
            >
              <EyeIcon isOpen={showPassword} />
            </button>
          </div>
        </div>
      </div>

      {errors.root && (
        <div className={styles.error}>
          {errors.root.message}
        </div>
      )}

      <Button 
        onClick={handleSubmit(onSubmit)}
        variant="primary" 
        className={styles.submitBtn}
        loading={isLoading}
      >
        Войти
      </Button>
    </>
  );
};

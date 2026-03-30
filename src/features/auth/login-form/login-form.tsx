import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation, useSendCodeMutation } from '@entities/auth/api';
import { Button, Input } from '@shared/ui';
import { handleFormErrors } from '@shared/lib';
import styles from './login-form.module.scss';

export const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const loginSchema = yup.object({
    username: yup.string().required(t('Пожалуйста, введите email или телефон')),
    password: yup.string().required(t('Пожалуйста, введите пароль')).min(6, t('Пароль должен быть не менее 6 символов')),
  }).required();

  type LoginFormValues = yup.InferType<typeof loginSchema>;
  
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/lk';

  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [sendCode, { isLoading: isSendCodeLoading }] = useSendCodeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const isLoading = isLoginLoading || isSendCodeLoading;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();

      if (result.tfa_session) {
        await sendCode({ session_id: result.tfa_session }).unwrap();

        const params = new URLSearchParams();
        params.set('session_id', result.tfa_session);
        params.set('from', from);
        
        router.push(`/login/send-code?${params.toString()}`);
      }
    } catch (err: any) {
      handleFormErrors(err, setError, {
        username: 'username',
        password: 'password',
      });
    }
  };

  return (
    <div className={styles.loginForm}>
      <h1>{t('Вход в систему')}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          {...register('username')}
          label={t('Email или телефон')}
          placeholder="name@example.com"
          error={errors.username?.message}
          autoHideError
          onClearError={() => {
            clearErrors('username');
            clearErrors('root');
          }}
          disabled={isLoading}
          autoComplete="username"
          block
        />

        <Input
          {...register('password')}
          type="password"
          label={t('Пароль')}
          placeholder="••••••••"
          error={errors.password?.message || errors.root?.message}
          autoHideError
          onClearError={() => {
            clearErrors('password');
            clearErrors('root');
          }}
          disabled={isLoading}
          autoComplete="current-password"
          block
        />

        <Button 
          type="submit" 
          // variant="primary"
          loading={isLoading}
          block
        >
          {t('Войти')}
        </Button>
      </form>
    </div>
  );
};

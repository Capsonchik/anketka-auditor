import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyCodeMutation, useSendCodeMutation, setAuthTokensAction } from '@entities/auth/api';
import { Button, Input } from '@shared/ui';
import { handleFormErrors } from '@shared/lib';
import styles from './send-code-form.module.scss';

const COOLDOWN_SECONDS = 60;

const sendCodeSchema = yup.object({
  code: yup.string()
    .required('Пожалуйста, введите код')
    .matches(/^\d{6}$/, 'Код должен состоять из 6 цифр'),
}).required();

type SendCodeFormValues = yup.InferType<typeof sendCodeSchema>;

export const SendCodeForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const from = searchParams.get('from') || '/lk';

  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [sendCode, { isLoading: isSending }] = useSendCodeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<SendCodeFormValues>({
    resolver: yupResolver(sendCodeSchema),
  });

  const codeValue = watch('code');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendCode = useCallback(async () => {
    if (!sessionId || countdown > 0 || isSending) return;

    setSuccessMessage('');

    try {
      await sendCode({ session_id: sessionId }).unwrap();
      setSuccessMessage('Код успешно отправлен повторно');
      setCountdown(COOLDOWN_SECONDS);
    } catch (err: any) {
      handleFormErrors(err, setError);
    }
  }, [sessionId, countdown, isSending, sendCode, setError]);

  const onSubmit = async (data: SendCodeFormValues) => {
    if (!sessionId) return;

    setSuccessMessage('');

    try {
      const result = await verifyCode({ session_id: sessionId, code: data.code }).unwrap();
      await setAuthTokensAction(result.access_token, result.refresh_token);
      router.push(from);
    } catch (err: any) {
      handleFormErrors(err, setError, {
        code: 'code'
      });
    }
  };

  if (!sessionId) {
    return (
      <div className={styles.sendCodeForm}>
        <h1>Ошибка</h1>
        <div className={styles.errorMessage}>
          Сессия не найдена. Пожалуйста, начните вход заново.
        </div>
        <Button 
          type="button" 
          variant="primary"
          onClick={() => router.push('/login')}
          block
        >
          Вернуться ко входу
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.sendCodeForm}>
      <h1>Подтверждение входа</h1>
      <p className={styles.subtitle}>Введите код из SMS, email или Telegram</p>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          {...register('code')}
          label="Код подтверждения"
          placeholder="000000"
          maxLength={6}
          error={errors.code?.message}
          autoHideError
          onClearError={() => setError('code', { message: undefined })}
          disabled={isVerifying}
          autoComplete="one-time-code"
          autoFocus
          block
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
            setValue('code', val, { shouldValidate: true });
            // Ручной сброс ошибки при вводе (хотя Input теперь это делает визуально, 
            // для RHF лучше вызвать clearErrors или setError с undefined)
            if (errors.code) {
              setError('code', { message: undefined });
            }
          }}
        />

        {successMessage && (
          <div className={styles.successMessage} role="status">
            {successMessage}
          </div>
        )}

        <Button 
          type="submit" 
          variant="primary"
          loading={isVerifying}
          disabled={codeValue?.length < 6}
          block
        >
          Подтвердить
        </Button>

        <div className={styles.formFooter}>
          <Button
            type="button"
            appearance="ghost"
            onClick={handleResendCode}
            disabled={isVerifying || isSending || countdown > 0}
            block
          >
            {countdown > 0 
              ? `Отправить повторно через ${countdown}с` 
              : 'Отправить код повторно'}
          </Button>
        </div>
      </form>
    </div>
  );
};

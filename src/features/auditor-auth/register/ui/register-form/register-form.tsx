'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/shared/ui';
import { useRegisterMutation } from '../../api/register.api';
import { AuditorRegisterRequest } from '../../model/types';
import { registerSchema } from '../../model/schema';
import { handleFormErrors } from '@/shared/lib/handle-form-errors';
import { PersonalData } from './sections/personal-data/personal-data';
import { Contacts } from './sections/contacts/contacts';
import { ProfessionalData } from './sections/professional-data/professional-data';
import { CarAndDocuments } from './sections/car-and-documents/car-and-documents';
import styles from './register-form.module.scss';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<AuditorRegisterRequest>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      gender: 'male',
      hasDriverLicense: false,
      hasCar: false,
    },
  });

  const { handleSubmit, setError, control } = methods;
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: AuditorRegisterRequest) => {
    const invite = searchParams.get('invite');
    const finalData = {
      ...data,
      accountId: invite || undefined
    };
    
    try {
      await registerUser(finalData).unwrap();
      router.push('/register/success');
    } catch (err) {
      handleFormErrors(err, setError, undefined, undefined, 'email');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <PersonalData isLoading={isLoading} />
            <Contacts isLoading={isLoading} />
          </div>

          <div className={styles.column}>
            <ProfessionalData isLoading={isLoading} />
            <CarAndDocuments isLoading={isLoading} />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            className={styles.submitBtn}
            loading={isLoading}
            animation='diagonal-close'
          >
            Зарегистрироваться
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

import React from 'react';
import styles from './auth-layout.module.scss';
import { Header } from '@/widgets/public/header';
import { getAuditorFromHeaders } from '@/entities/auditor/lib/get-auditor-from-headers';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const auditorData = await getAuditorFromHeaders({ requireAccessTokenCookie: true });

  return (
    <div className={styles.wrapper}>
      <Header auditor={auditorData} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

import React from 'react';
import styles from './auth-layout.module.scss';
import { Header } from '@/widgets/public/header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

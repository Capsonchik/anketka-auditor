import React from 'react'
import { AuditorHeader } from '@widgets/auditor-header/auditor-header'
import { NavigationBar } from '@widgets/auditor-navigation-bar/navigation-bar'
import { getAuditorFromHeaders } from '@/entities/auditor/lib/get-auditor-from-headers'
import styles from './layout.module.scss'

interface AuditorLayoutProps {
  children: React.ReactNode
}

export default async function AuditorLayout({ children }: AuditorLayoutProps) {
  const auditorData = await getAuditorFromHeaders()

  return (
    <div className={styles.auditorLayout}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <AuditorHeader auditor={auditorData} />
          {children}
        </div>
      </main>
      <NavigationBar />
    </div>
  )
}

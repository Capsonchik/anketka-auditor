import React from 'react'
import { headers } from 'next/headers'
import { decrypt } from '@shared/lib/crypto'
import { AuditorHeader } from '@widgets/auditor-header/auditor-header'
import { NavigationBar } from '@widgets/auditor-navigation-bar/navigation-bar'
import styles from './layout.module.scss'

interface AuditorLayoutProps {
  children: React.ReactNode
}

export default async function AuditorLayout({ children }: AuditorLayoutProps) {
  const headersList = await headers()
  const userDataHeader = headersList.get('x-user-data')
  
  console.log('[AuditorLayout] Raw x-user-data header:', userDataHeader)

  let auditorData = null
  if (userDataHeader) {
    try {
      // Дешифруем данные
      const decryptedData = await decrypt(userDataHeader)
      auditorData = JSON.parse(decryptedData)
      console.log('[AuditorLayout] Parsed auditor data:', auditorData)
    } catch (e) {      console.error('[AuditorLayout] Failed to decrypt or parse x-user-data header', e)
    }
  }

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

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from '@shared/lib/clsx'
import styles from './page.module.scss'
import { LogoutButton } from '@/features/auditor-auth/logout/ui/logout-button'
import { Button } from '@/shared/ui'

const TABS = [
  { id: 'profile', label: 'Профиль', href: '/auditor/profile' },
  { id: 'professional', label: 'Профессиональные данные', href: '/auditor/profile/professional' },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className={styles.profilePage}>
      <div className={styles.tabsHeader}>
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={clsx(styles.tabBtn, { [styles.active]: pathname === tab.href })}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      
      <div className={styles.contentWrapper}>
        {children}
        
        <div className={styles.pageActions}>
          <div className={styles.leftActions}>
            <LogoutButton />
          </div>
          <div className={styles.rightActions}>
            <button type="button" className={styles.cancelBtn}>✕</button>
            <Button type="submit" form="profile-form" className={styles.saveBtn}>✓</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

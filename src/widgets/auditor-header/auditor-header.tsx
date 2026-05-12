'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from '@shared/lib/clsx'
import styles from './auditor-header.module.scss'
import { Auditor } from '@/entities/auditor'

interface AuditorHeaderProps {
  auditor?: Auditor | null
}

export const AuditorHeader = ({ auditor }: AuditorHeaderProps) => {
  const [isOnline, setIsOnline] = useState(false)
  const router = useRouter()

  const handleProfileClick = () => {
    router.push('/auditor/profile')
  }

  const displayName = auditor 
    ? `${auditor.firstName} ${auditor.lastName}`
    : 'Загрузка...'

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Survey-all</div>
      <div className={styles.userInfo}>
        <div className={styles.profileClickArea} onClick={handleProfileClick}>
          {displayName} <span style={{ marginLeft: '10px' }}>⚙️</span>
        </div>        <div className={styles.switchContainer}>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
          <span className={clsx(styles.statusText, { [styles.online]: isOnline })}>
            {isOnline ? 'Онлайн' : 'Оффлайн'}
          </span>
        </div>
      </div>
    </header>
  )
}

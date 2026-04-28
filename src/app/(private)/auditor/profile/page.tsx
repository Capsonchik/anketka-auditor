'use client'

import React, { useState } from 'react'
import { clsx } from '@shared/lib/clsx'
import styles from './page.module.scss'

const TABS = [
  { id: 'profile', label: 'Профиль' },
  { id: 'role', label: 'Роль' },
  { id: 'distribution', label: 'Распределение' },
  { id: 'reports', label: 'Отчёты' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className={styles.tabContent}>
            <div className={styles.profileLayout}>
              <div className={styles.leftCol}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>ДМ</div>
                </div>
                <div className={styles.roleBadge}>Админ</div>
              </div>
              <div className={styles.rightCol}>
                <div className={styles.formGroup}>
                  <label>Имя *</label>
                  <input type="text" defaultValue="Дмитрий" />
                </div>
                <div className={styles.formGroup}>
                  <label>Фамилия *</label>
                  <input type="text" defaultValue="Михеев" />
                </div>
                <div className={styles.formGroup}>
                  <label>Почта *</label>
                  <input type="email" defaultValue="dima@admin.ru" />
                </div>
                <div className={styles.formGroup}>
                  <label>Телефон</label>
                  <input type="text" placeholder="+7..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Компания (профиль)</label>
                  <input type="text" defaultValue="SERVEY-ALL" />
                </div>
                <div className={styles.formGroup}>
                  <label>Роль *</label>
                  <select defaultValue="admin">
                    <option value="admin">Админ</option>
                    <option value="auditor">Аудитор</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.formActions}>
              <button className={styles.cancelBtn}>✕</button>
              <button className={styles.saveBtn}>✓</button>
            </div>
          </div>
        )
      case 'role':
        return <div className={styles.tabPlaceholder}>Настройки ролей и прав доступа</div>
      case 'distribution':
        return <div className={styles.tabPlaceholder}>Распределение задач и территорий</div>
      case 'reports':
        return <div className={styles.tabPlaceholder}>Отчёты и аналитика пользователя</div>
      default:
        return null
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.tabsHeader}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={clsx(styles.tabBtn, { [styles.active]: activeTab === tab.id })}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.contentWrapper}>
        {renderTabContent()}
      </div>
    </div>
  )
}


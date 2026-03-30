'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MENU_CONFIG, MenuItemConfig } from '@/shared/config/menu'
import styles from './mobile-menu.module.scss'

interface MobileMenuProps {
  onClose: () => void
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string[]>([])

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const isChildActive = (item: MenuItemConfig): boolean => {
    if (item.route) {
      const routePath = item.route.split('#')[0]
      if (routePath === pathname) return true
    }
    if (item.items) {
      return item.items.some(child => isChildActive(child))
    }
    return false
  }

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.header}>
        <div className={styles.title}>Меню</div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
      </div>

      <div className={styles.nav}>
        {MENU_CONFIG.map(item => (
          <div key={item.id} className={styles.navItem}>
            {item.items ? (
              <>
                <button
                  className={`${styles.link} ${isChildActive(item) ? styles.active : ''} ${expanded.includes(item.id) ? styles.expanded : ''}`}
                  onClick={() => toggle(item.id)}
                >
                  <div className={styles.linkContent}>
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.arrow} ${expanded.includes(item.id) ? styles.rotated : ''}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`${styles.submenu} ${expanded.includes(item.id) ? styles.open : ''}`}>
                  {item.items.map(subItem => (
                    <div key={subItem.id} className={styles.submenuContent}>
                      {subItem.isGroup && <div className={styles.groupTitle}>{subItem.label}</div>}
                      {subItem.items ? (
                        subItem.items.map(groupItem => (
                          <Link
                            key={groupItem.id}
                            href={groupItem.route || '#'}
                            className={styles.submenuLink}
                            onClick={onClose}
                          >
                            {groupItem.icon && <span className={styles.submenuIcon}>{groupItem.icon}</span>}
                            {groupItem.label}
                          </Link>
                        ))
                      ) : (
                        <Link
                          href={subItem.route || '#'}
                          className={styles.submenuLink}
                          onClick={onClose}
                        >
                          {subItem.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={item.route || '#'}
                className={`${styles.link} ${pathname === item.route ? styles.active : ''}`}
                onClick={onClose}
              >
                <div className={styles.linkContent}>
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

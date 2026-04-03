import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MENU_CONFIG, MenuItemConfig } from '@/shared/config/menu'
import styles from './desktop-menu.module.scss'

export const DesktopMenu = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path.includes('#')) {
      const basePath = path.split('#')[0]
      if (basePath === '/' || basePath === '') {
        return pathname === '/'
      }
      return pathname === basePath
    }

    if (path === '/') {
      return pathname === '/'
    }
    
    return pathname?.startsWith(path)
  }

  const isParentActive = (item: MenuItemConfig): boolean => {
    if (item.route && isActive(item.route)) return true
    if (item.items) {
      return item.items.some((sub: MenuItemConfig) => isParentActive(sub))
    }
    return false
  }

  return (
    <nav className={styles.nav}>
      {MENU_CONFIG.map(item => {
        if (item.hidden) return null
        
        return (
          <div key={item.id} className={styles.dropdownContainer}>
            {item.items ? (
              <>
                <div className={`${styles.link} ${isParentActive(item) ? styles.active : ''}`}>
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowIcon}>
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={`${styles.dropdownMenu} ${styles.megaMenu}`}>
                  <div className={styles.megaMenuColumns}>
                    {item.items.map(subItem => {
                      if (subItem.hidden) return null
                      if (subItem.isGroup) {
                        return (
                          <div key={subItem.id} className={styles.megaMenuColumn}>
                            <div className={styles.columnTitle}>{subItem.label}</div>
                            {subItem.items?.map(linkItem => {
                              if (linkItem.hidden) return null
                              return (
                                <Link 
                                  key={linkItem.id}
                                  href={linkItem.route || '#'}
                                  className={styles.menuItem}
                                >
                                  {linkItem.icon && <span className={styles.menuItemIcon}>{linkItem.icon}</span>}
                                  {linkItem.label}
                                </Link>
                              )
                            })}
                          </div>
                        )
                      }
                      return (
                        <Link 
                          key={subItem.id}
                          href={subItem.route || '#'}
                          className={styles.menuItem}
                        >
                          {subItem.icon && <span className={styles.menuItemIcon}>{subItem.icon}</span>}
                          {subItem.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <Link 
                href={item.route || '#'} 
                className={`${styles.link} ${isActive(item.route || '') ? styles.active : ''}`}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

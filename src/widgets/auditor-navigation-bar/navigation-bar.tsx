'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from '@shared/lib/clsx'
import styles from './navigation-bar.module.scss'
import { ColorPicker } from '@/features/color-picker'
import { ThemeToggle } from '@/features/theme-toggle'

const NAV_ITEMS = [
  { label: 'Главная', href: '/auditor' },
  { label: 'Мои Задания', href: '/auditor/assignments' },
  { label: 'Карта', href: '/auditor/map' },
  { label: 'Поддержка', href: '/auditor/support' },
  { label: 'Инструкции', href: '/auditor/instructions' },
]

export const NavigationBar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const visibleItems = NAV_ITEMS.slice(0, 4)
  const dropdownItems = NAV_ITEMS.slice(4)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <nav className={styles.bottomNav} ref={navRef}>
      <div className={clsx(styles.dropdown, { [styles.dropdownOpen]: isOpen })}>
        <div className={styles.dropdownContent}>
          {dropdownItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(styles.dropdownItem, { [styles.active]: pathname === item.href })}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.dropdownControls}>
            {/* <ColorPicker /> */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={styles.navContainer}>
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(styles.navItem, { [styles.active]: pathname === item.href })}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <button 
            className={clsx(styles.burgerBtn, { [styles.open]: isOpen })} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={styles.rightContainer}>
          {/* <ColorPicker/> */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}




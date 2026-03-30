'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Logo } from '@shared/ui';
import { useTheme } from '@shared/hooks';
import { DesktopMenu } from './ui/desktop-menu/desktop-menu';
import { MobileMenu } from './ui/mobile-menu/mobile-menu';
// import { Drawer } from '@shared/ui/drawer/drawer';
import styles from './header.module.scss';
import { ThemeToggle } from '@/features/theme-toggle';
import { ColorPicker } from '@/features/color-picker';
import { LangSwitcher } from '@/features/lang-switcher/ui/lang-switcher';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on resize > 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo width={160} height={44} />
        </div>
        
        <div className={styles.desktopNav}>
          <DesktopMenu />
        </div>

        <div className={styles.actions}>
          <LangSwitcher />
          <ColorPicker />
          <ThemeToggle />
          <Link href="/login" className={styles.loginBtn}>
            <Button variant="primary" size="md">Личный кабинет</Button>
          </Link>

          <button 
            className={styles.burger} 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* <Drawer 
        open={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        placement="right"
        style={{ '--drawer-width': '80%' } as React.CSSProperties}
      >
        <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
      </Drawer> */}
    </header>
  );
};

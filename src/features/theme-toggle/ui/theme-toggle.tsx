'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@shared/hooks';
import { SunIcon, MoonIcon } from '@shared/icons';
import styles from './theme-toggle.module.scss';

/**
 * Компонент для переключения темы оформления (светлая/темная).
 * 
 * @description
 * Отображает анимированный переключатель с иконками солнца и луны.
 * Использует `useTheme` для управления состоянием темы.
 * 
 * @returns {React.ReactElement} Отрендеренный компонент переключателя темы.
 * 
 * @example
 * <ThemeToggle />
 */
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Рендерим заглушку на сервере, чтобы избежать несоответствия гидратации
  if (!mounted) {
    return <div className={styles.themeToggle} style={{ opacity: 0 }} />;
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={styles.themeToggle}
      onClick={handleThemeToggle}
      role="button"
      tabIndex={0}
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleThemeToggle();
          e.preventDefault();
        }
      }}
    >
      <div className={styles.themeToggleHandle}>
        <SunIcon className={styles.iconSun} />
        <MoonIcon className={styles.iconMoon} />
      </div>
    </div>
  );
};

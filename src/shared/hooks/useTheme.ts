'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  type Theme,
  getInitialTheme,
  applyTheme,
  storeTheme,
  subscribeToSystemThemeChange,
} from '../lib/theme';

export interface UseThemeReturn {
  /** Current theme */
  theme: Theme;
  /** Set specific theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Is dark theme active */
  isDark: boolean;
  /** Is light theme active */
  isLight: boolean;
  /** Is component mounted (for SSR hydration) */
  mounted: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
    setMounted(true);
  }, [theme]);

  // Subscribe to system theme changes (only if no stored preference)
  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme');
    
    if (!storedTheme) {
      const unsubscribe = subscribeToSystemThemeChange((newTheme) => {
        setThemeState(newTheme);
      });
      
      return unsubscribe;
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const newTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      storeTheme(newTheme);
      return newTheme;
    });
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    // For SSR hydration match
    mounted,
  };
}

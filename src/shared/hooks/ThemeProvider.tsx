'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import {
  type Theme,
  getInitialTheme,
  applyTheme,
  storeTheme,
  subscribeToSystemThemeChange,
} from '../lib/theme';

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme if no stored preference */
  defaultTheme?: Theme;
  /** Enable automatic system theme detection */
  enableSystem?: boolean;
  /** Storage key for theme preference */
  storageKey?: string;
}

export interface ThemeContextValue {
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
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider component
 * 
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  enableSystem = true,
  storageKey = 'app-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount (SSR safe)
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const initialTheme = (stored as Theme) || (enableSystem ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      defaultTheme);
    
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, [defaultTheme, enableSystem, storageKey]);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  // Subscribe to system theme changes
  useEffect(() => {
    if (!enableSystem || !mounted) return;
    
    // Only subscribe if no stored preference
    const stored = localStorage.getItem(storageKey);
    if (stored) return;

    const unsubscribe = subscribeToSystemThemeChange((newTheme) => {
      setThemeState(newTheme);
    });

    return unsubscribe;
  }, [enableSystem, mounted, storageKey]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    storeThemeWithKey(newTheme, storageKey);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const newTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      storeThemeWithKey(newTheme, storageKey);
      return newTheme;
    });
  }, [storageKey]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function storeThemeWithKey(theme: Theme, storageKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey, theme);
}

/**
 * Hook to use theme context
 * 
 * @throws Error if used outside ThemeProvider
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Hook to use theme (alias for useThemeContext)
 */
export const useTheme = useThemeContext;

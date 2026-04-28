export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app-theme';
const PRIMARY_COLOR_STORAGE_KEY = 'app-primary-color';
const SECONDARY_COLOR_STORAGE_KEY = 'app-secondary-color';
const THEME_ATTRIBUTE = 'data-theme';
const DEFAULT_PRIMARY_COLOR = '#42aaff';
const DEFAULT_SECONDARY_COLOR = '#77dde7';

/**
 * Get system preferred theme (based on OS preference)
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get stored theme from localStorage
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  return null;
}

/**
 * Get stored primary color from localStorage
 */
export function getStoredPrimaryColor(): string {
  if (typeof window === 'undefined') return DEFAULT_PRIMARY_COLOR;
  return localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY) || DEFAULT_PRIMARY_COLOR;
}

/**
 * Get stored secondary color from localStorage
 */
export function getStoredSecondaryColor(): string {
  if (typeof window === 'undefined') return DEFAULT_SECONDARY_COLOR;
  return localStorage.getItem(SECONDARY_COLOR_STORAGE_KEY) || DEFAULT_SECONDARY_COLOR;
}

/**
 * Get current theme (stored or system default)
 */
export function getInitialTheme(): Theme {
  return getStoredTheme() || getSystemTheme();
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}

/**
 * Helper to darken a color by a percentage
 * @param hex Hex color string (e.g. #ff8200)
 * @param percent Percentage to darken (0-100)
 */
function darkenColor(hex: string, percent: number): string {
  // Remove hash if present
  const cleanHex = hex.replace(/^#/, '');
  
  // Convert to RGB
  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  // Apply darken
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  // Ensure 0-255
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert back to hex
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Apply primary color to document via CSS variable
 */
export function applyPrimaryColor(color: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--primary-500', color);
  
  // Рассчитываем темный оттенок для анимаций (аналог primary-700)
  const darkColor = darkenColor(color, 20); // На 20% темнее
  document.documentElement.style.setProperty('--primary-700', darkColor);
}

/**
 * Apply secondary color to document via CSS variable
 */
export function applySecondaryColor(color: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--secondary-500', color);
  
  // Рассчитываем темный оттенок для анимаций (аналог secondary-700)
  const darkColor = darkenColor(color, 20); // На 20% темнее
  document.documentElement.style.setProperty('--secondary-700', darkColor);
}

/**
 * Store theme in localStorage
 */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Store primary color in localStorage
 */
export function storePrimaryColor(color: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, color);
}

/**
 * Store secondary color in localStorage
 */
export function storeSecondaryColor(color: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SECONDARY_COLOR_STORAGE_KEY, color);
}

/**
 * Reset primary color to default
 */
export function resetPrimaryColor(): string {
  applyPrimaryColor(DEFAULT_PRIMARY_COLOR);
  storePrimaryColor(DEFAULT_PRIMARY_COLOR);
  return DEFAULT_PRIMARY_COLOR;
}

/**
 * Reset secondary color to default
 */
export function resetSecondaryColor(): string {
  applySecondaryColor(DEFAULT_SECONDARY_COLOR);
  storeSecondaryColor(DEFAULT_SECONDARY_COLOR);
  return DEFAULT_SECONDARY_COLOR;
}

/**
 * Set theme (apply + store)
 */
export function setTheme(theme: Theme): void {
  applyTheme(theme);
  storeTheme(theme);
}

/**
 * Set primary color (apply + store)
 */
export function setPrimaryColor(color: string): void {
  applyPrimaryColor(color);
  storePrimaryColor(color);
}

/**
 * Set secondary color (apply + store)
 */
export function setSecondaryColor(color: string): void {
  applySecondaryColor(color);
  storeSecondaryColor(color);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) as Theme;
  const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Subscribe to system theme changes
 */
export function subscribeToSystemThemeChange(callback: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light');
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

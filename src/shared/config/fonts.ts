import { Montserrat, Open_Sans } from 'next/font/google';

// ===============================================================================================
// Шрифты
// ===============================================================================================

/**
 * ### Montserrat (Заголовки)
 * - **Начертания:** 400, 500, 600, 700, 800
 * - **Переменная:** `--font-montserrat`
 */
export const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

/**
 * ### Open Sans (Основной текст, UI)
 * - **Начертания:** 400, 500, 600, 700
 * - **Переменная:** `--font-open-sans`
 */
export const openSans = Open_Sans({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-open-sans',
});

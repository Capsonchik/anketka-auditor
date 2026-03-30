import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@core/providers'
import { I18nProvider } from '@core/providers/i18n-provider'
import { ThemeProvider } from '@shared/hooks/ThemeProvider'
import { montserrat, openSans } from '@shared/config/fonts'

export const metadata: Metadata = {
  title: 'BI Next App',
  description: 'BI Next.js application with FSD architecture',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${openSans.variable}`}>
      <body>
        <StoreProvider>
          <I18nProvider>
            <ThemeProvider defaultTheme="dark">
              {children}
            </ThemeProvider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

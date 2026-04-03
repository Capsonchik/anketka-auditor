import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundaryProvider, StoreProvider, ThemeProvider } from '@core/providers'
import { I18nProvider } from '@core/providers/i18n-provider'
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
        <ErrorBoundaryProvider>
          <StoreProvider>
            <I18nProvider>
              <ThemeProvider defaultTheme="dark">
                {children}
              </ThemeProvider>
            </I18nProvider>
          </StoreProvider>
        </ErrorBoundaryProvider>

      </body>
    </html>
  )
}

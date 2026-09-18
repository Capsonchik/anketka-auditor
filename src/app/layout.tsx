import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundaryProvider, StoreProvider, ThemeProvider } from '@core/providers'
import { I18nProvider } from '@core/providers/i18n-provider'
import { montserrat, openSans } from '@shared/config/fonts'
import { ToasterProvider } from '@shared/ui/toaster'

export const metadata: Metadata = {
  title: {
    default: 'Survey-all — Кабинет аудитора',
    template: '%s · Survey-all',
  },
  description: 'Кабинет аудитора Survey-all: задания, карта, заполнение анкет',
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
                <ToasterProvider>{children}</ToasterProvider>
              </ThemeProvider>
            </I18nProvider>
          </StoreProvider>
        </ErrorBoundaryProvider>
      </body>
    </html>
  )
}

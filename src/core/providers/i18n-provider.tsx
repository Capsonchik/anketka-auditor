'use client';

import { ReactNode, useEffect } from 'react';
import '@shared/lib/i18n/i18n'; // Инициализация i18next

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  return <>{children}</>;
};

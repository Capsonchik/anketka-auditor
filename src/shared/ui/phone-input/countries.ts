import React from 'react';
import * as Flags from './flags';

export interface Country {
  name: string;
  code: string;
  prefix: string;
  mask: string;
  emoji: string;
  Flag: React.ComponentType;
}

/**
 * Метаданные стран СНГ для PhoneInput
 */
export const CIS_COUNTRIES: Country[] = [
  {
    name: 'Россия',
    code: 'RU',
    prefix: '+7',
    mask: '+7 (999) 999-99-99',
    emoji: '🇷🇺',
    Flag: Flags.RUFlag,
  },
  {
    name: 'Казахстан',
    code: 'KZ',
    prefix: '+7',
    mask: '+7 (799) 999-99-99',
    emoji: '🇰🇿',
    Flag: Flags.KZFlag,
  },
  {
    name: 'Беларусь',
    code: 'BY',
    prefix: '+375',
    mask: '+375 (99) 999-99-99',
    emoji: '🇧🇾',
    Flag: Flags.BYFlag,
  },
  {
    name: 'Узбекистан',
    code: 'UZ',
    prefix: '+998',
    mask: '+998 (99) 999-99-99',
    emoji: '🇺🇿',
    Flag: Flags.UZFlag,
  },
  {
    name: 'Кыргызстан',
    code: 'KG',
    prefix: '+996',
    mask: '+996 (999) 999-999',
    emoji: '🇰🇬',
    Flag: Flags.KGFlag,
  },
  {
    name: 'Армения',
    code: 'AM',
    prefix: '+374',
    mask: '+374 (99) 999-999',
    emoji: '🇦🇲',
    Flag: Flags.AMFlag,
  },
  {
    name: 'Азербайджан',
    code: 'AZ',
    prefix: '+994',
    mask: '+994 (99) 999-99-99',
    emoji: '🇦🇿',
    Flag: Flags.AZFlag,
  },
  {
    name: 'Таджикистан',
    code: 'TJ',
    prefix: '+992',
    mask: '+992 (99) 999-99-99',
    emoji: '🇹🇯',
    Flag: Flags.TJFlag,
  },
  {
    name: 'Молдова',
    code: 'MD',
    prefix: '+373',
    mask: '+373 (99) 999-999',
    emoji: '🇲🇩',
    Flag: Flags.MDFlag,
  }

];

/**
 * Поиск страны по префиксу
 */
export const findCountryByPrefix = (phone: string): Country | undefined => {
  const digits = phone.replace(/\D/g, '');
  
  // Особая обработка для RU/KZ (оба +7)
  if (digits.startsWith('7')) {
    if (digits.length > 1) {
      const secondDigit = digits[1];
      if (['7', '0', '6'].includes(secondDigit)) return CIS_COUNTRIES.find(c => c.code === 'KZ');
      return CIS_COUNTRIES.find(c => c.code === 'RU');
    }
    return CIS_COUNTRIES.find(c => c.code === 'RU');
  }

  // Для остальных ищем по самому длинному совпадению префикса
  return [...CIS_COUNTRIES]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find(c => digits.startsWith(c.prefix.replace('+', '')));
};

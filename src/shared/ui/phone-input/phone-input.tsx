'use client'

import React, { forwardRef, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { Input, InputProps } from '../input/input';
import { CIS_COUNTRIES, findCountryByPrefix, Country } from './countries';
import { GlobeIcon } from './flags';
import { useClickOutside } from '@shared/lib/hooks/useClickOutside';
import styles from './phone-input.module.scss';

/**
 * Пропсы для PhoneInput
 */
export interface PhoneInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  /** Значение в формате +79998887766 */
  value?: string;
  /** Обработчик изменения (возвращает сырое значение с +) */
  onChange?: (value: string) => void;
  /** Разрешить выбор только определенных стран */
  allowedCountries?: string[];
  /** Скрыть селектор флага */
  hideFlag?: boolean;
  /** Ошибка */
  error?: string;
}

/**
 * Native PhoneInput компонент
 * 
 * @description
 * Компонент для ввода номера телефона с поддержкой масок СНГ, 
 * автоопределением страны и удобным селектором.
 * 
 * @example
 * ```tsx
 * const [phone, setPhone] = useState('+79998887766');
 * <PhoneInput value={phone} onChange={setPhone} label="Телефон" />
 * ```
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  value = '',
  onChange,
  allowedCountries,
  hideFlag = false,
  error,
  className,
  disabled,
  ...props
}, ref) => {
  const filteredCountries = useMemo(() => {
    if (!allowedCountries) return CIS_COUNTRIES;
    return CIS_COUNTRIES.filter(c => allowedCountries.includes(c.code));
  }, [allowedCountries]);

  // Определяем текущую страну по значению
  const initialCountry = findCountryByPrefix(value);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(initialCountry || null);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const CurrentFlag = currentCountry?.Flag;

  /**
   * Применяет маску к строке цифр
   */
  const applyMask = useCallback((digits: string, mask: string) => {
    if (!digits) return '';
    
    let result = '';
    let digitIndex = 0;
    
    for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
      if (mask[i] === '9') {
        result += digits[digitIndex];
        digitIndex++;
      } else {
        result += mask[i];
        // Если цифра совпадает с символом маски (например, префикс +7), пропускаем её
        if (digits[digitIndex] === mask[i]) {
          digitIndex++;
        }
      }
    }
    return result;
  }, []);

  /**
   * Очистка номера от всего кроме цифр и знака +
   */
  const cleanPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    return digits ? `+${digits}` : '';
  };

  /**
   * Синхронизация внешнего значения с внутренним состоянием
   */
  useEffect(() => {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      setInputValue('');
      setCurrentCountry(null);
      return;
    }

    const country = findCountryByPrefix(value);
    if (country) {
      setCurrentCountry(country);
      const masked = applyMask(digits, country.mask);
      setInputValue(masked);
    } else {
      // Если страна не найдена, но есть цифры, показываем их с +
      setInputValue(`+${digits}`);
      setCurrentCountry(null);
    }
  }, [value, applyMask]);

  /**
   * Обработка изменения текста в инпуте
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Если пользователь удалил всё, сбрасываем
    if (!val || val === '+') {
      setInputValue('');
      setCurrentCountry(null);
      onChange?.('');
      return;
    }

    // Оставляем только цифры
    let digits = val.replace(/\D/g, '');
    
    // Если начали вводить с 8, заменяем на 7 (для RU/KZ)
    if (digits.startsWith('8') && (!currentCountry || currentCountry.code === 'RU' || currentCountry.code === 'KZ')) {
      digits = '7' + digits.substring(1);
    }

    // Пытаемся определить страну по вводу
    const detectedCountry = findCountryByPrefix(digits);
    
    if (detectedCountry) {
      setCurrentCountry(detectedCountry);
      
      // Ограничиваем количество цифр согласно маске
      const maxDigits = detectedCountry.mask.replace(/\D/g, '').length;
      if (digits.length > maxDigits) {
        digits = digits.substring(0, maxDigits);
      }

      const masked = applyMask(digits, detectedCountry.mask);
      setInputValue(masked);
      onChange?.(cleanPhone(masked));
    } else {
      // Страна не определена
      setCurrentCountry(null);
      const formatted = `+${digits}`;
      setInputValue(formatted);
      onChange?.(formatted);
    }
  };

  /**
   * Смена страны через селектор
   */
  const handleCountrySelect = (country: Country | null) => {
    if (!country) {
      setCurrentCountry(null);
      setInputValue('');
      onChange?.('');
    } else {
      setCurrentCountry(country);
      const prefixDigits = country.prefix.replace('+', '');
      const masked = applyMask(prefixDigits, country.mask);
      setInputValue(masked);
      onChange?.(cleanPhone(masked));
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className={clsx(styles.phoneInputWrapper, className)}>
      <Input
        ref={ref}
        type="tel"
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        error={error}
        className={styles.inputField}
        placeholder={currentCountry ? currentCountry.mask : '+7 (999) 999-99-99'}
        leftElement={!hideFlag && (
          <div 
            ref={dropdownRef}
            className={clsx(
              styles.countrySelector, 
              disabled && styles.disabled,
              isDropdownOpen && styles.open
            )}
          >
            <div 
              className={styles.selectorTrigger}
              onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
              role="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
               <span className={styles.flag}>
                 {CurrentFlag ? <CurrentFlag /> : <GlobeIcon />}
               </span>
               <svg className={clsx(styles.chevron, isDropdownOpen && styles.chevronRotate)} width="10" height="6" viewBox="0 0 10 6" fill="none">
                 <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </div>
 
             <div className={clsx(styles.dropdown, isDropdownOpen && styles.open)} role="listbox">
               <div 
                 className={clsx(styles.dropdownItem, !currentCountry && styles.selected)}
                 onClick={() => handleCountrySelect(null)}
                 role="option"
                 aria-selected={!currentCountry}
               >
                 <span className={styles.flag}>
                   <GlobeIcon />
                 </span>
                 <span className={styles.countryName}>Любая страна</span>
               </div>
               
               {filteredCountries.map(c => {
                 const CountryFlag = c.Flag;
                 return (
                   <div 
                     key={c.code} 
                     className={clsx(styles.dropdownItem, currentCountry?.code === c.code && styles.selected)}
                     onClick={() => handleCountrySelect(c)}
                     role="option"
                     aria-selected={currentCountry?.code === c.code}
                   >
                     <span className={styles.flag}>
                       <CountryFlag />
                     </span>
                     <span className={styles.countryName}>{c.name}</span>
                     <span className={styles.countryPrefix}>{c.prefix}</span>
                   </div>
                 );
               })}
             </div>
           </div>
        )}
        {...props}
      />
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

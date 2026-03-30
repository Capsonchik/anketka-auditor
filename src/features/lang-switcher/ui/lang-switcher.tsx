'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon, ChevronRightIcon } from '@shared/icons';
import styles from './lang-switcher.module.scss';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
] as const;

export const LangSwitcher = () => {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Очистка таймера при входе в активную зону (кнопка или меню)
  const handleContentMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Запуск таймера при входе на невидимый слой (Backdrop)
  const handleBackdropMouseEnter = () => {
    if (isOpen) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
  };

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  if (!mounted) return null;

  const currentLang = i18n.language.split('-')[0] || 'ru';
  const otherLanguages = languages.filter(lang => lang.code !== currentLang);

  return (
    <div ref={dropdownRef} className={styles.wrapper}>
      {/* Активная зона: кнопка и меню */}
      <div 
        className={styles.content} 
        onMouseEnter={handleContentMouseEnter}
      >
        <button 
          onClick={toggleDropdown}
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={styles.currentLang}>{currentLang}</span>
          <div className={clsx(styles.chevron, isOpen && styles.open)}>
            <ChevronDownIcon />
          </div>
        </button>

        <div className={clsx(styles.dropdown, isOpen && styles.open)}>
          {otherLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={styles.option}
            >
              <span className={styles.optionText}>{language.code}</span>
              <div className={styles.arrow}>
                <ChevronRightIcon />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Невидимый слой на весь экран */}
      {isOpen && (
        <div 
          className={styles.backdrop} 
          onMouseEnter={handleBackdropMouseEnter}
          onClick={handleBackdropClick}
        />
      )}
    </div>
  );
};

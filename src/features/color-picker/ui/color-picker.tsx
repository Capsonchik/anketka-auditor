'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@shared/ui/button';
import { 
  getStoredPrimaryColor, 
  setPrimaryColor, 
  resetPrimaryColor,
  applyPrimaryColor,
  getStoredSecondaryColor,
  setSecondaryColor,
  resetSecondaryColor,
  applySecondaryColor
} from '@shared/lib/theme';
import styles from './color-picker.module.scss';

export const ColorPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState('#42aaff');
  const [secondaryColor, setSecondaryColorState] = useState('#77dde7');
  const containerRef = useRef<HTMLDivElement>(null);

  // Инициализация цветов из хранилища
  useEffect(() => {
    const storedPrimary = getStoredPrimaryColor();
    const storedSecondary = getStoredSecondaryColor();
    
    setPrimaryColorState(storedPrimary);
    applyPrimaryColor(storedPrimary);
    
    setSecondaryColorState(storedSecondary);
    applySecondaryColor(storedSecondary);
  }, []);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPrimaryColorState(newColor);
    setPrimaryColor(newColor);
  };

  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSecondaryColorState(newColor);
    setSecondaryColor(newColor);
  };

  const handleReset = useCallback(() => {
    const defaultPrimary = resetPrimaryColor();
    const defaultSecondary = resetSecondaryColor();
    
    setPrimaryColorState(defaultPrimary);
    setSecondaryColorState(defaultSecondary);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        className={styles.trigger} 
        onClick={toggleDropdown}
        title="Настроить цвета"
      >
        <div className={styles.previews}>
          <div className={styles.colorPreview} style={{ backgroundColor: primaryColor }} />
          <div className={styles.colorPreview} style={{ backgroundColor: secondaryColor }} />
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.pickerSection}>
            <label>Основной цвет</label>
            <input 
              type="color" 
              value={primaryColor}
              onChange={handlePrimaryColorChange}
              className={styles.colorInput}
            />
          </div>

          <div className={styles.pickerSection}>
            <label>Дополнительный цвет</label>
            <input 
              type="color" 
              value={secondaryColor}
              onChange={handleSecondaryColorChange}
              className={styles.colorInput}
            />
          </div>
          
          <div className={styles.controls}>
            <Button 
              size="sm" 
              variant="default" 
              onClick={handleReset}
              className={styles.resetButton}
            >
              Сброс
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

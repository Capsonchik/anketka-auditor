'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@shared/ui/button';
import { 
  getStoredPrimaryColor, 
  setPrimaryColor, 
  resetPrimaryColor,
  applyPrimaryColor
} from '@shared/lib/theme';
import styles from './color-picker.module.scss';

export const ColorPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState('#ff8200');
  const containerRef = useRef<HTMLDivElement>(null);

  // Инициализация цвета из хранилища
  useEffect(() => {
    const storedColor = getStoredPrimaryColor();
    setColor(storedColor);
    applyPrimaryColor(storedColor);
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    setPrimaryColor(newColor); // Сразу сохраняем и применяем
  };

  const handleReset = useCallback(() => {
    const defaultColor = resetPrimaryColor();
    setColor(defaultColor);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        className={styles.trigger} 
        onClick={toggleDropdown}
        title="Настроить основной цвет"
      >
        <div className={styles.colorPreview} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.pickerSection}>
            <label>Основной цвет</label>
            <input 
              type="color" 
              value={color}
              onChange={handleColorChange}
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

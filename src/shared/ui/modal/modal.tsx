'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from '@shared/lib/clsx';
import type { ModalProps } from './modal.types';
import styles from './modal.module.scss';

/**
 * Универсальный компонент модального окна
 * 
 * @param {ModalProps} props - Свойства модального окна
 * @returns {JSX.Element | null} Возвращает JSX элемент модального окна или null, если окно закрыто
 */
export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen = false,
  onClose,
  backdrop = true,
  className,
  modalClassName,
  size = 'md',
  centered = true,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isShaking, setIsShaking] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Следим за состоянием открытия/закрытия для анимаций и блокировки скролла
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      setShouldRender(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Останавливаем всплытие на backdrop, чтобы не триггерить внешние события
    e.stopPropagation();

    if (backdrop === 'static') {
      // Показываем анимацию тряски, если backdrop static
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400); // Совпадает с длительностью анимации в scss
    } else if (backdrop === true) {
      // Закрываем окно, если backdrop true
      onClose?.();
    }
    // Если backdrop === false, ничего не делаем (клик проходит сквозь)
  }, [backdrop, onClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    // Останавливаем всплытие при клике внутри модального окна
    e.stopPropagation();
  }, []);

  // Если окно не должно рендериться, возвращаем null
  if (!shouldRender) return null;

  // Создаем контент модального окна
  const modalContent = (
    <div 
      className={clsx(
        styles.root, 
        isOpen && styles.isOpen,
        centered && styles.centered,
        className
      )}
    >
      {/* Подложка (Backdrop) */}
      {backdrop !== false && (
        <div 
          className={styles.backdrop} 
          onClick={handleBackdropClick}
        />
      )}

      {/* Само модальное окно */}
      <div 
        ref={modalRef}
        className={clsx(
          styles.modal,
          isShaking && styles.staticShake,
          styles[size] || '', // Если size — кастомная строка, стиль не применится, но можно передать через modalClassName
          modalClassName
        )}
        onClick={handleModalClick}
      >
        {children}
      </div>
    </div>
  );

  // Используем портал для рендеринга в body
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body) 
    : null;
};

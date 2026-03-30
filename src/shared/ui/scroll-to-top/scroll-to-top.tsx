'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './scroll-to-top.module.scss';

/**
 * Пропсы компонента ScrollToTop
 */
interface ScrollToTopProps {
  /** Дополнительный класс для стилизации */
  className?: string;
  /** Порог прокрутки в пикселях, после которого кнопка становится видимой */
  threshold?: number;
  /** ID контейнера, прокрутку которого нужно отслеживать. Если не указан, отслеживается прокрутка окна. */
  containerId?: string;
}

/**
 * Компонент кнопки "Наверх", которая появляется при прокрутке страницы
 * 
 * @param props - Пропсы компонента
 * @returns Кнопка для прокрутки к началу страницы/контейнера
 * 
 * @example
 * <ScrollToTop threshold={200} />
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  className,
  threshold = 300,
  containerId,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getContainer = () => (containerId ? document.getElementById(containerId) : window);

    const toggleVisibility = () => {
      const container = getContainer();
      if (!container) return;

      const scrollTop = containerId
        ? (container as HTMLElement).scrollTop
        : window.scrollY;

      if (scrollTop > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const container = getContainer();
    if (container) {
      container.addEventListener('scroll', toggleVisibility);
      // Проверяем начальное состояние
      toggleVisibility();
    }

    return () => {
      const container = getContainer();
      if (container) {
        container.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, [threshold, containerId]);

  /**
   * Выполняет плавную прокрутку к верху контейнера или окна
   */
  const handleScrollToTop = () => {
    const container = containerId ? document.getElementById(containerId) : window;

    container?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={clsx(styles.scrollToTop, isVisible && styles.visible, className)}
      onClick={handleScrollToTop}
      aria-label="Наверх"
      type="button"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
      >
        <path
          d="M12 19V5M12 5L5 12M12 5L19 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { clsx } from '@shared/lib/clsx';
import type { ScrollRevealProps } from './scroll-reveal.types';
import styles from './scroll-reveal.module.scss';

/**
 * Обертка для анимации появления элементов при скролле.
 * 
 * Использует IntersectionObserver для отслеживания появления элемента в зоне видимости.
 * Поддерживает различные типы анимаций, длительность, задержку и настройку порогов видимости.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  animation = 'slide-up',
  duration = 800,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Если once === true, прекращаем наблюдение после первого появления
          if (once) {
            observer.unobserve(element);
          }
        } else {
          // Если once === false, скрываем элемент при уходе из зоны видимости
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, once]);

  // Динамические стили для управления длительностью и задержкой
  const style = useMemo(() => ({
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  }), [duration, delay]);

  return (
    <div
      ref={ref}
      style={style}
      className={clsx(
        styles.reveal,
        styles[`animation-${animation}`],
        isVisible && styles.visible,
        className
      )}
    >
      {children}
    </div>
  );
};

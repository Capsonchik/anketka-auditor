import { ReactNode } from 'react';

/**
 * Типы анимации появления
 */
export type ScrollRevealAnimation = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';

/**
 * Свойства компонента ScrollReveal
 */
export interface ScrollRevealProps {
  /**
   * Контент, который будет появляться при скролле
   */
  children: ReactNode;

  /**
   * Дополнительный класс для контейнера
   */
  className?: string;

  /**
   * Тип анимации появления
   * @default 'slide-up'
   */
  animation?: ScrollRevealAnimation;

  /**
   * Длительность анимации в миллисекундах
   * @default 800
   */
  duration?: number;

  /**
   * Задержка перед началом анимации в миллисекундах
   * @default 0
   */
  delay?: number;

  /**
   * Порог видимости (от 0 до 1), при котором срабатывает анимация
   * @default 0.1
   */
  threshold?: number;

  /**
   * Отступ от границ экрана (rootMargin) для IntersectionObserver.
   * Можно задать в пикселях, например, '0px 0px -100px 0px' для срабатывания за 100px до низа экрана.
   * @default '0px 0px -50px 0px'
   */
  rootMargin?: string;

  /**
   * Должна ли анимация срабатывать только один раз
   * @default true
   */
  once?: boolean;
}

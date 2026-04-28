'use client'

import React, { useRef, MouseEvent, useLayoutEffect } from 'react';
import { clsx } from '@shared/lib/clsx';

import styles from './button.module.scss';
import animationStyles from './styles/animations.module.scss';
import type { ButtonProps } from './button.types';

export const Button: React.FC<ButtonProps> = ({
  size = 'md',
  appearance = 'default',
  rounded = 'none',
  variant = 'default',
  animation = 'none',
  loading = false,
  block = false,
  active = false,
  className,
  children,
  leftIcon,
  rightIcon,
  onMouseMove,
  onMouseOut,
  disabled,
  style,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Динамическое получение размеров кнопки для работы анимаций
  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    const updateSize = () => {
      if (buttonRef.current) {
        const { width, height } = buttonRef.current.getBoundingClientRect();
        buttonRef.current.style.setProperty('--btn-width', `${width}px`);
        buttonRef.current.style.setProperty('--btn-height', `${height}px`);
      }
    };

    // Начальный расчет
    updateSize();

    // Следим за изменениями (например, при ресайзе окна или изменении контента)
    const observer = new ResizeObserver(updateSize);
    observer.observe(buttonRef.current);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (animation === 'position-aware' && spanRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spanRef.current.style.setProperty('--x', `${x}px`);
      spanRef.current.style.setProperty('--y', `${y}px`);
    }
    onMouseMove?.(e);
  };

  const handleMouseOut = (e: MouseEvent<HTMLButtonElement>) => {
    if (animation === 'position-aware' && spanRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spanRef.current.style.setProperty('--x', `${x}px`);
      spanRef.current.style.setProperty('--y', `${y}px`);
    }
    onMouseOut?.(e);
  };

  // zoning-in, four-corners, alternate, vertical-overlap, horizontal-overlap, ripple - текст ДОЛЖЕН быть в нормальном потоке
  // но им нужны дополнительные псевдоэлементы от технического span.effect
  const needsEffectSpan = [
    'zoning-in', 'four-corners', 'alternate', 'vertical-overlap', 'horizontal-overlap',
    'position-aware', 'ripple'
  ].includes(animation);

  const innerContent = (
    <>
      {loading && <span className={styles.loader}>...</span>}
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );

  return (
    <button
      ref={buttonRef}
      className={clsx(
        styles.button,
        styles[size],
        styles[`rounded-${rounded}`],
        styles[`variant-${variant}`],
        styles[`appearance-${appearance}`],
        animation !== 'none' && styles.hasAnimation,
        animation !== 'none' && animationStyles[animation],
        block && styles.block,
        active && styles.active,
        loading && styles.loading,
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      disabled={disabled || loading}
      {...rest}
    >
      <span className={styles.content}>{innerContent}</span>
      {needsEffectSpan && (
        <span ref={spanRef} className={styles.effect} aria-hidden="true" />
      )}
    </button>
  );
};

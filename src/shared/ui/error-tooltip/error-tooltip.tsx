'use client';

import React, { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './error-tooltip.module.scss';

export interface ErrorTooltipProps {
  /** Текст ошибки */
  error?: string;
  /** Дополнительный класс */
  className?: string;
}

/**
 * ErrorTooltip - компонент для отображения ошибок валидации.
 * Появляется плавно под элементом управления.
 */
export const ErrorTooltip = memo(({ error, className }: ErrorTooltipProps) => {
  // Сохраняем последнее сообщение об ошибке, чтобы оно не исчезало мгновенно
  // во время анимации скрытия (fade-out)
  const [displayedError, setDisplayedError] = useState(error);

  useEffect(() => {
    if (error) {
      setDisplayedError(error);
    }
  }, [error]);

  // Компонент всегда рендерится, но управляется через CSS классы для плавной анимации
  return (
    <div
      className={clsx(
        styles.errorTooltip,
        error && styles.visible,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {displayedError}
    </div>
  );
});

ErrorTooltip.displayName = 'ErrorTooltip';

'use client';

import React, { memo, useEffect, useState } from 'react';
import { clsx } from '@shared/lib/clsx';
import styles from './error-tooltip.module.scss';

export interface ErrorTooltipProps {
  /** Текст ошибки */
  error?: string;
  /** Дополнительный класс */
  className?: string;
  /** Максимальная ширина тултипа в пикселях (по умолчанию 300) */
  maxWidth?: number;
  /** Разрешить перенос строк (по умолчанию false) */
  allowWrap?: boolean;
}

/**
 * ErrorTooltip - компонент для отображения ошибок валидации.
 * Появляется плавно под элементом управления.
 * Если текст длиннее 40 символов, автоматически переключается на многострочный режим.
 */
export const ErrorTooltip = memo(({ 
  error, 
  className, 
  maxWidth = 300,
  allowWrap = false 
}: ErrorTooltipProps) => {
  // Сохраняем последнее сообщение об ошибке, чтобы оно не исчезало мгновенно
  // во время анимации скрытия (fade-out)
  const [displayedError, setDisplayedError] = useState(error);

  useEffect(() => {
    if (error) {
      setDisplayedError(error);
    }
  }, [error]);

  // Проверяем, нужно ли переносить строки (если текст длиннее 40 символов)
  const isLongText = displayedError && displayedError.length > 40;
  const shouldWrap = allowWrap || isLongText;

  return (
    <div
      className={clsx(
        styles.errorTooltip,
        error && styles.visible,
        shouldWrap && styles.wrapped,
        className
      )}
      style={{ maxWidth: shouldWrap ? maxWidth : undefined }}
      role="alert"
      aria-live="polite"
    >
      {displayedError}
    </div>
  );
});

ErrorTooltip.displayName = 'ErrorTooltip';
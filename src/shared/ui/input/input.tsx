'use client'

import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import { clsx } from '@shared/lib/clsx';
import { ErrorTooltip } from '../error-tooltip';
import styles from './input.module.scss';

export type InputType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'search' 
  | 'time' 
  | 'datetime-local' 
  | 'date' 
  | 'month' 
  | 'week' 
  | 'color';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  type?: InputType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled';
  state?: 'default' | 'success' | 'error' | 'warning';
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  autoHideError?: boolean;
  onClearError?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  clearable?: boolean;
  block?: boolean;
}

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'color' | 'rows'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled';
  state?: 'default' | 'success' | 'error' | 'warning';
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  autoHideError?: boolean;
  onClearError?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  block?: boolean;
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  size = 'md',
  variant = 'default',
  state = 'default',
  label,
  hint,
  error,
  autoHideError = false,
  onClearError,
  leftIcon,
  rightIcon,
  leftElement,
  rightElement,
  clearable = false,
  block = false,
  className,
  value,
  onChange,
  disabled,
  readOnly,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? '');
  const [localError, setLocalError] = useState<string | undefined>(error);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLInputElement>(null);

  // Синхронизация локальной ошибки с пропсом
  useEffect(() => {
    setLocalError(error);
    
    // Если есть ошибка и включен автосброс, запускаем таймер
    if (error && autoHideError) {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      
      errorTimeoutRef.current = setTimeout(() => {
        setLocalError(undefined);
        onClearError?.();
      }, 5000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, autoHideError, onClearError]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Сбрасываем ошибку при вводе/удалении символов
    if (localError) {
      setLocalError(undefined);
      onClearError?.();
    }
    setInternalValue(e.target.value);
    onChange?.(e);
  }, [onChange, localError, onClearError]);

  const handleClear = useCallback(() => {
    if (localError) {
      setLocalError(undefined);
      onClearError?.();
    }
    const clearEvent = { target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
    setInternalValue('');
    onChange?.(clearEvent);
  }, [onChange, localError, onClearError]);

  const currentState = localError ? 'error' : state;
  
  // Проверяем наличие элементов для стилизации
  const hasLeftElement = !!(leftElement || leftIcon);
  const hasRightElement = !!(rightElement || rightIcon);

  return (
    <div className={clsx(
      styles.wrapper,
      block && styles.block,
      className
    )}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <div 
          className={clsx(
            styles.container,
            styles[size],
            styles[variant],
            styles[currentState],
            isFocused && styles.focused,
            disabled && styles.disabled,
            readOnly && styles.readOnly,
            block && styles.block,
            hasLeftElement && styles.hasLeftElement,  // 👈 исправлено
            hasRightElement && styles.hasRightElement // 👈 исправлено
          )}
          onClick={() => !disabled && !readOnly && triggerRef.current?.focus()}
        >
          {leftElement || (leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>)}
          
          <input
            {...props}
            ref={(node) => {
              triggerRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            type={type}
            className={clsx(styles.input, type === 'color' && styles.colorInput)}
            value={value !== undefined ? value : internalValue}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
          />

          {clearable && internalValue && !disabled && !readOnly && (
            <button 
              type="button" 
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear input"
              tabIndex={-1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}

          {rightElement || (rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>)}
        </div>

        <ErrorTooltip error={localError} />
      </div>

      {hint && !localError && (
        <p className={styles.hint}>{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  size = 'md',
  variant = 'default',
  state = 'default',
  label,
  hint,
  error,
  autoHideError = false,
  onClearError,
  leftIcon,
  rightIcon,
  leftElement,
  rightElement,
  block = false,
  rows = 4,
  resize = 'vertical',
  className,
  disabled,
  readOnly,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(error);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Синхронизация локальной ошибки с пропсом
  useEffect(() => {
    setLocalError(error);
    
    // Если есть ошибка и включен автосброс, запускаем таймер
    if (error && autoHideError) {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      
      errorTimeoutRef.current = setTimeout(() => {
        setLocalError(undefined);
        onClearError?.();
      }, 5000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, autoHideError, onClearError]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Сбрасываем ошибку при вводе/удалении символов
    if (localError) {
      setLocalError(undefined);
      onClearError?.();
    }
    props.onChange?.(e);
  }, [props.onChange, localError, onClearError]);

  const currentState = localError ? 'error' : state;
  
  // Проверяем наличие элементов для стилизации
  const hasLeftElement = !!(leftElement || leftIcon);
  const hasRightElement = !!(rightElement || rightIcon);

  return (
    <div className={clsx(styles.wrapper, block && styles.block)}>
      {label && (
        <label className={clsx(styles.label, styles.textareaLabel)}>
          {label}
        </label>
      )}
      
      <div 
        className={clsx(
          styles.container,
          styles.containerTextarea,
          styles[size],
          styles[variant],
          styles[currentState],
          isFocused && styles.focused,
          disabled && styles.disabled,
          readOnly && styles.readOnly,
          hasLeftElement && styles.hasLeftElement,   // 👈 исправлено
          hasRightElement && styles.hasRightElement, // 👈 исправлено
          className
        )}
        style={{ '--textarea-resize': resize } as React.CSSProperties}
      >
        {leftElement && <span className={styles.leftElement}>{leftElement}</span>}
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        
        <textarea
          ref={ref}
          rows={rows}
          className={styles.textarea}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        
        {rightElement && <span className={styles.rightElement}>{rightElement}</span>}
        {rightIcon && !rightElement && <span className={styles.rightIcon}>{rightIcon}</span>}

        <ErrorTooltip error={localError} />
      </div>
      
      {hint && !localError && (
        <span className={clsx(styles.hint, styles[`${currentState}Hint`])}>
          {hint}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
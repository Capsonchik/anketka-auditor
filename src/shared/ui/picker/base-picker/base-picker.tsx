'use client'



import React, { useState, useRef, useMemo } from 'react';
import { clsx } from '@shared/lib/clsx';
import { useClickOutside } from '@shared/lib/hooks/useClickOutside';
import { ErrorTooltip } from '../../error-tooltip';
import { BasePickerProps, PickerItem } from '../types';
import styles from './base-picker.module.scss';

// SVG Icons
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoaderIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.92993 4.92993L7.75993 7.75993" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.92993 19.07L7.75993 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 7.75993L19.07 4.92993" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export interface BasePickerInternalProps<V> extends BasePickerProps<V> {
  onSelect?: (item: PickerItem) => void;
  renderMenu?: (items: PickerItem[]) => React.ReactNode;
  multiple?: boolean;
}

export const BasePicker = <V,>({
  data = [],
  value,
  onChange,
  placeholder = 'Select',
  disabled = false,
  loading = false,
  className,
  style,
  cleanable = true,
  searchable = true,
  block = false,
  size = 'md',
  error = false,
  renderMenuItem,
  renderValue,
  renderExtraFooter,
  onSelect,
  renderMenu,
  multiple = false,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  tabIndex = 0,
}: BasePickerInternalProps<V>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    containerRef,
    () => {
      if (isOpen) setIsOpen(false);
    },
    'mousedown'
  );

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }

    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchValue('');
    onChange?.(multiple ? ([] as any) : null);
  };

  const filteredData = useMemo(() => {
    if (!searchable || !searchValue) return data;
    return data.filter(item => 
      String(item.label).toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchable, searchValue]);

  const defaultRenderValue = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className={clsx(styles.value, styles.placeholder)}>{placeholder}</span>;
    }

    if (multiple && Array.isArray(value)) {
      const selectedItems = data.filter(item => value.some(v => String(v) === String(item.value)));
      if (selectedItems.length === 0) {
        return <span className={clsx(styles.value, styles.placeholder)}>{placeholder}</span>;
      }
      return (
        <span className={styles.value}>
          {selectedItems.map(item => item.label).join(', ')}
        </span>
      );
    }

    const selectedItem = data.find(item => String(item.value) === String(value));
    // Нет в data — placeholder, а не «призрак» прошлого выбора
    if (!selectedItem) {
      return <span className={clsx(styles.value, styles.placeholder)}>{placeholder}</span>;
    }
    return <span className={styles.value}>{selectedItem.label}</span>;
  };

  const defaultRenderMenuItem = (item: PickerItem) => {
    const isSelected = multiple 
      ? Array.isArray(value) && value.some(v => String(v) === String(item.value))
      : value === item.value;

    return (
      <div
        key={item.value}
        className={clsx(styles.menuItem, {
          [styles.selected]: isSelected,
          [styles.disabled]: item.disabled,
        })}
        onClick={() => {
          if (item.disabled) return;
          onSelect?.(item);
          if (!multiple) setIsOpen(false);
        }}
      >
        {multiple ? (
          <div className={styles.checkItem}>
            <div className={clsx(styles.checkbox, { [styles.checked]: isSelected })}>
              {isSelected && <CheckIcon />}
            </div>
            <span>{item.label}</span>
          </div>
        ) : (
          <>
            <span>{item.label}</span>
            {isSelected && <CheckIcon />}
          </>
        )}
      </div>
    );
  };

  const hasValue = multiple 
    ? Array.isArray(value) && value.length > 0 
    : value !== null && value !== undefined;

  const isError = Boolean(error);
  const errorText = typeof error === 'string' ? error : undefined;

  return (
    <div 
      ref={containerRef}
      className={clsx(styles.container, { [styles.block]: block }, className)}
      style={style}
    >
      <div
        ref={triggerRef}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        tabIndex={disabled ? -1 : tabIndex}
        className={clsx(styles.trigger, styles[size], {
          [styles.active]: isOpen,
          [styles.disabled]: disabled,
          [styles.error]: isError,
        })}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {renderValue 
          ? renderValue(value!, multiple ? data.filter(i => Array.isArray(value) && value.some(v => String(v) === String(i.value))) : data.find(i => i.value === value) || null)
          : defaultRenderValue()}
        
        <div className={styles.indicators}>
          {cleanable && hasValue && !disabled && !loading && (
            <div 
              className={styles.clearButton} 
              onClick={handleClear}
              role="button"
              aria-label="Clear selection"
              tabIndex={-1}
            >
              <CloseIcon />
            </div>
          )}
          <div className={clsx(styles.icon, { [styles.loading]: loading })}>
            {loading ? <LoaderIcon /> : <ChevronDownIcon />}
          </div>
        </div>

        <ErrorTooltip error={errorText} />
      </div>

      <select 
        name={name} 
        id={id}
        multiple={multiple} 
        value={Array.isArray(value) ? (value as string[]) : (value as string) || ''} 
        onChange={() => {}} // Read-only via onChange
        className={styles.hiddenSelect}
        aria-hidden="true"
        tabIndex={-1}
      >
        {!multiple && <option value="">{placeholder}</option>}
        {data.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {isOpen && (
        <div 
          className={styles.dropdown}
          role="listbox"
          aria-multiselectable={multiple}
        >
          {searchable && (
            <div className={styles.search}>
              <input
                className={styles.searchInput}
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                aria-label="Search"
              />
            </div>
          )}
          
          <div className={styles.menu}>
            {filteredData.length > 0 ? (
              filteredData.map(item => 
                renderMenuItem 
                  ? renderMenuItem(item.label, item) 
                  : defaultRenderMenuItem(item)
              )
            ) : (
              <div className={styles.empty}>No data found</div>
            )}
          </div>
          
          {renderExtraFooter?.()}
        </div>
      )}
    </div>
  );
};

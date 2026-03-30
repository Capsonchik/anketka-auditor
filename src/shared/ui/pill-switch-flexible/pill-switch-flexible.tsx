'use client'



import React, { useRef, useEffect, useState } from 'react';
import styles from './pill-switch-flexible.module.scss';

export type PillValue = string | number | boolean;

export interface PillOption {
  label: string;
  value: PillValue;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface PillSwitchProps {
  data: PillOption[];
  value: PillValue;
  onChange: (value: PillValue) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

export const PillSwitchFlexible: React.FC<PillSwitchProps> = ({
  data,
  value,
  onChange,
  className = '',
  name = 'pill-switch',
  disabled = false,
  size = 'medium',
  variant = 'primary',
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState<{ width?: string; height?: string; transform?: string }>({});
  const optionRefs = useRef<(HTMLLabelElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updateIndicatorPosition = () => {
    const selectedIndex = data.findIndex(option => option.value === value);
    const selectedRef = optionRefs.current[selectedIndex];
    const wrapper = wrapperRef.current;
    if (selectedRef && wrapper) {
      const selectedRect = selectedRef.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      setIndicatorStyle({
        width: selectedRect.width + 'px',
        height: selectedRect.height + 'px',
        transform: 'translate(' + (selectedRect.left - wrapperRect.left) + 'px, ' + (selectedRect.top - wrapperRect.top) + 'px)',
      });
    }
  };

  useEffect(() => {
    updateIndicatorPosition();
    window.addEventListener('resize', updateIndicatorPosition);
    window.addEventListener('scroll', updateIndicatorPosition, true);
    return () => {
      window.removeEventListener('resize', updateIndicatorPosition);
      window.removeEventListener('scroll', updateIndicatorPosition, true);
    };
  }, [value, data]);

  const handleChange = (optionValue: PillValue, optionDisabled?: boolean) => {
    if (!disabled && !optionDisabled && optionValue !== value) {
      onChange(optionValue);
    }
  };

  return (
    <div className={`${styles.container} ${styles[`container_${size}`]} ${styles[`container_${variant}`]} ${disabled ? styles.containerDisabled : ''} ${className}`}>
      <div ref={wrapperRef} className={styles.wrapper}>
        <div className={styles.indicator} style={indicatorStyle} aria-hidden="true" />
        {data.map((option, index) => (
          <label
            ref={el => { optionRefs.current[index] = el; }}
            key={index}
            className={`${styles.option} ${value === option.value ? styles.optionSelected : ''} ${option.disabled ? styles.optionDisabled : ''}`}
            title={option.label}
          >
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => handleChange(option.value, option.disabled)}
              className={styles.radioInput}
              disabled={disabled || option.disabled}
              tabIndex={disabled || option.disabled ? -1 : 0}
            />
            {option.icon && (
              <span className={styles.optionIcon}>{option.icon}</span>
            )}
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

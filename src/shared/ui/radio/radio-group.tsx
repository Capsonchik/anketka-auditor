'use client'

import { useId } from 'react'

import { clsx } from '@shared/lib/clsx'
import { ErrorTooltip } from '../error-tooltip'

import type { RadioGroupProps, RadioValue } from './radio-group.types'
import styles from './radio-group.module.scss'

function valuesEqual(a: RadioValue | null | undefined, b: RadioValue): boolean {
  if (a == null) return false
  return String(a) === String(b)
}

export function RadioGroup({
  name,
  options,
  value = null,
  onChange,
  disabled = false,
  error,
  size = 'md',
  className,
  block = true,
}: RadioGroupProps) {
  const autoId = useId()
  const groupName = name || `radio-${autoId}`

  return (
    <div
      className={clsx(
        styles.root,
        styles[`size_${size}`],
        block && styles.block,
        disabled && styles.disabled,
        error && styles.hasError,
        className,
      )}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      aria-invalid={error ? true : undefined}
    >
      <div className={styles.list}>
        {options.map((option) => {
          const optionId = `${groupName}-${String(option.value)}`
          const isChecked = valuesEqual(value, option.value)
          const isOptionDisabled = disabled || Boolean(option.disabled)

          return (
            <label
              key={String(option.value)}
              htmlFor={optionId}
              className={clsx(
                styles.option,
                isChecked && styles.optionChecked,
                isOptionDisabled && styles.optionDisabled,
              )}
            >
              <input
                id={optionId}
                className={styles.input}
                type="radio"
                name={groupName}
                value={String(option.value)}
                checked={isChecked}
                disabled={isOptionDisabled}
                onChange={() => {
                  if (isOptionDisabled) return
                  onChange?.(option.value)
                }}
              />
              <span className={styles.control} aria-hidden>
                <span className={styles.dot} />
              </span>
              <span className={styles.content}>
                <span className={styles.label}>{option.label}</span>
                {option.description ? (
                  <span className={styles.description}>{option.description}</span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
      <ErrorTooltip error={error} />
    </div>
  )
}

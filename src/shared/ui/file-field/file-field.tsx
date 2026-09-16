'use client'

import React, { useId, useRef } from 'react'
import { clsx } from '@shared/lib/clsx'
import { FormField } from '../form-field'
import { Button } from '../button'
import styles from './file-field.module.scss'

export interface FileFieldProps {
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: string | boolean
  accept?: string
  disabled?: boolean
  value?: File | null
  onChange?: (file: File | null) => void
  className?: string
  buttonLabel?: string
  clearLabel?: string
  name?: string
}

export function FileField({
  label,
  required,
  hint,
  error,
  accept,
  disabled = false,
  value = null,
  onChange,
  className,
  buttonLabel = 'Выбрать файл',
  clearLabel = 'Очистить',
  name,
}: FileFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange?.(file)
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    onChange?.(null)
  }

  return (
    <FormField
      id={inputId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <div className={clsx(styles.root, disabled && styles.disabled)}>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          disabled={disabled}
          className={styles.hiddenInput}
          onChange={handleChange}
        />
        <div className={styles.row}>
          <Button
            type="button"
            variant="default"
            appearance="ghost"
            size="sm"
            disabled={disabled}
            onClick={handlePick}
          >
            {buttonLabel}
          </Button>
          {value ? (
            <>
              <span className={styles.fileName} title={value.name}>
                {value.name}
              </span>
              <button
                type="button"
                className={styles.clear}
                onClick={handleClear}
                disabled={disabled}
              >
                {clearLabel}
              </button>
            </>
          ) : (
            <span className={styles.placeholder}>Файл не выбран</span>
          )}
        </div>
      </div>
    </FormField>
  )
}

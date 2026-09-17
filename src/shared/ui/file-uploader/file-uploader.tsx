'use client'

import React, { useId, useRef } from 'react'
import { clsx } from '@shared/lib/clsx'
import { Button } from '../button'
import styles from './file-uploader.module.scss'

export type FileUploaderProps = {
  value?: string[]
  onChange?: (fileNames: string[], files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  accept?: string
  disabled?: boolean
  className?: string
  buttonLabel?: string
  clearLabel?: string
  name?: string
  /** Подсказка под контролом */
  hint?: React.ReactNode
}

/**
 * Загрузчик файлов для анкет (как photo в /pa):
 * в ответе храним имена файлов; сами File доступны во втором аргументе onChange.
 */
export function FileUploader({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 1,
  accept,
  disabled = false,
  className,
  buttonLabel = 'Выбрать файл',
  clearLabel = 'Очистить',
  name,
  hint,
}: FileUploaderProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const limit = Math.max(1, maxFiles)
  const names = Array.isArray(value) ? value.map(String).filter(Boolean) : []

  const handlePick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list || list.length === 0) {
      onChange?.([], [])
      return
    }
    const files = Array.from(list).slice(0, limit)
    onChange?.(
      files.map((f) => f.name),
      files,
    )
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    onChange?.([], [])
  }

  return (
    <div className={clsx(styles.root, disabled && styles.disabled, className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple || limit > 1}
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
        {names.length > 0 ? (
          <>
            <span className={styles.fileName} title={names.join(', ')}>
              {names.join(', ')}
            </span>
            <button type="button" className={styles.clear} onClick={handleClear} disabled={disabled}>
              {clearLabel}
            </button>
          </>
        ) : (
          <span className={styles.placeholder}>Файл не выбран</span>
        )}
      </div>
      {hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  )
}

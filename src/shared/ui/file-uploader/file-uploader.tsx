'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { clsx } from '@shared/lib/clsx'
import { Button } from '../button'
import { Message, useToaster } from '../toaster'
import styles from './file-uploader.module.scss'

/** Лимит размера одного файла по умолчанию (фото в анкете) */
export const DEFAULT_MAX_FILE_BYTES = 30 * 1024 * 1024

export type FileUploaderProps = {
  value?: string[]
  onChange?: (fileNames: string[], files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  /** Макс. размер одного файла в байтах. @default 30 МБ */
  maxFileBytes?: number
  accept?: string
  disabled?: boolean
  className?: string
  buttonLabel?: string
  clearLabel?: string
  name?: string
  /** Подсказка под контролом */
  hint?: React.ReactNode
}

function formatMb(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return Number.isInteger(mb) ? String(mb) : mb.toFixed(1)
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

function isLikelyImageName(name: string): boolean {
  return /\.(jpe?g|png|gif|webp|bmp|heic|avif)$/i.test(name)
}

/**
 * Загрузчик файлов для анкет (как photo в /pa):
 * в ответе храним имена файлов; сами File доступны во втором аргументе onChange.
 * После выбора картинки — миниатюра (object URL).
 */
export function FileUploader({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 1,
  maxFileBytes = DEFAULT_MAX_FILE_BYTES,
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
  const toaster = useToaster()
  const limit = Math.max(1, maxFiles)
  const names = Array.isArray(value) ? value.map(String).filter(Boolean) : []
  const namesKey = names.join('\0')
  const [files, setFiles] = useState<File[]>([])
  /** blob-URL по имени файла; живут только пока есть локальные File */
  const [thumbByName, setThumbByName] = useState<Record<string, string>>({})

  // Внешняя очистка value → сброс локальных File
  useEffect(() => {
    if (namesKey === '' && files.length > 0) {
      setFiles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только namesKey: иначе цикл с files
  }, [namesKey])

  // objectURL только при смене files (не от names-массива каждый рендер)
  useEffect(() => {
    const created: Record<string, string> = {}
    for (const file of files) {
      if (isImageFile(file)) {
        created[file.name] = URL.createObjectURL(file)
      }
    }
    setThumbByName(created)
    return () => {
      for (const url of Object.values(created)) URL.revokeObjectURL(url)
    }
  }, [files])

  const previews = useMemo(() => {
    if (files.length > 0) {
      return files.map((file) => ({
        name: file.name,
        url: thumbByName[file.name] ?? null,
        isImage: isImageFile(file),
      }))
    }
    return names.map((n) => ({
      name: n,
      url: null as string | null,
      isImage: isLikelyImageName(n),
    }))
  }, [files, names, thumbByName])

  const handlePick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list || list.length === 0) {
      setFiles([])
      onChange?.([], [])
      return
    }

    const picked = Array.from(list).slice(0, limit)
    const accepted: File[] = []
    const rejected: File[] = []

    for (const file of picked) {
      if (maxFileBytes > 0 && file.size > maxFileBytes) rejected.push(file)
      else accepted.push(file)
    }

    if (rejected.length > 0) {
      const limitLabel = formatMb(maxFileBytes)
      const namesList = rejected.map((f) => f.name).join(', ')
      toaster.push(
        <Message type="error" header="Файл слишком большой">
          {rejected.length === 1
            ? `«${namesList}» больше ${limitLabel} МБ. Выберите файл меньшего размера.`
            : `Файлы больше ${limitLabel} МБ не приняты: ${namesList}`}
        </Message>,
        { duration: 5000 },
      )
      if (inputRef.current) inputRef.current.value = ''
    }

    if (accepted.length === 0) {
      setFiles([])
      onChange?.([], [])
      return
    }

    setFiles(accepted)
    onChange?.(
      accepted.map((f) => f.name),
      accepted,
    )
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    setFiles([])
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

      {previews.length > 0 ? (
        <ul className={styles.thumbs} aria-label="Превью файлов">
          {previews.map((item) => (
            <li key={item.name} className={styles.thumbItem}>
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob: object URL
                <img src={item.url} alt={item.name} className={styles.thumbImg} />
              ) : (
                <div
                  className={clsx(styles.thumbFallback, item.isImage && styles.thumbFallbackImage)}
                  title={item.name}
                >
                  <span className={styles.thumbExt}>
                    {item.isImage ? 'IMG' : item.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </span>
                </div>
              )}
              <span className={styles.thumbName} title={item.name}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  )
}

'use client'

import { useEffect } from 'react'

import { FormField } from '@/shared/ui/form-field'
import { Input, Textarea } from '@/shared/ui/input'
import { CheckPicker, SelectPicker } from '@/shared/ui/picker'
import { RadioGroup } from '@/shared/ui/radio'
import { FileUploader } from '@/shared/ui/file-uploader'
import { TimeInput, toTimeInputValue } from '@/shared/ui/time-input'
import type { PublicPaOptionsItem, PublicPaOption, PublicPaQuestion } from '@/entities/public-pa'
import {
  getConfigString,
  isRadioQuestionType,
  isSingleQuestionType,
  normalizeQuestionType,
  questionAnswerKey,
  resolveChoiceUi,
} from '@/entities/public-pa'

import {
  getVisibleOptionsWithCompletedFallback,
  isCompletedOptionHidden,
  shouldHideCompletedInLoop,
} from '../lib/cascade-completion'
import type { AnswersMap } from '../lib/answer-model'
import { RankOrderEditor } from './rank-order-editor'
import styles from './question-field.module.scss'

type MatrixRow = { id?: string; label?: string }
type MatrixColumn = { id?: string; label?: string }

type QuestionFieldProps = {
  question: PublicPaQuestion
  value: unknown
  answers: AnswersMap
  completedValuesByCode: Record<string, string[]>
  dynamicOptions?: PublicPaOptionsItem[]
  /** Реальный fetch options; не путать с «ещё нет списка» */
  isOptionsLoading?: boolean
  allowCompletedFallback?: boolean
  isDriverForCascade?: boolean
  readOnly?: boolean
  /** Сообщение RHF / yup */
  error?: string
  onChange: (next: unknown) => void
}

function fieldMeta(question: PublicPaQuestion, error?: string, hint?: string | null) {
  return {
    label: question.title,
    required: question.required,
    error: error || undefined,
    hint: error ? undefined : hint || question.description || undefined,
  }
}

function toPickerData(options: Array<{ value: string; label: string }>) {
  return options.map((o) => ({ value: o.value, label: o.label }))
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}

function applyExclusiveMultiChange(
  options: PublicPaOption[],
  prev: string[],
  next: Array<string | number>,
): string[] {
  const nextValues = next.map(String)
  const exclusiveValues = new Set(
    options.filter((item) => item.isExclusive || item.isNA).map((item) => String(item.value)),
  )
  const added = nextValues.find((item) => !prev.includes(item))
  if (added && exclusiveValues.has(added)) return [added]
  return nextValues.filter((item) => !exclusiveValues.has(item) || item === added)
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toIsoDateTimeLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${hh}:${mm}`
}

function MatrixField({
  question,
  value,
  readOnly,
  error,
  onChange,
}: {
  question: PublicPaQuestion
  value: unknown
  readOnly: boolean
  error?: string
  onChange: (next: unknown) => void
}) {
  const cfg = question.config ?? {}
  const table = (cfg.table as Record<string, unknown> | undefined) ?? {}
  const rows = (Array.isArray(table.rows) ? table.rows : []) as MatrixRow[]
  const columns = (Array.isArray(table.columns) ? table.columns : []) as MatrixColumn[]
  const fieldType = typeof table.fieldType === 'string' ? table.fieldType : 'radio'
  const maxPerRow = typeof table.maxPerRow === 'number' ? table.maxPerRow : 1
  const matrixValue =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  // Кабинет: radio/single → SelectPicker по строке (удобнее на мобиле)
  const useRowSelect =
    isRadioQuestionType(fieldType) || isSingleQuestionType(fieldType) || !fieldType

  if (useRowSelect && columns.length > 0) {
    const columnOptions = columns.map((column, colIdx) => {
      const colKey = String(column.id || column.label || `col_${colIdx + 1}`)
      return { value: colKey, label: String(column.label ?? `Колонка ${colIdx + 1}`) }
    })
    return (
      <FormField {...fieldMeta(question, error)}>
        <div className={styles.matrixStack}>
          {rows.map((row, rowIdx) => {
            const rowKey = String(row.id || row.label || `row_${rowIdx + 1}`)
            const rowLabel = String(row.label ?? `Строка ${rowIdx + 1}`)
            const rowValue = matrixValue[rowKey]
            const stringRow =
              typeof rowValue === 'string' || typeof rowValue === 'number' ? String(rowValue) : ''
            return (
              <div key={rowKey} className={styles.matrixRow}>
                <div className={styles.matrixRowLabel}>{rowLabel}</div>
                <SelectPicker
                  block
                  cleanable={!readOnly}
                  disabled={readOnly}
                  searchable={columnOptions.length > 8}
                  placeholder="Выберите…"
                  data={columnOptions}
                  value={stringRow || null}
                  error={error}
                  onChange={(next) => {
                    if (readOnly) return
                    onChange({ ...matrixValue, [rowKey]: next == null ? null : String(next) })
                  }}
                />
              </div>
            )
          })}
        </div>
      </FormField>
    )
  }

  return (
    <FormField {...fieldMeta(question, error)}>
      <div className={styles.matrixScroll}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th />
              {columns.map((column, colIdx) => (
                <th key={`col-${colIdx}`}>{column.label ?? `Колонка ${colIdx + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const rowKey = String(row.id || row.label || `row_${rowIdx + 1}`)
              const rowValue = matrixValue[rowKey]
              return (
                <tr key={rowKey}>
                  <td>{row.label ?? `Строка ${rowIdx + 1}`}</td>
                  {columns.map((column, colIdx) => {
                    const colKey = String(column.id || column.label || `col_${colIdx + 1}`)
                    if (fieldType === 'checkbox' || fieldType === 'checkbox_limited') {
                      const values = asStringList(rowValue)
                      const checked = values.includes(colKey)
                      return (
                        <td key={`${rowKey}-${colKey}`} className={styles.matrixCell}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={readOnly}
                            onChange={(e) => {
                              if (readOnly) return
                              const nextSet = new Set(values)
                              if (e.target.checked) nextSet.add(colKey)
                              else nextSet.delete(colKey)
                              let next = Array.from(nextSet)
                              if (fieldType === 'checkbox_limited') {
                                next = next.slice(0, Math.max(1, Math.trunc(maxPerRow)))
                              }
                              onChange({ ...matrixValue, [rowKey]: next })
                            }}
                          />
                        </td>
                      )
                    }
                    if (fieldType === 'text' || fieldType === 'number') {
                      return colIdx === 0 ? (
                        <td key={`${rowKey}-${colKey}`} className={styles.matrixCell}>
                          <Input
                            block
                            type={fieldType === 'number' ? 'number' : 'text'}
                            value={
                              typeof rowValue === 'string' || typeof rowValue === 'number'
                                ? String(rowValue)
                                : ''
                            }
                            disabled={readOnly}
                            readOnly={readOnly}
                            onChange={(e) => {
                              if (readOnly) return
                              onChange({ ...matrixValue, [rowKey]: e.target.value })
                            }}
                          />
                        </td>
                      ) : (
                        <td key={`${rowKey}-${colKey}`} />
                      )
                    }
                    return (
                      <td key={`${rowKey}-${colKey}`} className={styles.matrixCell}>
                        <input
                          type="radio"
                          name={`matrix-${question.id}-${rowKey}`}
                          checked={String(rowValue ?? '') === colKey}
                          disabled={readOnly}
                          onChange={() => {
                            if (readOnly) return
                            onChange({ ...matrixValue, [rowKey]: colKey })
                          }}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </FormField>
  )
}

export function QuestionField({
  question,
  value,
  answers,
  completedValuesByCode,
  dynamicOptions,
  isOptionsLoading = false,
  allowCompletedFallback = false,
  isDriverForCascade = false,
  readOnly = false,
  error,
  onChange,
}: QuestionFieldProps) {
  const type = normalizeQuestionType(question.type, question.config ?? null)
  const code = questionAnswerKey(question)
  const meta = (hint?: string | null) => fieldMeta(question, error, hint)
  const staticOptions = (question.options || []).map((o) => ({
    value: String(o.value),
    label: o.label,
    id: o.value,
    isExclusive: o.isExclusive,
    isNA: o.isNA,
  }))
  const sourceOptions =
    dynamicOptions && dynamicOptions.length > 0
      ? dynamicOptions.map((o, idx) => ({
          value: String(o.value),
          label: o.label,
          id: `dyn-${idx}-${o.value}`,
          isExclusive: false,
          isNA: false,
        }))
      : staticOptions

  const shouldSkipCompleted = shouldHideCompletedInLoop(question.config, isDriverForCascade)
  const completedKeys = completedValuesByCode[code] ?? []
  const { visibleOptions, hiddenCount, usedFallback } = getVisibleOptionsWithCompletedFallback({
    options: sourceOptions,
    shouldSkipCompleted,
    allowFallbackWhenAllHidden: allowCompletedFallback,
    isHidden: (option) =>
      isCompletedOptionHidden(question.config, answers, option.value, completedKeys),
  })

  const pickerData = toPickerData(visibleOptions)
  const optionsLoading = isOptionsLoading && visibleOptions.length === 0
  const stringValue = value == null ? '' : String(value)
  const choiceUi = resolveChoiceUi(question.type, question.config)
  const completedHint =
    hiddenCount > 0
      ? `Уже отправлено: ${hiddenCount} из ${sourceOptions.length}${usedFallback ? '. Показаны все варианты.' : ''}`
      : undefined

  const valueInVisibleOptions =
    !stringValue || visibleOptions.some((option) => String(option.value) === stringValue)
  const selectDisplayValue =
    stringValue && (valueInVisibleOptions || readOnly) ? stringValue : null
  const checkDisplayValues = readOnly
    ? asStringList(value)
    : asStringList(value).filter((item) =>
        visibleOptions.some((option) => String(option.value) === item),
      )

  const pickerDataWithValue =
    readOnly && selectDisplayValue && !valueInVisibleOptions
      ? [...pickerData, { value: selectDisplayValue, label: selectDisplayValue }]
      : pickerData

  useEffect(() => {
    if (readOnly || optionsLoading) return
    if (choiceUi === 'single' || choiceUi === 'radio') {
      if (stringValue && !valueInVisibleOptions) onChange(null)
      return
    }
    if (choiceUi === 'check') {
      const selected = asStringList(value)
      if (selected.length === 0) return
      const allowed = new Set(visibleOptions.map((option) => String(option.value)))
      const next = selected.filter((item) => allowed.has(item))
      if (next.length !== selected.length) onChange(next)
    }
  }, [
    readOnly,
    optionsLoading,
    choiceUi,
    stringValue,
    valueInVisibleOptions,
    value,
    visibleOptions,
    onChange,
  ])

  if (type === 'intro') {
    return (
      <FormField {...meta()}>
        <p className={styles.introText}>
          {String(question.config?.text ?? question.description ?? '')}
        </p>
      </FormField>
    )
  }

  if (type === 'boolean') {
    return (
      <FormField {...meta()}>
        <label className={styles.inlineCheck}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            disabled={readOnly}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>Да</span>
        </label>
      </FormField>
    )
  }

  if (type === 'matrix') {
    return (
      <MatrixField
        question={question}
        value={value}
        readOnly={readOnly}
        error={error}
        onChange={onChange}
      />
    )
  }

  if (type === 'rank') {
    const opts = (question.options?.length ? question.options : sourceOptions).map((o, idx) => ({
      id: String(('id' in o && o.id) || `rank-${idx}-${o.value}`),
      label: o.label,
      value: String(o.value),
    }))
    return (
      <FormField {...meta()}>
        <RankOrderEditor
          options={opts}
          value={asStringList(value)}
          disabled={readOnly}
          onChange={(next) => {
            if (readOnly) return
            onChange(next)
          }}
        />
      </FormField>
    )
  }

  if (type === 'photo') {
    const cfg = question.config ?? {}
    const maxFiles =
      typeof cfg.photoMax === 'number'
        ? cfg.photoMax
        : typeof cfg.maxFiles === 'number'
          ? cfg.maxFiles
          : 1
    const limit = Math.max(1, maxFiles)
    return (
      <FormField {...meta()}>
        <FileUploader
          value={asStringList(value)}
          multiple={limit > 1}
          maxFiles={limit}
          disabled={readOnly}
          accept="image/*,.pdf"
          buttonLabel={limit > 1 ? 'Выбрать файлы' : 'Выбрать файл'}
          hint={`Максимум файлов: ${limit}. Размер одного файла — до 30 МБ`}
          onChange={(names) => {
            if (readOnly) return
            onChange(names)
          }}
        />
      </FormField>
    )
  }

  if (choiceUi === 'check') {
    const selected = checkDisplayValues
    return (
      <FormField {...meta(completedHint || question.description)}>
        <CheckPicker
          block
          cleanable={!readOnly}
          disabled={readOnly}
          loading={optionsLoading}
          searchable
          placeholder={optionsLoading ? 'Загрузка…' : 'Выберите…'}
          data={pickerDataWithValue}
          value={selected}
          error={error}
          onChange={(next) => {
            if (readOnly) return
            onChange(applyExclusiveMultiChange(question.options || [], selected, next || []))
          }}
        />
      </FormField>
    )
  }

  if (choiceUi === 'radio') {
    return (
      <FormField {...meta(completedHint || question.description)}>
        <RadioGroup
          name={code}
          block
          size="md"
          disabled={readOnly || optionsLoading}
          error={error}
          value={selectDisplayValue}
          options={pickerDataWithValue.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onChange={(next) => {
            if (readOnly) return
            onChange(String(next))
          }}
        />
      </FormField>
    )
  }

  if (choiceUi === 'single') {
    return (
      <FormField {...meta(completedHint || question.description)}>
        <SelectPicker
          block
          cleanable={!readOnly}
          disabled={readOnly}
          loading={optionsLoading}
          searchable
          placeholder={optionsLoading ? 'Загрузка…' : 'Выберите…'}
          data={pickerDataWithValue}
          value={selectDisplayValue}
          error={error}
          onChange={(next) => {
            if (readOnly) return
            onChange(next == null ? null : String(next))
          }}
        />
      </FormField>
    )
  }

  if (type === 'scale') {
    const cfg = question.config ?? {}
    const min = typeof cfg.min === 'number' ? cfg.min : 1
    const max = typeof cfg.max === 'number' ? cfg.max : 5
    const step = typeof cfg.step === 'number' ? cfg.step : 1
    const ui = getConfigString(cfg, 'ui') ?? 'slider'
    const minLabel = typeof cfg.minLabel === 'string' ? cfg.minLabel : ''
    const maxLabel = typeof cfg.maxLabel === 'string' ? cfg.maxLabel : ''
    const scaleOptions = Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => ({
      value: String(min + i * step),
      label: String(min + i * step),
    }))
    if (ui === 'select' || ui === 'selectpicker' || ui === 'single') {
      return (
        <FormField {...meta()}>
          <SelectPicker
            block
            cleanable={!readOnly}
            disabled={readOnly}
            placeholder="Выберите…"
            data={scaleOptions}
            value={stringValue || null}
            error={error}
            onChange={(next) => {
              if (readOnly) return
              onChange(next == null ? null : String(next))
            }}
          />
        </FormField>
      )
    }
    const rangeValue = Number(String(value ?? min).replace(',', '.'))
    return (
      <FormField {...meta()}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          disabled={readOnly}
          value={Number.isFinite(rangeValue) ? rangeValue : min}
          onChange={(e) => onChange(String(e.target.value))}
          className={styles.range}
        />
        <div className={styles.scaleLabels}>
          <span>{minLabel || min}</span>
          <span>{maxLabel || max}</span>
        </div>
      </FormField>
    )
  }

  if (type === 'nps') {
    const cfg = question.config ?? {}
    const minLabel =
      typeof cfg.minLabel === 'string' ? cfg.minLabel : 'Совсем не рекомендую'
    const maxLabel = typeof cfg.maxLabel === 'string' ? cfg.maxLabel : 'Точно рекомендую'
    const npsValue = typeof value === 'string' || typeof value === 'number' ? String(value) : ''
    return (
      <FormField {...meta()}>
        <div className={styles.npsGrid}>
          {Array.from({ length: 11 }, (_, i) => String(i)).map((item) => (
            <button
              key={item}
              type="button"
              disabled={readOnly}
              className={npsValue === item ? styles.npsBtnActive : styles.npsBtn}
              onClick={() => {
                if (readOnly) return
                onChange(item)
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className={styles.scaleLabels}>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </FormField>
    )
  }

  if (type === 'long_text' || type.includes('area') || type === 'textarea') {
    return (
      <FormField {...meta()}>
        <Textarea
          block
          rows={4}
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          error={error}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField>
    )
  }

  if (type === 'number' || type === 'money' || type === 'integer' || type === 'decimal') {
    return (
      <FormField {...meta()}>
        <Input
          block
          type="number"
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          placeholder={type === 'money' ? '0.00' : '0'}
          error={error}
          onChange={(e) => {
            const raw = e.target.value
            if (!raw.trim()) {
              onChange(null)
              return
            }
            const num = Number(raw.replace(',', '.'))
            onChange(Number.isFinite(num) ? num : raw)
          }}
        />
      </FormField>
    )
  }

  if (type === 'date') {
    const raw = typeof value === 'string' ? value : ''
    const datePart = raw.includes('T') ? raw.slice(0, 10) : raw.slice(0, 10)
    return (
      <FormField {...meta()}>
        <Input
          block
          type="date"
          value={datePart}
          disabled={readOnly}
          readOnly={readOnly}
          error={error}
          onChange={(e) => {
            const v = e.target.value
            if (!v) {
              onChange(null)
              return
            }
            onChange(toIsoDate(new Date(`${v}T00:00:00`)))
          }}
        />
      </FormField>
    )
  }

  if (type === 'time') {
    return (
      <FormField {...meta()}>
        <TimeInput
          block
          value={toTimeInputValue(value)}
          disabled={readOnly}
          readOnly={readOnly}
          error={error}
          onChangeValue={(next) => {
            if (readOnly) return
            onChange(next)
          }}
        />
      </FormField>
    )
  }

  if (type === 'datetime') {
    const raw = typeof value === 'string' ? value : ''
    let local = ''
    if (raw) {
      const d = new Date(raw)
      if (!Number.isNaN(d.getTime())) local = toIsoDateTimeLocal(d)
    }
    return (
      <FormField {...meta()}>
        <Input
          block
          type="datetime-local"
          value={local}
          disabled={readOnly}
          readOnly={readOnly}
          error={error}
          onChange={(e) => {
            const v = e.target.value
            if (!v) {
              onChange(null)
              return
            }
            const d = new Date(v)
            onChange(Number.isNaN(d.getTime()) ? v : d.toISOString())
          }}
        />
      </FormField>
    )
  }

  if (
    type === 'email' ||
    type === 'phone' ||
    type === 'text' ||
    type === 'short_text' ||
    type === 'string'
  ) {
    return (
      <FormField {...meta()}>
        <Input
          block
          type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          error={error}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField>
    )
  }

  return (
    <FormField {...meta()}>
      <p className={styles.unsupported}>Тип «{question.type}» пока не поддержан</p>
    </FormField>
  )
}

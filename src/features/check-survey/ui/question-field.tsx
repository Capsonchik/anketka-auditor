'use client'

import { FormField } from '@/shared/ui/form-field'
import { Input, Textarea } from '@/shared/ui/input'
import { CheckPicker, SelectPicker } from '@/shared/ui/picker'
import { PillSwitchFlexible } from '@/shared/ui/pill-switch-flexible'
import { FileUploader } from '@/shared/ui/file-uploader'
import type { PublicPaOptionsItem, PublicPaOption, PublicPaQuestion } from '@/entities/public-pa'
import { getConfigString, questionAnswerKey } from '@/entities/public-pa'

import {
  getVisibleOptionsWithCompletedFallback,
  isCompletedOptionHidden,
  shouldHideCompletedInLoop,
} from '../lib/cascade-completion'
import type { AnswersMap } from '../lib/answer-model'
import { RankOrderEditor } from './rank-order-editor'
import styles from './question-field.module.scss'

type ChoiceUi = 'select' | 'check' | 'radio'

type MatrixRow = { id?: string; label?: string }
type MatrixColumn = { id?: string; label?: string }

type QuestionFieldProps = {
  question: PublicPaQuestion
  value: unknown
  answers: AnswersMap
  completedValuesByCode: Record<string, string[]>
  dynamicOptions?: PublicPaOptionsItem[]
  allowCompletedFallback?: boolean
  isDriverForCascade?: boolean
  readOnly?: boolean
  onChange: (next: unknown) => void
}

function resolveChoiceUi(type: string, config: Record<string, unknown> | null): ChoiceUi | null {
  const uiRaw = getConfigString(config, 'ui')?.toLowerCase() ?? null
  if (uiRaw === 'radio') return 'radio'
  if (uiRaw === 'select' || uiRaw === 'selectpicker') return 'select'
  if (uiRaw === 'check' || uiRaw === 'checkbox' || uiRaw === 'checkpicker') return 'check'

  if (type === 'radio') return 'radio'
  if (
    type === 'multi_choice' ||
    type === 'multiselect' ||
    type === 'checkbox' ||
    type === 'check'
  ) {
    return 'check'
  }
  if (type === 'select' || type === 'single_choice' || type === 'dropdown') return 'select'
  return null
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
  onChange,
}: {
  question: PublicPaQuestion
  value: unknown
  readOnly: boolean
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

  // Кабинет: radio/select → SelectPicker по строке (удобнее на мобиле); иначе таблица как /pa
  const useRowSelect = fieldType === 'radio' || fieldType === 'select' || !fieldType

  if (useRowSelect && columns.length > 0) {
    const columnOptions = columns.map((column, colIdx) => {
      const colKey = String(column.id || column.label || `col_${colIdx + 1}`)
      return { value: colKey, label: String(column.label ?? `Колонка ${colIdx + 1}`) }
    })
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
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
    <FormField label={question.title} required={question.required} hint={question.description || undefined}>
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
  allowCompletedFallback = false,
  isDriverForCascade = false,
  readOnly = false,
  onChange,
}: QuestionFieldProps) {
  const type = String(question.type || '').toLowerCase()
  const code = questionAnswerKey(question)
  const hasDynamicSource = Boolean(getConfigString(question.config, 'source'))
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
  const optionsLoading = hasDynamicSource && (!dynamicOptions || dynamicOptions.length === 0)
  const stringValue = value == null ? '' : String(value)
  const choiceUi = resolveChoiceUi(type, question.config)
  const completedHint =
    hiddenCount > 0
      ? `Уже отправлено: ${hiddenCount} из ${sourceOptions.length}${usedFallback ? '. Показаны все варианты.' : ''}`
      : undefined

  if (type === 'intro') {
    return (
      <FormField label={question.title} hint={question.description || undefined}>
        <p className={styles.introText}>
          {String(question.config?.text ?? question.description ?? '')}
        </p>
      </FormField>
    )
  }

  if (type === 'boolean') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
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
    return <MatrixField question={question} value={value} readOnly={readOnly} onChange={onChange} />
  }

  if (type === 'rank') {
    const opts = (question.options?.length ? question.options : sourceOptions).map((o, idx) => ({
      id: String(('id' in o && o.id) || `rank-${idx}-${o.value}`),
      label: o.label,
      value: String(o.value),
    }))
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <FileUploader
          value={asStringList(value)}
          multiple={limit > 1}
          maxFiles={limit}
          disabled={readOnly}
          accept="image/*,.pdf"
          buttonLabel={limit > 1 ? 'Выбрать файлы' : 'Выбрать файл'}
          hint={`Максимум файлов: ${limit}`}
          onChange={(names) => {
            if (readOnly) return
            onChange(names)
          }}
        />
      </FormField>
    )
  }

  if (choiceUi === 'check') {
    const selected = asStringList(value)
    return (
      <FormField
        label={question.title}
        required={question.required}
        hint={completedHint || question.description || undefined}
      >
        <CheckPicker
          block
          cleanable={!readOnly}
          disabled={readOnly}
          loading={optionsLoading}
          searchable
          placeholder={optionsLoading ? 'Загрузка…' : 'Выберите…'}
          data={pickerData}
          value={selected}
          onChange={(next) => {
            if (readOnly) return
            onChange(applyExclusiveMultiChange(question.options || [], selected, next || []))
          }}
        />
      </FormField>
    )
  }

  if (choiceUi === 'radio') {
    if (visibleOptions.length > 0 && visibleOptions.length <= 8) {
      return (
        <FormField
          label={question.title}
          required={question.required}
          hint={completedHint || question.description || undefined}
        >
          <PillSwitchFlexible
            name={code}
            size="small"
            disabled={readOnly}
            data={pickerData}
            value={stringValue}
            onChange={(next) => {
              if (readOnly) return
              onChange(String(next))
            }}
          />
        </FormField>
      )
    }
    return (
      <FormField
        label={question.title}
        required={question.required}
        hint={completedHint || question.description || undefined}
      >
        <div className={styles.radioGroup}>
          {visibleOptions.map((option) => (
            <label key={option.value} className={styles.inlineCheck}>
              <input
                type="radio"
                name={code}
                value={option.value}
                checked={stringValue === option.value}
                disabled={readOnly}
                onChange={() => {
                  if (readOnly) return
                  onChange(option.value)
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </FormField>
    )
  }

  if (choiceUi === 'select') {
    return (
      <FormField
        label={question.title}
        required={question.required}
        hint={completedHint || question.description || undefined}
      >
        <SelectPicker
          block
          cleanable={!readOnly}
          disabled={readOnly}
          loading={optionsLoading}
          searchable
          placeholder={optionsLoading ? 'Загрузка…' : 'Выберите…'}
          data={pickerData}
          value={stringValue || null}
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
    if (ui === 'select' || ui === 'selectpicker') {
      return (
        <FormField label={question.title} required={question.required} hint={question.description || undefined}>
          <SelectPicker
            block
            cleanable={!readOnly}
            disabled={readOnly}
            placeholder="Выберите…"
            data={scaleOptions}
            value={stringValue || null}
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Textarea
          block
          rows={4}
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField>
    )
  }

  if (type === 'number' || type === 'money' || type === 'integer' || type === 'decimal') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input
          block
          type="number"
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          placeholder={type === 'money' ? '0.00' : '0'}
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input
          block
          type="date"
          value={datePart}
          disabled={readOnly}
          readOnly={readOnly}
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

  if (type === 'datetime') {
    const raw = typeof value === 'string' ? value : ''
    let local = ''
    if (raw) {
      const d = new Date(raw)
      if (!Number.isNaN(d.getTime())) local = toIsoDateTimeLocal(d)
    }
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input
          block
          type="datetime-local"
          value={local}
          disabled={readOnly}
          readOnly={readOnly}
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input
          block
          type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField>
    )
  }

  return (
    <FormField label={question.title} required={question.required} hint={question.description || undefined}>
      <p className={styles.unsupported}>Тип «{question.type}» пока не поддержан</p>
    </FormField>
  )
}

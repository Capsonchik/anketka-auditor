'use client'

import { FormField } from '@/shared/ui/form-field'
import { Input, Textarea } from '@/shared/ui/input'
import { CheckPicker, SelectPicker } from '@/shared/ui/picker'
import { PillSwitchFlexible } from '@/shared/ui/pill-switch-flexible'
import type { PublicPaOptionsItem, PublicPaOption, PublicPaQuestion } from '@/entities/public-pa'
import { getConfigBoolean, getConfigString, questionAnswerKey } from '@/entities/public-pa'

import {
  getVisibleOptionsWithCompletedFallback,
  isCompletedOptionHidden,
} from '../lib/cascade-completion'
import type { AnswersMap } from '../lib/answer-model'

type ChoiceUi = 'select' | 'check' | 'radio'

type QuestionFieldProps = {
  question: PublicPaQuestion
  value: unknown
  answers: AnswersMap
  completedValuesByCode: Record<string, string[]>
  dynamicOptions?: PublicPaOptionsItem[]
  allowCompletedFallback?: boolean
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

export function QuestionField({
  question,
  value,
  answers,
  completedValuesByCode,
  dynamicOptions,
  allowCompletedFallback = false,
  readOnly = false,
  onChange,
}: QuestionFieldProps) {
  const type = String(question.type || '').toLowerCase()
  const code = questionAnswerKey(question)
  const hasDynamicSource = Boolean(getConfigString(question.config, 'source'))
  const staticOptions = (question.options || []).map((o) => ({
    value: String(o.value),
    label: o.label,
    isExclusive: o.isExclusive,
    isNA: o.isNA,
  }))
  const sourceOptions =
    dynamicOptions && dynamicOptions.length > 0
      ? dynamicOptions.map((o) => ({
          value: String(o.value),
          label: o.label,
          isExclusive: false,
          isNA: false,
        }))
      : staticOptions

  const shouldSkipCompleted = getConfigBoolean(question.config, 'skipCompletedInLoop')
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

  if (type === 'boolean') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            disabled={readOnly}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{question.description || 'Да'}</span>
        </label>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleOptions.map((option) => (
            <label key={option.value} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
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
          style={{ width: '100%' }}
        />
      </FormField>
    )
  }

  if (type === 'nps') {
    const npsValue = typeof value === 'string' || typeof value === 'number' ? String(value) : ''
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gap: 6 }}>
          {Array.from({ length: 11 }, (_, i) => String(i)).map((item) => (
            <button
              key={item}
              type="button"
              disabled={readOnly}
              onClick={() => {
                if (readOnly) return
                onChange(item)
              }}
              style={{
                border:
                  npsValue === item ? '1px solid rgba(66, 170, 255, 0.8)' : '1px solid rgba(0,0,0,0.12)',
                borderRadius: 8,
                background: npsValue === item ? 'rgba(66, 170, 255, 0.14)' : 'rgba(255,255,255,0.9)',
                minHeight: 36,
                cursor: readOnly ? 'default' : 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </FormField>
    )
  }

  if (type.includes('area') || type === 'textarea' || type === 'long_text') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Textarea
          block
          rows={3}
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.description || undefined}
        />
      </FormField>
    )
  }

  if (type.includes('number') || type === 'integer' || type === 'decimal' || type === 'money') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input
          block
          type="number"
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
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

  if (type === 'date' || type === 'datetime') {
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <Input
          block
          type={type === 'datetime' ? 'datetime-local' : 'date'}
          value={stringValue}
          disabled={readOnly}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField>
    )
  }

  if (type === 'intro') {
    return (
      <FormField label={question.title} hint={question.description || undefined}>
        <p style={{ margin: 0, color: 'inherit', opacity: 0.8 }}>
          {String(question.config?.text ?? question.description ?? '')}
        </p>
      </FormField>
    )
  }

  return (
    <FormField label={question.title} required={question.required} hint={question.description || undefined}>
      <Input
        block
        value={stringValue}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormField>
  )
}

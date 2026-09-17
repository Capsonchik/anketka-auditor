'use client'

import { FormField } from '@/shared/ui/form-field'
import { Input, Textarea } from '@/shared/ui/input'
import { SelectPicker } from '@/shared/ui/picker'
import { PillSwitchFlexible } from '@/shared/ui/pill-switch-flexible'
import type { PublicPaOptionsItem, PublicPaQuestion } from '@/entities/public-pa'
import { getConfigBoolean, questionAnswerKey } from '@/entities/public-pa'

import {
  getVisibleOptionsWithCompletedFallback,
  isCompletedOptionHidden,
} from '../lib/cascade-completion'
import type { AnswersMap } from '../lib/answer-model'

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

function toSelectItems(options: Array<{ value: string; label: string }>) {
  return options.map((o) => ({ value: o.value, label: o.label }))
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
  const staticOptions = (question.options || []).map((o) => ({
    value: o.value,
    label: o.label,
  }))
  const sourceOptions =
    dynamicOptions && dynamicOptions.length > 0
      ? dynamicOptions.map((o) => ({ value: o.value, label: o.label }))
      : staticOptions

  const shouldSkipCompleted = getConfigBoolean(question.config, 'skipCompletedInLoop')
  const completedKeys = completedValuesByCode[code] ?? []
  const { visibleOptions } = getVisibleOptionsWithCompletedFallback({
    options: sourceOptions,
    shouldSkipCompleted,
    allowFallbackWhenAllHidden: allowCompletedFallback,
    isHidden: (option) =>
      isCompletedOptionHidden(question.config, answers, option.value, completedKeys),
  })

  const stringValue = value == null ? '' : String(value)
  const isChoice =
    type.includes('single') ||
    type === 'radio' ||
    type === 'select' ||
    type.includes('choice') ||
    (visibleOptions.length > 0 &&
      (type === 'select' || type === 'single_choice' || visibleOptions.length <= 12))

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

  if (type === 'multi_choice') {
    const selected = Array.isArray(value) ? value.map(String) : []
    return (
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleOptions.map((option) => {
            const checked = selected.includes(option.value)
            return (
              <label key={option.value} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={readOnly}
                  onChange={() => {
                    if (readOnly) return
                    if (checked) onChange(selected.filter((item) => item !== option.value))
                    else onChange([...selected, option.value])
                  }}
                />
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      </FormField>
    )
  }

  if (isChoice && visibleOptions.length > 0) {
    if (visibleOptions.length <= 6) {
      return (
        <FormField label={question.title} required={question.required} hint={question.description || undefined}>
          <PillSwitchFlexible
            name={code}
            size="small"
            data={toSelectItems(visibleOptions)}
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
      <FormField label={question.title} required={question.required} hint={question.description || undefined}>
        <SelectPicker
          block
          cleanable={!readOnly}
          placeholder="Выберите"
          items={toSelectItems(visibleOptions)}
          value={stringValue || null}
          onChange={(next) => {
            if (readOnly) return
            onChange(next == null ? '' : String(next))
          }}
        />
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

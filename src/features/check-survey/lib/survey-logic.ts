type LogicConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains_any'
  | 'contains_all'
  | 'answered'
  | 'not_answered'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'

type LogicCondition = {
  kind: 'condition'
  questionCode: string
  operator: LogicConditionOperator
  value?: string
  values?: string[]
}

type LogicGroup = {
  kind: 'group'
  operator?: 'and' | 'or'
  not?: boolean
  items?: LogicNode[]
}

type LogicNode = LogicCondition | LogicGroup

type QuestionLike = {
  code?: string | null
  logic?: Record<string, unknown> | null
}

function toComparableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'))
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function hasAnswer(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0
  return Boolean(value)
}

function evaluateCondition(condition: LogicCondition, answers: Record<string, unknown>): boolean {
  const actual = answers[condition.questionCode]
  const operator = condition.operator
  if (operator === 'answered') return hasAnswer(actual)
  if (operator === 'not_answered') return !hasAnswer(actual)
  if (operator === 'contains_any' || operator === 'contains_all') {
    const expectedValues = (condition.values ?? []).map((item) => String(item))
    const actualValues = Array.isArray(actual) ? actual.map((item) => String(item)) : []
    if (operator === 'contains_all') {
      return expectedValues.length > 0 && expectedValues.every((item) => actualValues.includes(item))
    }
    return expectedValues.some((item) => actualValues.includes(item))
  }
  if (operator === 'gt' || operator === 'gte' || operator === 'lt' || operator === 'lte') {
    const left = toComparableNumber(actual)
    const right = toComparableNumber(condition.value)
    if (left === null || right === null) return false
    if (operator === 'gt') return left > right
    if (operator === 'gte') return left >= right
    if (operator === 'lt') return left < right
    return left <= right
  }
  const expected = String(condition.value ?? '')
  if (Array.isArray(actual)) {
    const actualValues = actual.map((item) => String(item))
    if (operator === 'equals') return actualValues.includes(expected)
    return !actualValues.includes(expected)
  }
  const actualValue = String(actual ?? '')
  if (operator === 'equals') return actualValue === expected
  return actualValue !== expected
}

function evaluateNode(node: LogicNode, answers: Record<string, unknown>): boolean {
  if (!node || typeof node !== 'object') return true
  if (node.kind === 'condition') {
    return evaluateCondition(node, answers)
  }
  const items = Array.isArray(node.items) ? node.items : []
  if (items.length === 0) return true
  const groupOperator = node.operator === 'or' ? 'or' : 'and'
  const evaluated = items.map((item) => evaluateNode(item, answers))
  const result = groupOperator === 'or' ? evaluated.some(Boolean) : evaluated.every(Boolean)
  return node.not ? !result : result
}

function getExpressionState(
  question: QuestionLike,
  key: 'show' | 'terminate',
): { expression: LogicNode | null; invert: boolean } {
  const logic = question.logic
  if (!logic || typeof logic !== 'object') return { expression: null, invert: false }
  const section = logic[key]
  if (!section || typeof section !== 'object') return { expression: null, invert: false }
  const sectionObject = section as Record<string, unknown>
  if (!sectionObject.enabled) return { expression: null, invert: false }
  const expression = sectionObject.expression
  if (!expression || typeof expression !== 'object') return { expression: null, invert: false }
  return {
    expression: expression as LogicNode,
    invert: Boolean(sectionObject.invert),
  }
}

export function isQuestionVisibleByLogic(
  question: QuestionLike,
  answers: Record<string, unknown>,
): boolean {
  const { expression, invert } = getExpressionState(question, 'show')
  if (!expression) return true
  const result = evaluateNode(expression, answers)
  return invert ? !result : result
}

export function shouldTerminateByLogic(
  question: QuestionLike,
  answers: Record<string, unknown>,
): boolean {
  const { expression, invert } = getExpressionState(question, 'terminate')
  if (!expression) return false
  const result = evaluateNode(expression, answers)
  return invert ? !result : result
}

export function isAnswerFilled(value: unknown): boolean {
  return hasAnswer(value)
}

/** Как isFilledRequired в /pa — с учётом типа вопроса */
export function isQuestionAnswerFilled(
  question: { type?: string | null; config?: Record<string, unknown> | null },
  value: unknown,
): boolean {
  const type = String(question.type || '').toLowerCase()
  if (type === 'intro') return true
  if (type === 'matrix') {
    const cfg = question.config ?? {}
    const table = (cfg.table as Record<string, unknown> | undefined) ?? {}
    const rows = Array.isArray(table.rows) ? (table.rows as Array<{ id?: string; label?: string }>) : []
    const fieldType = typeof table.fieldType === 'string' ? table.fieldType : 'radio'
    const matrixValue =
      value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null
    if (!matrixValue || rows.length === 0) return false
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i]
      const rowKey = row.id || row.label || `row_${i + 1}`
      const rowValue = matrixValue[rowKey]
      if (fieldType === 'checkbox' || fieldType === 'checkbox_limited') {
        if (!Array.isArray(rowValue) || rowValue.length === 0) return false
        continue
      }
      if (fieldType === 'text') {
        if (typeof rowValue !== 'string' || !rowValue.trim()) return false
        continue
      }
      if (fieldType === 'number') {
        if (typeof rowValue === 'number' && Number.isFinite(rowValue)) continue
        if (
          typeof rowValue === 'string' &&
          rowValue.trim() &&
          Number.isFinite(Number(rowValue.replace(',', '.')))
        ) {
          continue
        }
        return false
      }
      if (typeof rowValue !== 'string' || !rowValue.trim()) return false
    }
    return true
  }
  if (type === 'multi_choice' || type === 'multiselect' || type === 'checkbox') {
    return Array.isArray(value) && value.length > 0
  }
  if (type === 'rank') {
    return Array.isArray(value) && value.length > 0
  }
  if (type === 'photo') {
    return Array.isArray(value) && value.length > 0
  }
  if (type === 'nps' || type === 'scale') {
    return typeof value === 'string' && value.trim().length > 0
  }
  if (type === 'boolean') return value === true
  if (type === 'number' || type === 'money' || type === 'integer' || type === 'decimal') {
    return typeof value === 'number' && Number.isFinite(value)
  }
  if (type === 'datetime' || type === 'date') {
    return typeof value === 'string' && value.trim().length > 0
  }
  return hasAnswer(value)
}

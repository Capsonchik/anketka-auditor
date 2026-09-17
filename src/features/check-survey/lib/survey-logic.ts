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

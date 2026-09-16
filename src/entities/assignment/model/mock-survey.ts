export type SurveyStatus = 'assigned' | 'in_progress' | 'overdue' | 'completed'

export type SurveyAnswerValue = string | number | boolean | File | null

export type SurveyFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'unit'
  | 'date-range'
  | 'pill'
  | 'file'
  | 'textarea'
  | 'readonly'

export type SurveyFieldOption = {
  value: string
  label: string
}

export type SurveyField = {
  id: string
  type: SurveyFieldType
  label: string
  required?: boolean
  placeholder?: string
  options?: SurveyFieldOption[]
  unitOptions?: SurveyFieldOption[]
  accept?: string
  disabled?: boolean
  hint?: string
}

export type SurveySection = {
  id: string
  title: string
  kind: 'visit' | 'product' | 'store'
  fields: SurveyField[]
}

export type CheckSurveyDraft = {
  title: string
  storeName: string
  address: string
  city: string
  dueLabel: string
  status: SurveyStatus
  statusLabel: string
  visitStartedAt: string
  geolocation: string
  remainingSeconds: number
  sections: SurveySection[]
  initialAnswers: Record<string, SurveyAnswerValue>
}

const BRAND_OPTIONS: SurveyFieldOption[] = [
  { value: 'own_brand', label: 'Собственная марка' },
  { value: 'farmer', label: 'Фермерское' },
  { value: 'other', label: 'Другое' },
]

const UNIT_OPTIONS: SurveyFieldOption[] = [
  { value: 'kg', label: 'кг' },
  { value: 'g', label: 'г' },
  { value: 'l', label: 'л' },
  { value: 'ml', label: 'мл' },
  { value: 'pcs', label: 'шт' },
]

const PROMO_OPTIONS: SurveyFieldOption[] = [
  { value: 'discount_percent', label: 'Скидка %' },
  { value: 'buy_one_get_one', label: '2 по цене 1' },
  { value: 'no_promo', label: 'Нет промо' },
]

const AVAILABILITY_OPTIONS: SurveyFieldOption[] = [
  { value: 'in_stock', label: 'Есть на полке' },
  { value: 'out_of_stock', label: 'Нет на полке' },
  { value: 'not_in_store', label: 'Нет в магазине' },
]

const YES_NO_OPTIONS: SurveyFieldOption[] = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
]

/** Локальный мок анкеты KVI — без запросов к бэку. */
export const MOCK_CHECK_SURVEY: CheckSurveyDraft = {
  title: 'KVI-мониторинг (СОФ)',
  storeName: 'Перекрёсток',
  address: 'ул. Ленина 10',
  city: 'Москва',
  dueLabel: '01.08.2025, 14:00 МСК',
  status: 'in_progress',
  statusLabel: 'В РАБОТЕ',
  visitStartedAt: '01.08.2025 10:30',
  geolocation: '55.7558, 37.6173 (автоматически)',
  remainingSeconds: 5025,
  sections: [
    {
      id: 'visit',
      title: 'Общая информация по визиту',
      kind: 'visit',
      fields: [
        {
          id: 'visit_started_at',
          type: 'readonly',
          label: 'Время начала визита',
          disabled: true,
        },
        {
          id: 'geolocation',
          type: 'readonly',
          label: 'Геолокация',
          disabled: true,
        },
        {
          id: 'facade_photo',
          type: 'file',
          label: 'Фото фасада ТТ',
          accept: 'image/*',
        },
      ],
    },
    {
      id: 'product_apples',
      title: 'Товар: Яблоки Голден (KVI)',
      kind: 'product',
      fields: [
        {
          id: 'apples_name',
          type: 'text',
          label: 'Название на ценнике',
          required: true,
          placeholder: 'Введите название с ценника',
        },
        {
          id: 'apples_brand',
          type: 'select',
          label: 'Бренд',
          placeholder: 'Выберите бренд',
          options: BRAND_OPTIONS,
        },
        {
          id: 'apples_weight',
          type: 'unit',
          label: 'Вес/Объем',
          required: true,
          placeholder: 'Введите значение',
          unitOptions: UNIT_OPTIONS,
        },
        {
          id: 'apples_price',
          type: 'number',
          label: 'Цена регулярная',
          required: true,
          placeholder: 'Введите цену',
        },
        {
          id: 'apples_promo_price',
          type: 'number',
          label: 'Цена промо',
          placeholder: 'Введите промо-цену (если есть)',
        },
        {
          id: 'apples_promo_type',
          type: 'select',
          label: 'Тип промо',
          placeholder: 'Выберите тип промо',
          options: PROMO_OPTIONS,
        },
        {
          id: 'apples_promo_range',
          type: 'date-range',
          label: 'Срок действия промо (если есть)',
        },
        {
          id: 'apples_availability',
          type: 'pill',
          label: 'Наличие',
          required: true,
          options: AVAILABILITY_OPTIONS,
        },
        {
          id: 'apples_photo',
          type: 'file',
          label: 'Фото ценника/полки',
          required: true,
          accept: 'image/*',
        },
        {
          id: 'apples_comment',
          type: 'textarea',
          label: 'Комментарий',
          placeholder: 'Дополнительные комментарии',
        },
      ],
    },
    {
      id: 'product_milk',
      title: 'Товар: Молоко 3.2% (KVI)',
      kind: 'product',
      fields: [
        {
          id: 'milk_name',
          type: 'text',
          label: 'Название на ценнике',
          required: true,
          placeholder: 'Введите название с ценника',
        },
        {
          id: 'milk_availability',
          type: 'pill',
          label: 'Наличие',
          required: true,
          options: AVAILABILITY_OPTIONS,
        },
        {
          id: 'milk_photo',
          type: 'file',
          label: 'Фото пустой полки',
          required: true,
          accept: 'image/*',
        },
      ],
    },
    {
      id: 'store_questions',
      title: 'Общие вопросы по ТТ',
      kind: 'store',
      fields: [
        {
          id: 'cleanliness',
          type: 'pill',
          label: 'Чистота в торговом зале',
          required: true,
          options: YES_NO_OPTIONS,
        },
      ],
    },
  ],
  initialAnswers: {
    visit_started_at: '01.08.2025 10:30',
    geolocation: '55.7558, 37.6173 (автоматически)',
    facade_photo: null,
    apples_name: '',
    apples_brand: null,
    apples_weight: '',
    apples_weight_unit: 'kg',
    apples_price: '',
    apples_promo_price: '',
    apples_promo_type: null,
    apples_promo_from: '',
    apples_promo_to: '',
    apples_availability: 'in_stock',
    apples_photo: null,
    apples_comment: '',
    milk_name: '',
    milk_availability: 'out_of_stock',
    milk_photo: null,
    cleanliness: 'yes',
  },
}

export function getMockCheckSurvey(_checkId: string): CheckSurveyDraft {
  return { ...MOCK_CHECK_SURVEY }
}

export function isAnswerFilled(value: SurveyAnswerValue): boolean {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return !Number.isNaN(value)
  if (typeof value === 'boolean') return true
  if (typeof File !== 'undefined' && value instanceof File) return true
  return false
}

export function calcSurveyProgress(
  sections: SurveySection[],
  answers: Record<string, SurveyAnswerValue>,
): number {
  const required = sections.flatMap((s) => s.fields.filter((f) => f.required))
  if (required.length === 0) return 0
  const filled = required.filter((f) => isAnswerFilled(answers[f.id])).length
  return Math.round((filled / required.length) * 100)
}

export function formatRemaining(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const h = Math.floor(safe / 3600)
  const m = Math.floor((safe % 3600) / 60)
  const s = safe % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

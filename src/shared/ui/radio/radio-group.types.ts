export type RadioValue = string | number

export type RadioOption = {
  value: RadioValue
  label: string
  description?: string
  disabled?: boolean
}

export type RadioGroupProps = {
  name: string
  options: RadioOption[]
  value?: RadioValue | null
  onChange?: (value: RadioValue) => void
  disabled?: boolean
  error?: string
  size?: 'sm' | 'md'
  className?: string
  /** Растянуть на всю ширину родителя */
  block?: boolean
}

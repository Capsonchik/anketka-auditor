import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './chevron-down-icon.module.scss'

export interface ChevronDownIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка стрелки вниз (Chevron Down)
 * 
 * SVG иконка стрелки вниз для выпадающих списков, аккордеонов и других компонентов.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки стрелки вниз
 * 
 * @example
 * ```tsx
 * <ChevronDownIcon width={24} height={24} className={styles.icon} />
 * ```
 * 
 * @example
 * ```tsx
 * <ChevronDownIcon width={16} height={16} />
 * ```
 */
export function ChevronDownIcon(props: ChevronDownIconProps | null = {}) {
  const {
    width = 24,
    height = 24,
    className,
    ...restProps
  } = props || {}
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.chevronDownIcon, className)}
      {...restProps}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}



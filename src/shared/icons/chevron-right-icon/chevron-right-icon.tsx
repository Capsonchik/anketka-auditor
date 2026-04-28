import { type SVGProps } from 'react'

import { clsx } from '@shared/lib/clsx'

import styles from './chevron-right-icon.module.scss'

export interface ChevronRightIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка стрелки вправо (Chevron Right)
 *
 * SVG иконка стрелки вправо для пагинации, навигации и других компонентов.
 *
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки стрелки вправо
 *
 * @example
 * ```tsx
 * <ChevronRightIcon width={24} height={24} className={styles.icon} />
 * ```
 */
export function ChevronRightIcon(props: ChevronRightIconProps | null = {}) {
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
      className={clsx(styles.chevronRightIcon, className)}
      {...restProps}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


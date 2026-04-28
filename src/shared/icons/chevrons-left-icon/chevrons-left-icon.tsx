import { type SVGProps } from 'react'

import { clsx } from '@shared/lib/clsx'

import styles from './chevrons-left-icon.module.scss'

export interface ChevronsLeftIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка двойной стрелки влево (Chevrons Left)
 *
 * SVG иконка двойной стрелки влево для пагинации (переход на первую страницу).
 *
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки двойной стрелки влево
 *
 * @example
 * ```tsx
 * <ChevronsLeftIcon width={24} height={24} className={styles.icon} />
 * ```
 */
export function ChevronsLeftIcon(props: ChevronsLeftIconProps | null = {}) {
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
      className={clsx(styles.chevronsLeftIcon, className)}
      {...restProps}
    >
      <path
        d="M11 17L6 12L11 7M18 17L13 12L18 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


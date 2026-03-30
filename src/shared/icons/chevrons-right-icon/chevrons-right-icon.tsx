import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './chevrons-right-icon.module.scss'

export interface ChevronsRightIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка двойной стрелки вправо (Chevrons Right)
 *
 * SVG иконка двойной стрелки вправо для пагинации (переход на последнюю страницу).
 *
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки двойной стрелки вправо
 *
 * @example
 * ```tsx
 * <ChevronsRightIcon width={24} height={24} className={styles.icon} />
 * ```
 */
export function ChevronsRightIcon(props: ChevronsRightIconProps | null = {}) {
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
      className={clsx(styles.chevronsRightIcon, className)}
      {...restProps}
    >
      <path
        d="M13 17L18 12L13 7M6 17L11 12L6 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


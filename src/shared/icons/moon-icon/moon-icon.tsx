import { type SVGProps } from 'react'

import { clsx } from '@shared/lib/clsx'

import styles from './moon-icon.module.scss'

export interface MoonIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка луны
 * 
 * SVG иконка луны для переключателя темы (темная тема).
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=20] - Ширина иконки
 * @param {number | string} [props.height=20] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки луны
 * 
 * @example
 * ```tsx
 * <MoonIcon width={20} height={20} />
 * ```
 */
export function MoonIcon(props: MoonIconProps | null = {}) {
  const {
    width = 20,
    height = 20,
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
      className={clsx(styles.moonIcon, className)}
      {...restProps}
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
      />
    </svg>
  )
}



import { type SVGProps } from 'react'

import { clsx } from '@shared/lib/clsx'

import styles from './sun-icon.module.scss'

export interface SunIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка солнца
 * 
 * SVG иконка солнца для переключателя темы (светлая тема).
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=20] - Ширина иконки
 * @param {number | string} [props.height=20] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки солнца
 * 
 * @example
 * ```tsx
 * <SunIcon width={20} height={20} />
 * ```
 */
export function SunIcon(props: SunIconProps | null = {}) {
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
      className={clsx(styles.sunIcon, className)}
      {...restProps}
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}



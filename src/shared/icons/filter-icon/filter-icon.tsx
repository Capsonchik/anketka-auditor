import { type SVGProps } from 'react'

import { clsx } from '@shared/lib/clsx'

import styles from './filter-icon.module.scss'

export interface FilterIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
  hoverColor?: string
}

/**
 * Иконка фильтра
 * 
 * SVG иконка фильтра для использования в интерфейсе.
 * Поддерживает кастомный цвет при наведении через проп hoverColor.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {string} [props.hoverColor] - Цвет при наведении (CSS переменная или hex цвет). По умолчанию используется текущий цвет
 * @returns {JSX.Element} Компонент иконки фильтра
 * 
 * @example
 * ```tsx
 * <FilterIcon width={24} height={24} className={styles.icon} />
 * ```
 * 
 * @example
 * ```tsx
 * <FilterIcon hoverColor="var(--color-primary)" />
 * ```
 */
export function FilterIcon(props: FilterIconProps | null = {}) {
  const {
    width = 24,
    height = 24,
    className,
    hoverColor,
    ...restProps
  } = props || {}
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.filterIcon, className)}
      style={
        hoverColor
          ? ({
              '--hover-color': hoverColor,
            } as React.CSSProperties)
          : undefined
      }
      {...restProps}
    >
      <path
        d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}



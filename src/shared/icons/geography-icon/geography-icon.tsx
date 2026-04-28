import { type SVGProps } from 'react'

import { clsx } from '@shared/lib/clsx'

import styles from './geography-icon.module.scss'

export interface GeographyIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
  hoverColor?: string
}

/**
 * Иконка географии
 * 
 * SVG иконка для отображения шага "География" в квизе.
 * Поддерживает кастомный цвет при наведении через проп hoverColor.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {string} [props.hoverColor] - Цвет при наведении (CSS переменная или hex цвет). По умолчанию используется текущий цвет
 * @returns {JSX.Element} Компонент иконки географии
 */
export function GeographyIcon(props: GeographyIconProps | null = {}) {
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
      className={clsx(styles.geographyIcon, className)}
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
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}




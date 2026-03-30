import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './market-icon.module.scss'

export interface MarketIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
  hoverColor?: string
}

/**
 * Иконка рынка
 * 
 * SVG иконка для отображения шага "Рынок" в квизе.
 * Поддерживает кастомный цвет при наведении через проп hoverColor.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {string} [props.hoverColor] - Цвет при наведении (CSS переменная или hex цвет). По умолчанию используется текущий цвет
 * @returns {JSX.Element} Компонент иконки рынка
 */
export function MarketIcon(props: MarketIconProps | null = {}) {
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
      className={clsx(styles.marketIcon, className)}
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
        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17V13M9 19.5C9 20.3 9.7 21 10.5 21C11.3 21 12 20.3 12 19.5C12 18.7 11.3 18 10.5 18C9.7 18 9 18.7 9 19.5ZM19.5 19.5C19.5 20.3 20.2 21 21 21C21.8 21 22.5 20.3 22.5 19.5C22.5 18.7 21.8 18 21 18C20.2 18 19.5 18.7 19.5 19.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}




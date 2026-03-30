import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './step-separator-icon.module.scss'

export interface StepSeparatorIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка разделителя шагов
 * 
 * SVG иконка для разделения шагов в навигации квиза.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=16] - Ширина иконки
 * @param {number | string} [props.height=16] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки разделителя
 */
export function StepSeparatorIcon({ width = 16, height = 4, className, ...props }: StepSeparatorIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.stepSeparatorIcon, className)}
      {...props}
    >
      <line
        x1="0"
        y1="2"
        x2="16"
        y2="2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}



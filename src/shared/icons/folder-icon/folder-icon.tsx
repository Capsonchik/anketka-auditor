import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './folder-icon.module.scss'

export interface FolderIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
  hoverColor?: string
}

/**
 * Иконка папки (проекта)
 * 
 * SVG иконка для отображения проектов.
 * Поддерживает кастомный цвет при наведении через проп hoverColor.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {string} [props.hoverColor] - Цвет при наведении (CSS переменная или hex цвет). По умолчанию используется текущий цвет
 * @returns {JSX.Element} Компонент иконки папки
 */
export function FolderIcon(props: FolderIconProps | null = {}) {
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
      className={clsx(styles.folderIcon, className)}
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
        d="M22 19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H9L11 6H20C21.1046 6 22 6.89543 22 8V19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


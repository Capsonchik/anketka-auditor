import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './projects-list-icon.module.scss'

export interface ProjectsListIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
  hoverColor?: string
}

/**
 * Иконка списка проектов
 * 
 * SVG иконка для отображения списка проектов.
 * Поддерживает кастомный цвет при наведении через проп hoverColor.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {string} [props.hoverColor] - Цвет при наведении (CSS переменная или hex цвет). По умолчанию используется текущий цвет
 * @returns {JSX.Element} Компонент иконки списка проектов
 * 
 * @example
 * ```tsx
 * <ProjectsListIcon width={24} height={24} className={styles.icon} />
 * ```
 * 
 * @example
 * ```tsx
 * <ProjectsListIcon hoverColor="var(--color-primary)" />
 * ```
 */
export function ProjectsListIcon(props: ProjectsListIconProps | null = {}) {
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
      className={clsx(styles.projectsListIcon, className)}
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
        d="M8 6H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H3.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12H3.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18H3.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}



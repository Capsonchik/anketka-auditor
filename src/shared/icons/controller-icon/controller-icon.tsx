// shared/icons/controller-icon/controller-icon.tsx
import { type SVGProps } from 'react';
import { clsx } from '@shared/lib/clsx';
import styles from './controller-icon.module.scss';

export interface ControllerIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Иконка Контролера
 * 
 * SVG иконка для обозначения роли контролера, который проверяет работу аудитора.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки контролера
 */
export function ControllerIcon(props: ControllerIconProps | null = {}) {
  const {
    width = 24,
    height = 24,
    className,
    ...restProps
  } = props || {};

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.controllerIcon, className)}
      {...restProps}
    >
      {/* Человек (контролер) */}
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20V19C5 15.6863 7.68629 13 11 13H13C13.6 13 14.2 13.1 14.7 13.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Лупа для проверки */}
      <path d="M18 18L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.5" />
      {/* Галочка проверки */}
      <path
        d="M15 17L16.5 18.5L19.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
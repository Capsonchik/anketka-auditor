// shared/icons/auditor-icon/auditor-icon.tsx
import { type SVGProps } from 'react';
import { clsx } from '@shared/lib/clsx';
import styles from './auditor-icon.module.scss';

export interface AuditorIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Иконка Аудитора (Тайный покупатель)
 * 
 * SVG иконка для обозначения роли аудитора/тайного покупателя.
 * 
 * @component
 * @param {object} props - Пропсы компонента
 * @param {number | string} [props.width=24] - Ширина иконки
 * @param {number | string} [props.height=24] - Высота иконки
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Компонент иконки аудитора
 */
export function AuditorIcon(props: AuditorIconProps | null = {}) {
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
      className={clsx(styles.auditorIcon, className)}
      {...restProps}
    >
      {/* Человек (тайный покупатель) */}
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Корзина покупок */}
      <path
        d="M16 6L18 3M8 6L6 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 9L19 18C18.8 19.2 17.8 20 16.6 20H7.4C6.2 20 5.2 19.2 5 18L4 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M8 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
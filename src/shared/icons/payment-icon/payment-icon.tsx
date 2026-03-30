import { type SVGProps } from 'react'

import clsx from 'clsx'

import styles from './payment-icon.module.scss'

export interface PaymentIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Иконка оплаты
 */
export function PaymentIcon({ width = 24, height = 24, className, ...props }: PaymentIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.icon, className)}
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 9h20M6 13h4M6 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}



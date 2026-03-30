import Link from 'next/link'
import { LogoIcon } from '@shared/icons'
import styles from './logo.module.scss'
import clsx from 'clsx'

export interface LogoProps {
  className?: string
  width?: number
  height?: number
  to?: string
}

export function Logo({ className, width, height, to = '/' }: LogoProps) {
  return (
    <Link href={to} className={styles.logoLink}>
      <LogoIcon
        width={width}
        height={height}
        className={clsx(styles.logo, className)}
      />
    </Link>
  )
}

import type { ButtonHTMLAttributes } from 'react';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type ButtonAppearance = 'default' | 'subtile' | 'ghost';

export type ButtonAnimation =
  | 'none'
  | 'swipe'
  | 'diagonal-swipe'
  | 'double-swipe'
  | 'diagonal-close'
  | 'zoning-in'
  | 'four-corners'
  | 'slice'
  | 'position-aware'
  | 'alternate'
  | 'smoosh'
  | 'vertical-overlap'
  | 'horizontal-overlap'
  | 'collision'
  | 'ripple';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  animation?: ButtonAnimation;
  block?: boolean;
  loading?: boolean;
  active?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

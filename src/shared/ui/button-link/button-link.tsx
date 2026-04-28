import React from 'react';
import Link, { LinkProps } from 'next/link';
import { clsx } from '@shared/lib/clsx';
import buttonStyles from '../button/button.module.scss';

interface ButtonLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return clsx(buttonStyles['variant-primary'], buttonStyles['appearance-default']);
      case 'secondary':
        return clsx(buttonStyles['variant-default'], buttonStyles['appearance-default']);
      case 'outline':
        return clsx(buttonStyles['variant-primary'], buttonStyles['appearance-ghost']);
      case 'ghost':
        return clsx(buttonStyles['variant-primary'], buttonStyles['appearance-subtile']);
      default:
        return clsx(buttonStyles['variant-primary'], buttonStyles['appearance-default']);
    }
  };

  return (
    <Link 
      className={clsx(
        buttonStyles.button, 
        buttonStyles[size], 
        buttonStyles['rounded-md'],
        getVariantClasses(),
        className
      )} 
      {...props}
    >
      <span className={buttonStyles.content}>{children}</span>
    </Link>
  );
};

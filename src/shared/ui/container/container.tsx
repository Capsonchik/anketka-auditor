import React from 'react';
import { clsx } from '@shared/lib/clsx';
import styles from './container.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx(styles.container, className)} {...props}>
      {children}
    </div>
  );
};

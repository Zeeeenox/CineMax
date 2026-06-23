import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ children, variant = 'default', padding = 'md', className = '', ...props }: CardProps) {
  const baseStyles = 'card';
  const variantStyles = {
    default: '',
    hover: 'hover:border-primary-500/50 hover:shadow-glow cursor-pointer',
    interactive: 'hover:border-primary-500/50 hover:shadow-glow cursor-pointer active:scale-[0.98]',
  };

  return (
    <motion.div
      whileHover={variant === 'hover' ? { y: -4 } : undefined}
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

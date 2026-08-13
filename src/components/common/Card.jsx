import React from 'react';
import { clsx } from 'clsx';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  glass = false,
  bordered = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        glass ? 'glass-panel' : 'bg-white dark:bg-slate-800',
        bordered && 'border border-slate-200/80 dark:border-slate-700/80',
        hoverable && 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
        'shadow-sm p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

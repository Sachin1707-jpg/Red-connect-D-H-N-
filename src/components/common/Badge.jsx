import React from 'react';
import { clsx } from 'clsx';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide uppercase transition-colors';

  const variants = {
    danger: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    emergency: 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-sm shadow-red-500/30',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    info: 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    default: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    blood: 'bg-red-600 text-white font-black shadow-md shadow-red-600/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {children}
    </span>
  );
};

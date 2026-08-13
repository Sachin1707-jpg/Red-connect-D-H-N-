import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  leftIcon = null,
  helperText = '',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full rounded-xl text-sm appearance-none transition-all duration-200 border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-1 pr-10 py-2.5',
            leftIcon ? 'pl-10' : 'pl-3.5',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

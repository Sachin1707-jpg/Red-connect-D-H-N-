import React from 'react';
import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const Textarea = React.forwardRef(({
  label,
  error,
  placeholder = '',
  rows = 4,
  helperText = '',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-xl text-sm transition-all duration-200 border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 p-3.5',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
        )}
        {...props}
      />
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

Textarea.displayName = 'Textarea';

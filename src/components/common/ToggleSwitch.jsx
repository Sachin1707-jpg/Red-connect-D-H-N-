import React from 'react';

export const ToggleSwitch = ({
  checked,
  onChange,
  label = '',
  description = '',
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`inline-flex items-center justify-between cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {(label || description) && (
        <div className="mr-3">
          {label && <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{label}</span>}
          {description && <span className="text-xs text-slate-500 dark:text-slate-400 block">{description}</span>}
        </div>
      )}
      <div className="relative inline-flex items-center shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-emerald-600"></div>
      </div>
    </label>
  );
};

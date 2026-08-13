import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon = <Inbox className="w-12 h-12 text-slate-400" />,
  title = 'No Data Found',
  description = 'There are no items matching your request at this time.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/80 ${className}`}>
      <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

import React from 'react';
import { Card } from '../common/Card';

export const StatsCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral', // positive, negative, neutral
  badgeText,
  color = 'red',
}) => {
  const borderColors = {
    red: 'border-l-4 border-l-red-500',
    emerald: 'border-l-4 border-l-emerald-500',
    amber: 'border-l-4 border-l-amber-500',
    indigo: 'border-l-4 border-l-indigo-500',
  };

  return (
    <Card className={`relative overflow-hidden ${borderColors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            {value}
          </h3>
          {change && (
            <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
              changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
              changeType === 'negative' ? 'text-red-500' : 'text-slate-500'
            }`}>
              <span>{change}</span>
            </p>
          )}
        </div>
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 shadow-inner">
          {icon}
        </div>
      </div>
      {badgeText && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>{badgeText}</span>
        </div>
      )}
    </Card>
  );
};

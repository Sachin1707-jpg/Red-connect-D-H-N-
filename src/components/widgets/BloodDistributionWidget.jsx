import React from 'react';
import { Card } from '../common/Card';

export const BloodDistributionWidget = ({ stocks = { 'A+': 18, 'A-': 4, 'B+': 22, 'B-': 3, 'AB+': 8, 'AB-': 1, 'O+': 35, 'O-': 2 } }) => {
  const maxUnits = Math.max(...Object.values(stocks), 1);

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Blood Group Inventory Distribution</h3>
          <p className="text-xs text-slate-500">Live units available in stock</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">Total: {Object.values(stocks).reduce((a, b) => a + b, 0)} units</span>
      </div>

      <div className="space-y-3">
        {Object.entries(stocks).map(([group, count]) => {
          const percentage = Math.round((count / maxUnits) * 100);
          const isLow = count <= 5;
          return (
            <div key={group} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 font-bold">{group}</span>
                <span className={isLow ? 'text-red-500 font-bold' : 'text-slate-500'}>
                  {count} units {isLow && '(Low)'}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLow ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

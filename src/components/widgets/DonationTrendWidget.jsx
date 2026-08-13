import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';

export const DonationTrendWidget = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const donations = [45, 60, 75, 90, 85, 110, 140];
  const requests = [40, 55, 70, 82, 80, 100, 130];
  const maxVal = 150;

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Monthly Donations vs Requests
          </h3>
          <p className="text-xs text-slate-500">7-month comparative performance trend</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Donations</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Requests</span>
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-700">
        {months.map((m, i) => {
          const donH = Math.round((donations[i] / maxVal) * 100);
          const reqH = Math.round((requests[i] / maxVal) * 100);
          return (
            <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div className="w-full flex justify-center gap-1 items-end h-full">
                <div
                  className="w-2.5 bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-400"
                  style={{ height: `${donH}%` }}
                  title={`Donations: ${donations[i]}`}
                />
                <div
                  className="w-2.5 bg-red-500 rounded-t-sm transition-all duration-300 group-hover:bg-red-400"
                  style={{ height: `${reqH}%` }}
                  title={`Requests: ${requests[i]}`}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{m}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

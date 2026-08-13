import React from 'react';
import { Card } from '../common/Card';
import { Activity, Clock, ShieldCheck, AlertCircle, Heart } from 'lucide-react';

export const ActivityTimelineWidget = ({ logs = [
  { id: '1', text: 'Dr. Sarah Jenkins logged in to Hospital Portal', time: '5 mins ago', type: 'info' },
  { id: '2', text: 'O-Negative Emergency Request dispatched by Metro Hospital', time: '12 mins ago', type: 'alert' },
  { id: '3', text: 'Donor Alex Vance pledged 1 unit to Request #101', time: '25 mins ago', type: 'success' },
  { id: '4', text: 'New NGO Red Cross Community verified by Admin', time: '1 hour ago', type: 'info' },
] }) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Audit Log & System Activity Timeline
          </h3>
          <p className="text-xs text-slate-500">Real-time system events & user actions</p>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map((l) => (
          <div key={l.id} className="flex items-start gap-3 text-xs">
            <div className={`p-1.5 rounded-lg shrink-0 ${
              l.type === 'alert' ? 'bg-red-100 text-red-600 dark:bg-red-950/40' :
              l.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 dark:text-slate-200 font-medium">{l.text}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{l.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

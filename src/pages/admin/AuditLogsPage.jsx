import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, Clock, Shield } from 'lucide-react';
import { ActivityTimelineWidget } from '../../components/widgets/ActivityTimelineWidget';
import { Card } from '../../components/common/Card';

const AuditLogsPage = () => {
  const { auditLogs, users } = useSelector((s) => s.admin);

  const extendedLogs = [
    ...auditLogs,
    { id: 'al3', action: 'NGO Approved', user: 'Admin', details: 'Approved Red Cross Community NGO portal access', timestamp: '2 days ago' },
    { id: 'al4', action: 'Login Event', user: 'Sarah Jenkins', details: 'Donor Sarah Jenkins logged in from 192.168.1.1', timestamp: '3 days ago' },
    { id: 'al5', action: 'Request Created', user: 'Metro General Hospital', details: 'Emergency O- blood request dispatched to 28 donors', timestamp: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-7 h-7 text-primary" />
          System Audit Log & Activity Trail
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete chronological record of all admin actions, user logins, and critical system events</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Chronological Event Log
            </h2>
            {extendedLogs.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p>
                    <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{log.details}</p>
                  <p className="text-[11px] text-slate-400 mt-1">by <span className="font-semibold">{log.user}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Platform Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Users', value: users.length },
                { label: 'Active Users', value: users.filter(u => u.status === 'Active').length },
                { label: 'Suspended Users', value: users.filter(u => u.status === 'Suspended').length },
                { label: 'Total Log Entries', value: extendedLogs.length },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <ActivityTimelineWidget logs={extendedLogs.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;

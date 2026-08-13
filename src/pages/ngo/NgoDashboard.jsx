import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HeartHandshake, Calendar, Users, AlertTriangle, Building2, Plus, Phone } from 'lucide-react';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';

const NgoDashboard = () => {
  const { camps, volunteers, shortages } = useSelector((s) => s.ngo);

  const campCols = [
    { key: 'title', header: 'Camp Event', render: (c) => <span className="font-bold text-slate-900 dark:text-white">{c.title}</span> },
    { key: 'date', header: 'Date', render: (c) => <span className="text-xs text-slate-500">{c.date}</span> },
    { key: 'location', header: 'Location', render: (c) => <span className="text-xs text-slate-500">{c.location}</span> },
    { key: 'registered', header: 'Turnout', render: (c) => <span className="font-bold text-emerald-600">{c.registered} / {c.target}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-primary" />
            NGO Community Management Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Organize donation camps, coordinate volunteer rosters, and monitor hospital shortages</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Active Drives Hosted', value: camps.length, icon: <Calendar className="w-6 h-6" />, color: 'red', change: 'Community drives', changeType: 'neutral' },
          { title: 'Volunteers Rostered', value: volunteers.length, icon: <Users className="w-6 h-6" />, color: 'emerald', change: 'Assigned to events', changeType: 'positive' },
          { title: 'Hospital Shortages Monitored', value: shortages.length, icon: <AlertTriangle className="w-6 h-6" />, color: 'amber', change: 'Critical alerts', changeType: 'negative' },
          { title: 'Registered Donors Attending', value: 240, icon: <HeartHandshake className="w-6 h-6" />, color: 'indigo', change: '↑ 18% turnout', changeType: 'positive' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-base flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Blood Donation Camps
        </h2>
        <Table columns={campCols} data={camps} />
      </div>
    </div>
  );
};

export default NgoDashboard;

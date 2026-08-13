import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, Building2, MapPin, Phone, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

const priorityBadge = { Critical: 'emergency', High: 'danger', Medium: 'warning' };

const BloodShortageMonitor = () => {
  const { shortages } = useSelector((s) => s.ngo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="w-7 h-7 text-primary" />
          Regional Blood Shortage Monitor
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live shortage alerts from nearby hospitals — coordinate donor dispatch and emergency support</p>
      </div>

      {shortages.length === 0
        ? <EmptyState title="No active shortages" description="All nearby hospitals currently have sufficient blood stock." />
        : (
          <div className="space-y-4">
            {shortages.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${s.priority === 'Critical' ? 'border-red-400 dark:border-red-700 border-l-4' : 'border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0">
                    {s.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant={priorityBadge[s.priority] || 'default'} pulse={s.priority === 'Critical'}>{s.priority} Shortage</Badge>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">{s.hospital}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-red-500">{s.unitsNeeded} units needed urgently</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="primary" size="sm" leftIcon={<HeartHandshake className="w-4 h-4" />} onClick={() => toast.success(`Support request sent to ${s.hospital}!`)}>
                    Send Support
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.success('Shortage details shared to volunteer network')}>
                    Share Alert
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default BloodShortageMonitor;

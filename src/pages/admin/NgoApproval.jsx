import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HeartHandshake, CheckCircle, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { approveNgo } from '../../redux/adminSlice';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';

const NgoApproval = () => {
  const dispatch = useDispatch();
  const { pendingNgos } = useSelector((s) => s.admin);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="w-7 h-7 text-primary" />
          NGO Registration Approval Queue
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review NGO registration certificates and approve or decline their community portal access</p>
      </div>

      {pendingNgos.length === 0
        ? <EmptyState title="No pending NGO approvals" description="All NGO registration requests have been reviewed." />
        : (
          <div className="space-y-5">
            {pendingNgos.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"><HeartHandshake className="w-7 h-7" /></div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{n.name}</h3>
                      <p className="text-xs text-slate-500">Registration #: <span className="font-bold text-slate-700 dark:text-slate-300">{n.license}</span></p>
                      <p className="text-xs text-slate-500">{n.location}</p>
                      <Badge variant="warning" size="sm" className="mt-2">Awaiting Admin Review</Badge>
                    </div>
                  </div>

                  <div className="mb-5 p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-center">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">NGO Certificate Document</p>
                    <p className="text-xs text-slate-500 mt-0.5">Registration certificate preview available in production.</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => toast.success('Opening document (demo)')}>
                      Preview Certificate
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="danger" className="flex-1" leftIcon={<X className="w-4 h-4" />} onClick={() => { dispatch(approveNgo(n.id)); toast.error(`${n.name} registration rejected.`); }}>Reject</Button>
                    <Button variant="success" className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={() => { dispatch(approveNgo(n.id)); toast.success(`✅ ${n.name} NGO approved!`); }}>Approve NGO</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default NgoApproval;

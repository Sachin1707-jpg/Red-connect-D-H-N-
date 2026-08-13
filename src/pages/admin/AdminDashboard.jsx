import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Building2, HeartHandshake, Siren, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { approveHospital, approveNgo } from '../../redux/adminSlice';
import { ActivityTimelineWidget } from '../../components/widgets/ActivityTimelineWidget';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingHospitals, pendingNgos, users, auditLogs } = useSelector((s) => s.admin);

  const handleApproveHosp = (id) => {
    dispatch(approveHospital(id));
    toast.success('Hospital verified and approved successfully!');
  };

  const handleApproveNgo = (id) => {
    dispatch(approveNgo(id));
    toast.success('NGO account approved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" />
          Master Administration & System Health
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform management, user moderation, hospital approvals, and audit logs</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Registered Users', value: 12845, icon: <Users className="w-6 h-6" />, color: 'indigo', change: 'Donors & Requesters', changeType: 'neutral' },
          { title: 'Verified Hospitals', value: 385, icon: <Building2 className="w-6 h-6" />, color: 'emerald', change: `${pendingHospitals.length} pending review`, changeType: 'positive' },
          { title: 'Registered NGOs', value: 42, icon: <HeartHandshake className="w-6 h-6" />, color: 'amber', change: `${pendingNgos.length} pending review`, changeType: 'neutral' },
          { title: 'Emergency Requests', value: 1420, icon: <Siren className="w-6 h-6" />, color: 'red', change: '94% fulfillment rate', changeType: 'positive' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Hospital Approvals */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            Pending Hospital Verification Requests ({pendingHospitals.length})
          </h2>
          {pendingHospitals.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No pending hospital approvals right now.</p>
          ) : (
            <div className="space-y-3">
              {pendingHospitals.map((h) => (
                <div key={h.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/40 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{h.name}</p>
                    <p className="text-xs text-slate-500">License: {h.license} · {h.address}</p>
                  </div>
                  <Button variant="success" size="sm" onClick={() => handleApproveHosp(h.id)}>
                    Approve
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log Widget */}
        <ActivityTimelineWidget logs={auditLogs} />
      </div>
    </div>
  );
};

export default AdminDashboard;

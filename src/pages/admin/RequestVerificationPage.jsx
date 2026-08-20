import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle, X, AlertTriangle, Clock,
  Droplets, MapPin, User, Phone, FileText, Siren, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { mockBloodRequests } from '../../data/mockData';

/* ─────────────────────────────────────────────
   Mock "Pending Verification" requests seeded
   from mockData (status override to demo page)
───────────────────────────────────────────── */
const INITIAL_PENDING = mockBloodRequests
  .filter(r => r.status === 'Active')
  .slice(0, 4)
  .map(r => ({ ...r, status: 'Pending Verification', rejectionReason: '' }));

const urgencyConfig = {
  Critical: { variant: 'emergency', border: 'border-red-500', stripe: 'from-red-600 to-rose-600', pulse: true },
  High:     { variant: 'danger',    border: 'border-amber-500', stripe: 'from-amber-500 to-orange-400', pulse: false },
  Medium:   { variant: 'warning',   border: 'border-yellow-400', stripe: 'from-yellow-400 to-amber-300', pulse: false },
};

const FILTERS = ['All', 'Critical', 'High', 'Medium'];

const RequestVerificationPage = () => {
  const [requests, setRequests] = useState(INITIAL_PENDING);
  const [filter, setFilter] = useState('All');
  const [rejectModal, setRejectModal] = useState(null); // { id }
  const [rejectReason, setRejectReason] = useState('');

  const approveRequest = (id) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'Approved — Dispatched to Matching Engine' } : r
    ));
    toast.success('✅ Request approved and dispatched to the matching engine!');
  };

  const openRejectModal = (id) => {
    setRejectModal({ id });
    setRejectReason('');
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    setRequests(prev => prev.map(r =>
      r.id === rejectModal.id ? { ...r, status: 'Rejected', rejectionReason: rejectReason } : r
    ));
    toast.error(`❌ Request rejected.`);
    setRejectModal(null);
  };

  const pendingCount = requests.filter(r => r.status === 'Pending Verification').length;
  const approvedCount = requests.filter(r => r.status.startsWith('Approved')).length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  const filtered = requests.filter(r => {
    if (filter === 'All') return true;
    return r.urgency === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" />
          Request Validation & Verification
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review incoming blood requests from hospitals. Approve to dispatch to the matching engine, or reject with a documented reason.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: pendingCount, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
          { label: 'Approved Today', value: approvedCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: 'Rejected', value: rejectedCount, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl border ${s.bg} ${s.border}`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Verification Flow Reminder */}
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex flex-wrap gap-2 items-center text-xs font-semibold text-indigo-700 dark:text-indigo-300">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Admin Verification Flow:</span>
        {['Hospital Submits Request', '→', 'Admin Validates (This Page)', '→', 'Approve → Matching Engine → Donors Notified', '|', 'Reject → Notified with Reason'].map((s, i) => (
          <span key={i} className={s === '→' || s === '|' ? 'text-indigo-400' : 'bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-lg'}>{s}</span>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              filter === f
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No requests to review"
          description="All blood requests in this category have been processed."
        />
      ) : (
        <div className="space-y-5">
          <AnimatePresence>
            {filtered.map((req, i) => {
              const conf = urgencyConfig[req.urgency] || urgencyConfig.Medium;
              const isPending = req.status === 'Pending Verification';
              const isApproved = req.status.startsWith('Approved');
              const isRejected = req.status === 'Rejected';

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className={`relative border-l-4 ${conf.border} overflow-hidden`}>
                    {/* Urgency stripe */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${conf.stripe} absolute top-0 left-0 right-0 ${conf.pulse ? 'animate-pulse' : ''}`} />

                    <div className="pt-3">
                      {/* Status banner */}
                      {!isPending && (
                        <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          isApproved
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}>
                          {isApproved ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          {req.status}
                          {isRejected && req.rejectionReason && ` — Reason: "${req.rejectionReason}"`}
                        </div>
                      )}

                      {/* Request Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/30 shrink-0">
                            {req.bloodGroup}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">{req.patientName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{req.hospitalName}</p>
                            <Badge variant={conf.variant} size="sm" pulse={conf.pulse} className="mt-1">
                              {req.urgency} Priority
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-400">Units Needed</p>
                          <p className="text-3xl font-black text-slate-900 dark:text-white">{req.unitsRequired}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {[
                          { icon: MapPin, label: 'Location', value: req.location },
                          { icon: Clock, label: 'Required By', value: req.requiredDate },
                          { icon: Phone, label: 'Contact', value: req.hospitalContact },
                        ].map(d => (
                          <div key={d.label} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                            <d.icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{d.label}</p>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{d.value || 'N/A'}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {req.description && (
                        <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          {req.description}
                        </div>
                      )}

                      {/* Actions — only for pending */}
                      {isPending && (
                        <div className="flex gap-3">
                          <Button
                            variant="danger"
                            className="flex-1"
                            leftIcon={<X className="w-4 h-4" />}
                            onClick={() => openRejectModal(req.id)}
                          >
                            Reject with Reason
                          </Button>
                          <Button
                            variant="success"
                            className="flex-1"
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                            onClick={() => approveRequest(req.id)}
                          >
                            Approve & Dispatch
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">Reject Blood Request</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Provide a clear reason. The hospital will be notified with this explanation.
                  </p>
                </div>
              </div>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={4}
                placeholder="e.g. Insufficient medical documentation. Please resubmit with a valid clinical prescription."
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/40 p-3 text-sm text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setRejectModal(null)}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" leftIcon={<X className="w-4 h-4" />} onClick={confirmReject}>
                  Confirm Rejection
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestVerificationPage;

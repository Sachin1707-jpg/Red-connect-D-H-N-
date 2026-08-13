import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, X, FileText, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { approveHospital } from '../../redux/adminSlice';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MedicalDocumentUploader } from '../../components/forms/MedicalDocumentUploader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const HospitalApproval = () => {
  const dispatch = useDispatch();
  const { pendingHospitals } = useSelector((s) => s.admin);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-7 h-7 text-primary" />
          Hospital Verification & Approval Queue
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review hospital license documents and approve or reject registration applications</p>
      </div>

      {pendingHospitals.length === 0
        ? <EmptyState title="No pending hospital approvals" description="All hospital registration requests have been processed." />
        : (
          <div className="space-y-6">
            {pendingHospitals.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600"><Building2 className="w-7 h-7" /></div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{h.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">License: <span className="font-bold text-slate-700 dark:text-slate-300">{h.license}</span></p>
                        <p className="text-xs text-slate-500">{h.address}</p>
                        <Badge variant="warning" size="sm" className="mt-2">Pending Verification</Badge>
                      </div>
                    </div>
                  </div>

                  {/* License Preview Placeholder */}
                  <div className="mb-5 p-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-center">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Hospital License Document Preview</p>
                    <p className="text-xs text-slate-500 mt-1">In production: License PDF/image uploaded by hospital is previewed here for admin review.</p>
                    <Button variant="ghost" size="sm" className="mt-3" onClick={() => toast.success('Opening document viewer (demo)')}>
                      <FileText className="w-4 h-4 mr-2" /> Preview License
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      className="flex-1"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={() => { dispatch(approveHospital(h.id)); toast.error(`${h.name} application rejected.`); }}
                    >
                      Reject Application
                    </Button>
                    <Button
                      variant="success"
                      className="flex-1"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => { dispatch(approveHospital(h.id)); toast.success(`✅ ${h.name} verified and approved!`); }}
                    >
                      Approve & Verify
                    </Button>
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

export default HospitalApproval;

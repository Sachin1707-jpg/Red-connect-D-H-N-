import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Droplets, MapPin, Clock, AlertTriangle, User,
  Phone, FileText, CheckCircle2, ArrowRight, Siren
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { createBloodRequest } from '../../redux/requestSlice';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = [
  { value: 'Critical', label: '🚨 Critical — Surgery within hours' },
  { value: 'High', label: '⚠️ High — Required within 24 hours' },
  { value: 'Medium', label: '🔵 Medium — Required within 2–3 days' },
];

const schema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  unitsRequired: z.string().min(1, 'Units required').refine(v => Number(v) > 0, 'Must be at least 1 unit'),
  urgency: z.string().min(1, 'Urgency level is required'),
  location: z.string().min(3, 'Location is required'),
  requiredDate: z.string().min(1, 'Required date is required'),
  hospitalContact: z.string().min(7, 'Contact number is required'),
  description: z.string().min(10, 'Please provide details (min. 10 chars)'),
});

const urgencyConfig = {
  Critical: { variant: 'emergency', border: 'border-red-500', bg: 'bg-red-50 dark:bg-red-950/20', icon: '🚨' },
  High: { variant: 'danger', border: 'border-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20', icon: '⚠️' },
  Medium: { variant: 'warning', border: 'border-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/20', icon: '🔵' },
};

const CreateBloodRequestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.requests);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { urgency: 'Critical' }
  });

  const watchedUrgency = watch('urgency', 'Critical');
  const conf = urgencyConfig[watchedUrgency] || urgencyConfig.Critical;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      unitsRequired: Number(data.unitsRequired),
      status: 'Pending Verification',
      createdAt: new Date().toISOString(),
    };
    setPreview(payload);
  };

  const confirmSubmit = async () => {
    const result = await dispatch(createBloodRequest(preview));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('✅ Blood request submitted! Pending admin verification.');
      setSubmitted(true);
      setTimeout(() => navigate('/hospital/emergency'), 2000);
    } else {
      toast.error(result.payload || 'Submission failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Request Submitted!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Redirecting to Emergency Cases tracker…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="w-7 h-7 text-primary animate-pulse" />
          Create Blood Request
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fill in the patient details. The request goes through admin verification before being broadcast to matching donors.
        </p>
      </div>

      {/* Flow steps reminder */}
      <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        {['Fill Details', '→', 'Admin Verifies', '→', 'Matching Engine', '→', 'Donors Notified'].map((s, i) => (
          <span key={i} className={s === '→' ? 'text-slate-300 dark:text-slate-600' : 'px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}>
            {s}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className={`border-l-4 ${conf.border}`}>
              {/* Urgency color strip */}
              <div className={`-mx-6 -mt-6 mb-6 px-6 py-3 rounded-t-2xl ${conf.bg} flex items-center gap-2`}>
                <Siren className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Urgency Level:</span>
                {watchedUrgency && <Badge variant={conf.variant} size="sm" pulse={watchedUrgency === 'Critical'}>{watchedUrgency}</Badge>}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Patient & Blood Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Name / Ward"
                    placeholder="e.g. Robert Chen (ICU Ward Bed 5)"
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.patientName?.message}
                    required
                    {...register('patientName')}
                  />
                  <Select
                    label="Blood Group Required"
                    options={BLOOD_GROUPS.map(g => ({ value: g, label: g }))}
                    leftIcon={<Droplets className="w-4 h-4" />}
                    error={errors.bloodGroup?.message}
                    required
                    {...register('bloodGroup')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Units Required"
                    type="number"
                    min={1}
                    max={20}
                    placeholder="e.g. 3"
                    error={errors.unitsRequired?.message}
                    required
                    {...register('unitsRequired')}
                  />
                  <Select
                    label="Urgency Level"
                    options={URGENCY_LEVELS}
                    error={errors.urgency?.message}
                    required
                    {...register('urgency')}
                  />
                </div>

                {/* Location & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Hospital Location"
                    placeholder="e.g. 450 Health Ave, Metropolis"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    error={errors.location?.message}
                    required
                    {...register('location')}
                  />
                  <Input
                    label="Required By Date"
                    type="date"
                    leftIcon={<Clock className="w-4 h-4" />}
                    error={errors.requiredDate?.message}
                    required
                    {...register('requiredDate')}
                  />
                </div>

                {/* Contact */}
                <Input
                  label="Emergency Contact Number"
                  placeholder="+1-555-8832"
                  leftIcon={<Phone className="w-4 h-4" />}
                  error={errors.hospitalContact?.message}
                  required
                  {...register('hospitalContact')}
                />

                {/* Description */}
                <Textarea
                  label="Clinical Description"
                  placeholder="Describe the patient's condition, reason for transfusion, and any special requirements..."
                  rows={4}
                  error={errors.description?.message}
                  {...register('description')}
                />

                {/* Warning */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200">Admin Verification Required</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      All blood requests must be reviewed by an admin before being dispatched to the matching engine. Critical requests are prioritized within minutes.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="emergency"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Preview & Submit Request
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className={`border-2 ${conf.border}`}>
              <div className={`-mx-6 -mt-6 mb-6 px-6 py-3 rounded-t-2xl ${conf.bg}`}>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Review Your Blood Request Before Submitting
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Patient / Ward', value: preview.patientName },
                  { label: 'Blood Group', value: preview.bloodGroup },
                  { label: 'Units Required', value: `${preview.unitsRequired} unit(s)` },
                  { label: 'Urgency', value: <Badge variant={conf.variant} size="sm" pulse={preview.urgency === 'Critical'}>{preview.urgency}</Badge> },
                  { label: 'Location', value: preview.location },
                  { label: 'Required By', value: preview.requiredDate },
                  { label: 'Contact', value: preview.hospitalContact },
                ].map(f => (
                  <div key={f.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{f.label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{f.value}</p>
                  </div>
                ))}
                <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Clinical Description</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{preview.description}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setPreview(null)}>
                  ← Edit Details
                </Button>
                <Button
                  variant="emergency"
                  className="flex-1"
                  isLoading={loading}
                  onClick={confirmSubmit}
                  leftIcon={<Siren className="w-4 h-4" />}
                >
                  Confirm & Submit
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateBloodRequestPage;

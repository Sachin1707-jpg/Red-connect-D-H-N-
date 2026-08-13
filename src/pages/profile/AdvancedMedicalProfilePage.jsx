import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield, Droplet, Weight, Ruler, Activity, Heart, CheckCircle, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Textarea } from '../../components/common/Textarea';

const schema = z.object({
  weight:       z.string().min(1, 'Weight is required'),
  height:       z.string().min(1, 'Height is required'),
  bloodPressure:z.string().min(1, 'Blood pressure required'),
  hemoglobin:   z.string().min(1, 'Hemoglobin level required'),
  diseases:     z.string().optional(),
  medications:  z.string().optional(),
  allergies:    z.string().optional(),
});

const medicalHistory = [
  { date: '2026-03-12', event: 'Blood Donation — Metro General Hospital', result: 'Successful — O- · 1 unit', status: 'success' },
  { date: '2025-12-01', event: 'Blood Donation — City Blood Bank', result: 'Successful — O- · 1 unit', status: 'success' },
  { date: '2025-11-15', event: 'Annual Medical Check-up', result: 'All parameters normal. Eligible to donate.', status: 'info' },
  { date: '2025-09-10', event: 'Blood Donation — Red Cross Camp', result: 'Successful — O- · 1 unit', status: 'success' },
];

const AdvancedMedicalProfilePage = () => {
  const { user } = useSelector((s) => s.auth);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      weight: '64 kg', height: '172 cm', bloodPressure: '120/80 mmHg',
      hemoglobin: '14.2 g/dL', diseases: 'None', medications: 'None', allergies: 'None',
    }
  });

  const onSave = () => {
    toast.success('✅ Medical profile updated successfully!');
    setIsEditing(false);
  };

  const isEligible = true;
  const nextEligibleDate = '2026-09-12';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Advanced Medical Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete health record, eligibility status, and donation history for {user?.name}</p>
        </div>
        <Button variant={isEditing ? 'ghost' : 'outline'} size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Update Medical Info'}
        </Button>
      </div>

      {/* Eligibility Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        isEligible
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
          : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
      }`}>
        <CheckCircle className={`w-6 h-6 shrink-0 ${isEligible ? 'text-emerald-600' : 'text-red-600'}`} />
        <div>
          <p className={`font-bold text-sm ${isEligible ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
            {isEligible ? '✅ Currently Eligible to Donate Blood' : '⏸️ Currently Not Eligible to Donate'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Next eligible donation date: <strong>{nextEligibleDate}</strong></p>
        </div>
        <Badge variant={isEligible ? 'success' : 'danger'} className="ml-auto">{isEligible ? 'Eligible' : 'On Cooldown'}</Badge>
      </div>

      {/* Health Metrics */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Core Health Metrics
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Body Weight" placeholder="64 kg" leftIcon={<Weight className="w-4 h-4" />} readOnly={!isEditing} error={errors.weight?.message} {...register('weight')} />
          <Input label="Height" placeholder="172 cm" leftIcon={<Ruler className="w-4 h-4" />} readOnly={!isEditing} error={errors.height?.message} {...register('height')} />
          <Input label="Blood Pressure" placeholder="120/80 mmHg" leftIcon={<Heart className="w-4 h-4" />} readOnly={!isEditing} error={errors.bloodPressure?.message} {...register('bloodPressure')} />
          <Input label="Hemoglobin Level" placeholder="14.2 g/dL" leftIcon={<Droplet className="w-4 h-4" />} readOnly={!isEditing} error={errors.hemoglobin?.message} {...register('hemoglobin')} />
          <div className="md:col-span-2">
            <Textarea label="Known Diseases / Medical Conditions" placeholder="e.g., Hypertension, Diabetes, etc." rows={2} readOnly={!isEditing} {...register('diseases')} />
          </div>
          <Textarea label="Current Medications" placeholder="List any ongoing medications" rows={2} readOnly={!isEditing} {...register('medications')} />
          <Textarea label="Known Allergies" placeholder="e.g., Penicillin, Latex, etc." rows={2} readOnly={!isEditing} {...register('allergies')} />
        </form>
        {isEditing && (
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button variant="primary" isLoading={isSubmitting} onClick={handleSubmit(onSave)}>Save Medical Profile</Button>
          </div>
        )}
      </div>

      {/* Donation & Health Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Donation & Health Timeline
        </h2>
        <div className="space-y-4">
          {medicalHistory.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4">
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950/40" />
              <div className="flex-1 pb-4 border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.event}</p>
                  <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.result}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedMedicalProfilePage;

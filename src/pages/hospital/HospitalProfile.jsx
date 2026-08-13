import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Building2, Phone, MapPin, Clock, ShieldCheck, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MedicalDocumentUploader } from '../../components/forms/MedicalDocumentUploader';

const schema = z.object({
  hospitalName:    z.string().min(2),
  licenseNumber:   z.string().min(3),
  address:         z.string().min(5),
  city:            z.string().min(2),
  emergencyContact:z.string().min(7),
  departments:     z.string().min(3),
  operatingHours:  z.string().min(3),
  email:           z.string().email(),
  website:         z.string().optional(),
});

const HospitalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hospitalName:     'Metro General Hospital',
      licenseNumber:    'HOSP-55301-NY',
      address:          '120 Medical Center Drive, Sector 4',
      city:             'Metropolis',
      emergencyContact: '+1-555-EMERGENCY',
      departments:      'Trauma, Cardiology, Oncology, Neurology, Pediatrics',
      operatingHours:   '24/7 Emergency · OPD 8AM–8PM',
      email:            'emergency@metrogen.org',
      website:          'https://metrogenhospital.org',
    }
  });

  const onSave = (data) => {
    toast.success('✅ Hospital profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            Hospital Profile & Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage hospital registration details, license, and verification documents</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" leftIcon={<X className="w-4 h-4" />} onClick={() => { setIsEditing(false); reset(); }}>Cancel</Button>
              <Button variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSubmit(onSave)} isLoading={isSubmitting}>Save Profile</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {/* Verification Status */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Verified & Active Hospital Account</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">License validated by RedConnect Admin on 2026-01-15</p>
        </div>
        <Badge variant="success" className="ml-auto">Verified</Badge>
      </div>

      {/* Hospital Information */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">Hospital Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Hospital Name" leftIcon={<Building2 className="w-4 h-4" />} readOnly={!isEditing} error={errors.hospitalName?.message} {...register('hospitalName')} />
          <Input label="License Number" leftIcon={<ShieldCheck className="w-4 h-4" />} readOnly={!isEditing} error={errors.licenseNumber?.message} {...register('licenseNumber')} />
          <Input label="Address" leftIcon={<MapPin className="w-4 h-4" />} readOnly={!isEditing} error={errors.address?.message} {...register('address')} />
          <Input label="City" leftIcon={<MapPin className="w-4 h-4" />} readOnly={!isEditing} error={errors.city?.message} {...register('city')} />
          <Input label="Emergency Contact" leftIcon={<Phone className="w-4 h-4" />} readOnly={!isEditing} error={errors.emergencyContact?.message} {...register('emergencyContact')} />
          <Input label="Email" type="email" readOnly={!isEditing} error={errors.email?.message} {...register('email')} />
          <Input label="Operating Hours" leftIcon={<Clock className="w-4 h-4" />} readOnly={!isEditing} error={errors.operatingHours?.message} {...register('operatingHours')} />
          <Input label="Website" readOnly={!isEditing} error={errors.website?.message} {...register('website')} />
          <div className="md:col-span-2">
            <Textarea label="Departments / Specializations" readOnly={!isEditing} rows={2} {...register('departments')} />
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Verification Documents</h2>
        <MedicalDocumentUploader label="Hospital Operating License" description="Upload HOSP license certificate PDF or scan (PDF, PNG, JPG)" onUploadSuccess={() => toast.success('License document uploaded!')} />
        <MedicalDocumentUploader label="Government Registration Certificate" description="NGO/Trust Registration or Govt Hospital Authorization" onUploadSuccess={() => toast.success('Registration doc uploaded!')} />
      </div>
    </div>
  );
};

export default HospitalProfile;

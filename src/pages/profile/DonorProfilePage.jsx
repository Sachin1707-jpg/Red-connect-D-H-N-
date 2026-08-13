import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Droplets, Weight, Calendar, Shield, Trash2, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar } from '../../components/common/Avatar';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { Modal } from '../../components/common/Modal';
import { updateUserLocal } from '../../redux/authSlice';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  bloodGroup: z.string(),
  age: z.coerce.number().min(18).max(65),
  weight: z.string(),
  address: z.string(),
  emergencyContact: z.string(),
});

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bloodGroup: user?.bloodGroup || 'O-',
      age: user?.age || 28,
      weight: user?.weight || '64 kg',
      address: user?.address || '',
      emergencyContact: user?.emergencyContact || '',
    }
  });

  const onSave = async (data) => {
    dispatch(updateUserLocal({ ...data, isAvailable }));
    toast.success('✅ Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Header Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600" />

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar src={user?.avatar} name={user?.name} size="xl" bloodGroup={user?.bloodGroup} />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors">
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="blood" size="sm">{user?.bloodGroup}</Badge>
                  <Badge variant={user?.role === 'donor' ? 'info' : 'default'} size="sm" className="capitalize">{user?.role}</Badge>
                  <Badge variant={isAvailable ? 'success' : 'warning'} size="sm" pulse={isAvailable}>
                    {isAvailable ? 'Available' : 'On Break'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" leftIcon={<X className="w-4 h-4" />} onClick={() => { setIsEditing(false); reset(); }}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSubmit(onSave)} isLoading={isSubmitting}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Total Donations', value: user?.totalDonations || 8 },
              { label: 'Lives Saved', value: (user?.totalDonations || 8) * 3 },
              { label: 'Reward Points', value: user?.rewardPoints || 850 },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" leftIcon={<User className="w-4 h-4" />} error={errors.name?.message} readOnly={!isEditing} className={!isEditing ? 'opacity-70' : ''} {...register('name')} />
          <Input label="Email Address" type="email" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} readOnly={!isEditing} className={!isEditing ? 'opacity-70' : ''} {...register('email')} />
          <Input label="Phone Number" leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} readOnly={!isEditing} className={!isEditing ? 'opacity-70' : ''} {...register('phone')} />
          <Select label="Blood Group" options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))} leftIcon={<Droplets className="w-4 h-4" />} error={errors.bloodGroup?.message} disabled={!isEditing} {...register('bloodGroup')} />
          <Input label="Age" type="number" leftIcon={<Calendar className="w-4 h-4" />} error={errors.age?.message} readOnly={!isEditing} className={!isEditing ? 'opacity-70' : ''} {...register('age')} />
          <Input label="Weight" placeholder="64 kg" leftIcon={<Weight className="w-4 h-4" />} error={errors.weight?.message} readOnly={!isEditing} className={!isEditing ? 'opacity-70' : ''} {...register('weight')} />
          <Input label="Address" leftIcon={<MapPin className="w-4 h-4" />} error={errors.address?.message} readOnly={!isEditing} className={`md:col-span-2 ${!isEditing ? 'opacity-70' : ''}`} {...register('address')} />
          <Input label="Emergency Contact" leftIcon={<Shield className="w-4 h-4" />} error={errors.emergencyContact?.message} readOnly={!isEditing} className={!isEditing ? 'opacity-70' : ''} {...register('emergencyContact')} />
        </form>
      </div>

      {/* Medical Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          Medical Information & Availability
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Last Donation Date</p>
              <p className="text-xs text-slate-500">{user?.lastDonationDate || '2026-03-12'}</p>
            </div>
            <Badge variant="success">Eligible Now</Badge>
          </div>

          <ToggleSwitch
            checked={isAvailable}
            onChange={(v) => {
              setIsAvailable(v);
              dispatch(updateUserLocal({ isAvailable: v }));
              toast.success(v ? '✅ Now Available' : '⏸️ Status: On Break');
            }}
            label="Availability for Donations"
            description="When enabled, you will receive emergency blood request alerts"
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 w-full"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-6">
        <h2 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setShowDeleteModal(true)}>
          Delete My Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" subtitle="This action is permanent and cannot be reversed">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            Are you absolutely sure you want to delete your account? All your donation history, rewards, and profile data will be permanently erased.
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => { toast.error('Account deletion is disabled in demo mode.'); setShowDeleteModal(false); }}>
              Yes, Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DonorProfilePage;

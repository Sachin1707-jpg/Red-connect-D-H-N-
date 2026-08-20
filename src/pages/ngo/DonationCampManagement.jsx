import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Edit3, Trash2, MapPin, Users, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCamp, fetchCamps } from '../../redux/ngoSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';

const schema = z.object({
  title:    z.string().min(5, 'Event title required'),
  date:     z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location required'),
  target:   z.coerce.number().min(10, 'Minimum 10 units target'),
});

const DonationCampManagement = () => {
  const dispatch = useDispatch();
  const { camps } = useSelector((s) => s.ngo);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    dispatch(fetchCamps());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(createCamp({ id: `camp_${Date.now()}`, ...data, registered: 0 }));
    if (createCamp.fulfilled.match(result)) {
      toast.success(`🎉 "${data.title}" camp created and published!`);
      reset();
      setShowCreateModal(false);
    } else {
      toast.error('Failed to create camp. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Donation Camp Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create, schedule, and track community blood donation drives</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Create New Camp
        </Button>
      </div>

      {/* Camp Cards Grid */}
      {camps.length === 0
        ? <EmptyState title="No camps created yet" description="Create your first donation camp drive to get started." actionLabel="Create Camp" onAction={() => setShowCreateModal(true)} />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {camps.map((camp, i) => (
                <motion.div key={camp.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.1 }}>
                  <Card hoverable className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-primary"><Calendar className="w-5 h-5" /></div>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{camp.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" />{camp.location}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{camp.date}</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Registrations</span>
                        <span className="font-bold text-slate-900 dark:text-white">{camp.registered} / {camp.target}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full" style={{ width: `${Math.min((camp.registered / camp.target) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1" leftIcon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => toast.success('Edit camp (demo mode)')}>Edit</Button>
                      <Button variant="danger" size="sm" className="flex-1" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => toast.error('Delete camp (demo mode)')}>Delete</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      }

      {/* Create Camp Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Donation Camp" subtitle="All registered donors will receive a camp invitation notification">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Event Title" placeholder="Community Blood Drive 2026" error={errors.title?.message} required {...register('title')} />
          <Input label="Event Date" type="date" error={errors.date?.message} required {...register('date')} />
          <Input label="Venue / Location" placeholder="City Hall Main Auditorium, Sector 3" leftIcon={<MapPin className="w-4 h-4" />} error={errors.location?.message} required {...register('location')} />
          <Input label="Target Units" type="number" placeholder="150" leftIcon={<Users className="w-4 h-4" />} error={errors.target?.message} required {...register('target')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />} isLoading={isSubmitting}>Publish Camp</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DonationCampManagement;

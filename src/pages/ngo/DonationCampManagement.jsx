import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Plus, Edit3, Trash2, MapPin, Users, Save, X, Clock,
  Filter, Search, Droplets, CheckCircle, Bell, ArrowUpDown, Info, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createCamp, fetchCamps, updateCampLocal, deleteCampLocal } from '../../redux/ngoSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { StatsCard } from '../../components/ui/StatsCard';
import { SearchBar } from '../../components/ui/SearchBar';

const BLOOD_GROUPS = ['All Groups', 'O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const schema = z.object({
  title: z.string().min(3, 'Camp title required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().min(3, 'Location venue required'),
  address: z.string().min(5, 'Full address required'),
  target: z.coerce.number().min(5, 'Target must be at least 5 donors'),
  description: z.string().optional(),
  status: z.enum(['Upcoming', 'Active', 'Completed', 'Cancelled']).default('Upcoming'),
});

const DonationCampManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { camps = [] } = useSelector((s) => s.ngo);

  const [showModal, setShowModal] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  const [deleteConfirmCamp, setDeleteConfirmCamp] = useState(null);
  const [selectedBloodGroups, setSelectedBloodGroups] = useState(['All Groups']);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'Upcoming',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      target: 100,
    },
  });

  useEffect(() => {
    dispatch(fetchCamps());
  }, [dispatch]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCamp(null);
    setSelectedBloodGroups(['All Groups']);
    reset({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      location: '',
      address: '',
      target: 100,
      description: '',
      status: 'Upcoming',
    });
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (camp) => {
    setEditingCamp(camp);
    setSelectedBloodGroups(camp.requiredBloodGroups || ['All Groups']);
    setValue('title', camp.title);
    setValue('date', camp.date);
    setValue('startTime', camp.startTime || '09:00 AM');
    setValue('endTime', camp.endTime || '05:00 PM');
    setValue('location', camp.location);
    setValue('address', camp.address || camp.location);
    setValue('target', camp.target);
    setValue('description', camp.description || '');
    setValue('status', camp.status || 'Upcoming');
    setShowModal(true);
  };

  // Toggle blood group pills
  const toggleBloodGroup = (bg) => {
    if (bg === 'All Groups') {
      setSelectedBloodGroups(['All Groups']);
      return;
    }
    let updated = selectedBloodGroups.filter((g) => g !== 'All Groups');
    if (updated.includes(bg)) {
      updated = updated.filter((g) => g !== bg);
    } else {
      updated.push(bg);
    }
    if (updated.length === 0) updated = ['All Groups'];
    setSelectedBloodGroups(updated);
  };

  // Submit Handler (Create or Update)
  const onSubmit = async (data) => {
    const campPayload = {
      ...data,
      requiredBloodGroups: selectedBloodGroups,
      registered: editingCamp ? editingCamp.registered : 0,
      organizer: 'RedConnect NGO',
      contactPhone: '+91-98765-00300',
    };

    if (editingCamp) {
      dispatch(updateCampLocal({ id: editingCamp.id || editingCamp._id, ...campPayload }));
      toast.success(`✏️ Camp "${data.title}" updated successfully!`);
    } else {
      const newId = `camp_${Date.now()}`;
      dispatch(createCamp({ id: newId, ...campPayload }));
      toast.success(`🎉 Camp "${data.title}" created & published!`);
    }

    setShowModal(false);
    reset();
  };

  // Delete Handler
  const handleDeleteCamp = () => {
    if (!deleteConfirmCamp) return;
    const campId = deleteConfirmCamp.id || deleteConfirmCamp._id;
    dispatch(deleteCampLocal(campId));
    toast.success(`🗑️ Camp "${deleteConfirmCamp.title}" has been deleted.`);
    setDeleteConfirmCamp(null);
  };

  // Statistics calculation
  const totalCamps = camps.length;
  const upcomingCampsCount = camps.filter((c) => c.status === 'Upcoming').length;
  const activeCampsCount = camps.filter((c) => c.status === 'Active').length;
  const completedCampsCount = camps.filter((c) => c.status === 'Completed' || c.status === 'Fulfilled').length;
  const totalExpectedDonors = camps.reduce((acc, c) => acc + (c.target || 0), 0);

  // Filter & Sort Logic
  const filteredCamps = camps.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Completed'
        ? c.status === 'Completed' || c.status === 'Fulfilled'
        : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  filteredCamps.sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'target') return (b.target || 0) - (a.target || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'info';
      case 'Completed':
      case 'Fulfilled': return 'default';
      case 'Cancelled': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-red-500" />
            Donation Camp Management Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, schedule, edit, and manage voluntary community blood donation drives
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
          Create New Camp
        </Button>
      </div>

      {/* Stats Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Camps" value={totalCamps} icon={<Calendar className="w-5 h-5 text-slate-600 dark:text-slate-300" />} color="red" />
        <StatsCard title="Upcoming Drives" value={upcomingCampsCount} icon={<Clock className="w-5 h-5 text-indigo-500" />} color="indigo" />
        <StatsCard title="Active Drives" value={activeCampsCount} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="emerald" />
        <StatsCard title="Completed" value={completedCampsCount} icon={<Calendar className="w-5 h-5 text-slate-500" />} color="amber" />
        <StatsCard title="Expected Donors" value={totalExpectedDonors} icon={<Users className="w-5 h-5 text-red-500" />} color="red" />
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} placeholder="Search by camp title or location..." />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter:</span>
            {['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}

            <div className="flex items-center gap-1.5 ml-auto border-l border-slate-200 dark:border-slate-700 pl-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="target">Sort by Target Units</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Camp Cards Grid */}
      {filteredCamps.length === 0 ? (
        <EmptyState
          title="No donation camps match your filter"
          description="Try broadening your search keywords or create a new donation drive."
          actionLabel="Create New Camp"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCamps.map((camp, i) => (
              <motion.div
                key={camp.id || camp._id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hoverable className="h-full flex flex-col justify-between space-y-4 relative">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <Badge variant={getStatusBadgeVariant(camp.status)} size="sm">
                        {camp.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{camp.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{camp.location}</span>
                      </p>
                      {camp.address && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-4 truncate">{camp.address}</p>
                      )}
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1 mt-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {camp.date} ({camp.startTime || '09:00 AM'} - {camp.endTime || '05:00 PM'})
                      </p>
                    </div>

                    {/* Target Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                        <span>Expected Turnout</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {camp.registered || 0} / {camp.target} donors
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(((camp.registered || 0) / (camp.target || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Required Blood Groups Pills */}
                    {camp.requiredBloodGroups && camp.requiredBloodGroups.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        <span className="text-[11px] font-semibold text-slate-400">Needed:</span>
                        {camp.requiredBloodGroups.map((bg) => (
                          <span key={bg} className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 text-[11px] font-bold">
                            {bg}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description preview */}
                    {camp.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        {camp.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-xs" leftIcon={<Edit3 className="w-3.5 h-3.5" />} onClick={() => handleOpenEdit(camp)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" className="flex-1 text-xs" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setDeleteConfirmCamp(camp)}>
                        Delete
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30"
                      leftIcon={<Bell className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/ngo/notifications')}
                    >
                      Broadcast Alert for this Camp
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Camp Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCamp ? 'Edit Donation Camp Details' : 'Create New Donation Camp'}
        subtitle={editingCamp ? 'Modify event times, venue location, target donors, and status' : 'Publish a new community blood drive for registered donors'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Camp Event Title" placeholder="Community Blood Drive 2026" error={errors.title?.message} required {...register('title')} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Event Date" type="date" error={errors.date?.message} required {...register('date')} />
            <Input label="Start Time" placeholder="09:00 AM" error={errors.startTime?.message} {...register('startTime')} />
            <Input label="End Time" placeholder="05:00 PM" error={errors.endTime?.message} {...register('endTime')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Venue / Location Name" placeholder="NDMC Civic Centre, Sector 3" leftIcon={<MapPin className="w-4 h-4" />} error={errors.location?.message} required {...register('location')} />
            <Input label="Target Donor Count" type="number" placeholder="150" leftIcon={<Users className="w-4 h-4" />} error={errors.target?.message} required {...register('target')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Venue Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Building name, Street address, Sector, City"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              {...register('address')}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Required / Priority Blood Groups
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = selectedBloodGroups.includes(bg);
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => toggleBloodGroup(bg)}
                    className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Camp Status
              </label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                {...register('status')}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Notes
              </label>
              <input
                type="text"
                placeholder="Additional instructions for donors..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                {...register('description')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />} isLoading={isSubmitting}>
              {editingCamp ? 'Save Changes' : 'Publish Camp'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmCamp}
        onClose={() => setDeleteConfirmCamp(null)}
        title="Confirm Delete Camp"
        subtitle="Are you sure you want to delete or cancel this donation camp?"
      >
        {deleteConfirmCamp && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <p className="font-bold text-red-900 dark:text-red-300 text-sm">{deleteConfirmCamp.title}</p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">Date: {deleteConfirmCamp.date} | Venue: {deleteConfirmCamp.location}</p>
            </div>
            <p className="text-xs text-slate-500">This action will remove the camp drive from donor listings.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDeleteConfirmCamp(null)}>Cancel</Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteCamp}>Confirm Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DonationCampManagement;

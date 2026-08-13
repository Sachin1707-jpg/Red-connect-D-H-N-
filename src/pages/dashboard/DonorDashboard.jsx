import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Droplets, Users, Award, Clock, HeartHandshake, TrendingUp, Plus, Siren, UserCheck, History, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatsCard } from '../../components/ui/StatsCard';
import { QuickActionsPanel } from '../../components/ui/QuickActionsPanel';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { EmptyState } from '../../components/common/EmptyState';
import CreateRequestModal from '../requests/CreateRequestModal';
import { updateUserLocal } from '../../redux/authSlice';
import { fetchRequests } from '../../redux/requestSlice';
import { mockDonations } from '../../data/mockData';

const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning' };

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: requests, loading } = useSelector((s) => s.requests);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleToggleAvailability = async () => {
    setToggling(true);
    const newStatus = !user?.isAvailable;
    dispatch(updateUserLocal({ isAvailable: newStatus }));
    setTimeout(() => {
      setToggling(false);
      toast.success(newStatus ? '✅ You are now Available for donations!' : '⏸️ Status set to On Break');
    }, 500);
  };

  const activeRequests = requests.filter(r => r.status === 'Active').slice(0, 6);

  const columns = [
    { key: 'hospitalName', header: 'Hospital', render: (r) => <span className="font-semibold">{r.hospitalName}</span> },
    { key: 'bloodGroup', header: 'Blood Type', render: (r) => (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm shadow-sm shadow-red-500/30">{r.bloodGroup}</span>
    )},
    { key: 'urgency', header: 'Urgency', render: (r) => <Badge variant={urgencyVariant[r.urgency] || 'default'} pulse={r.urgency === 'Critical'}>{r.urgency}</Badge> },
    { key: 'unitsRequired', header: 'Units', render: (r) => <span className="font-bold text-slate-900 dark:text-white">{r.unitsRequired} units</span> },
    { key: 'distanceKm', header: 'Distance', render: (r) => <span className="text-slate-500">{r.distanceKm} km</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Fulfilled' ? 'success' : 'info'}>{r.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" isDisabled={r.status === 'Fulfilled'}>
          {r.status === 'Fulfilled' ? 'Fulfilled' : 'Pledge'}
        </Button>
      </div>
    )},
  ];

  const donationHistoryCols = [
    { key: 'hospitalName', header: 'Hospital' },
    { key: 'bloodGroup', header: 'Blood Type', render: (r) => <span className="font-bold text-red-600">{r.bloodGroup}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant="success">{r.status}</Badge> },
    { key: 'pointsEarned', header: 'Points', render: (r) => <span className="font-bold text-amber-500">+{r.pointsEarned}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${user?.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {user?.isAvailable ? 'You are currently available for donations' : 'Your status is set to On Break'}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Availability Status', value: user?.isAvailable ? 'Available' : 'On Break', icon: <UserCheck className="w-6 h-6" />, color: user?.isAvailable ? 'emerald' : 'amber', change: 'Click Quick Actions to toggle', changeType: 'neutral' },
          { title: 'Total Donations', value: user?.totalDonations || 8, icon: <Droplets className="w-6 h-6" />, color: 'red', change: '↑ 2 this year', changeType: 'positive' },
          { title: 'Lives Saved', value: user?.livesSaved || 24, icon: <Heart className="w-6 h-6" />, color: 'red', change: `${(user?.totalDonations || 8) * 3} units donated total`, changeType: 'positive' },
          { title: 'Reward Points', value: user?.rewardPoints || 850, icon: <Award className="w-6 h-6" />, color: 'amber', change: '↑ 100 since last month', changeType: 'positive' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActionsPanel
        onCreateRequest={() => setShowCreateModal(true)}
        onToggleAvailability={handleToggleAvailability}
        isAvailable={user?.isAvailable}
      />

      {/* Active Emergency Requests Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-500" />
              Active Emergency Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeRequests.length} requests matching your blood type in your area</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => dispatch(fetchRequests())}>Refresh</Button>
        </div>
        {activeRequests.length === 0 ? (
          <EmptyState title="No active requests nearby" description="There are no matching emergency requests in your area right now." className="border-0 rounded-none" />
        ) : (
          <Table columns={columns} data={activeRequests} isLoading={loading} />
        )}
      </div>

      {/* Donation History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/60">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            Recent Donation History
          </h2>
          <Button variant="ghost" size="sm" onClick={() => {}}>View All</Button>
        </div>
        <Table columns={donationHistoryCols} data={mockDonations} emptyMessage="No donations recorded yet." />
      </div>

      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default DonorDashboard;

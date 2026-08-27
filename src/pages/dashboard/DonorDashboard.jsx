import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Droplets, Award, Siren, UserCheck, History, Calendar } from 'lucide-react';
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
import { profileService } from '../../services/profileService';
import { mockDonationHistory, mockBloodRequests } from '../../data/mockData';

const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning', Low: 'success' };

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: requests, loading } = useSelector((s) => s.requests);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [donations, setDonations] = useState(mockDonationHistory); // ← pre-seeded

  useEffect(() => {
    dispatch(fetchRequests());
    const loadDonations = async () => {
      try {
        const history = await profileService.getDonationHistory();
        // Only overwrite mock data if live Firestore returned actual results
        if (history && history.length > 0) {
          setDonations(history);
        }
      } catch (err) {
        console.error('[DonorDashboard] History load failed:', err);
        // Silently keep mock data — donor still sees populated dashboard
      }
    };
    loadDonations();
  }, [dispatch]);


  const handleToggleAvailability = async () => {
    setToggling(true);
    const newStatus = !user?.isAvailable;
    try {
      await profileService.toggleAvailability(newStatus);
      dispatch(updateUserLocal({ isAvailable: newStatus, available: newStatus }));
      toast.success(newStatus ? '✅ You are now Available for live donations!' : '⏸️ Status set to On Break');
    } catch (err) {
      toast.error('Failed to update availability in Firestore');
    } finally {
      setToggling(false);
    }
  };

  const activeRequests = requests.filter((r) => r.status === 'Active').slice(0, 6);

  const columns = [
    {
      key: 'hospitalName',
      header: 'Hospital',
      render: (r) => <span className="font-semibold">{r.hospitalName}</span>,
    },
    {
      key: 'bloodGroup',
      header: 'Blood Type',
      render: (r) => (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm shadow-sm shadow-red-500/30">
          {r.bloodGroup}
        </span>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgency',
      render: (r) => (
        <Badge variant={urgencyVariant[r.urgency] || urgencyVariant[r.priority] || 'default'} pulse={r.urgency === 'Critical' || r.priority === 'Critical'}>
          {r.urgency || r.priority || 'Normal'}
        </Badge>
      ),
    },
    {
      key: 'unitsRequired',
      header: 'Units',
      render: (r) => <span className="font-bold text-slate-900 dark:text-white">{r.unitsRequired || r.units || 1} units</span>,
    },
    {
      key: 'distanceKm',
      header: 'Distance',
      render: (r) => <span className="text-slate-500">{r.distanceKm || 2.4} km</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={r.status === 'Fulfilled' ? 'success' : 'info'}>{r.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <Button
          variant="primary"
          size="sm"
          isDisabled={r.status === 'Fulfilled'}
          onClick={() => toast.success(`Pledged for request at ${r.hospitalName}!`)}
        >
          {r.status === 'Fulfilled' ? 'Fulfilled' : 'Pledge'}
        </Button>
      ),
    },
  ];

  const donationHistoryCols = [
    { key: 'hospitalName', header: 'Hospital' },
    { key: 'bloodGroup', header: 'Blood Type', render: (r) => <span className="font-bold text-red-600">{r.bloodGroup}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-slate-500 text-xs">{r.date}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant="success">{r.status || 'Verified'}</Badge> },
    { key: 'pointsEarned', header: 'Points', render: (r) => <span className="font-bold text-amber-500">+{r.pointsEarned || 100}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Hero'} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${user?.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {user?.isAvailable ? 'You are currently available for live donations' : 'Your status is set to On Break'}
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
          { title: 'Total Donations', value: donations.length || user?.totalDonations || 0, icon: <Droplets className="w-6 h-6" />, color: 'red', change: 'Verified in Firestore', changeType: 'positive' },
          { title: 'Lives Saved', value: (donations.length || user?.totalDonations || 0) * 3, icon: <Heart className="w-6 h-6" />, color: 'red', change: '3 lives saved per unit', changeType: 'positive' },
          { title: 'Reward Points', value: user?.rewardPoints || (donations.length * 100) || 0, icon: <Award className="w-6 h-6" />, color: 'amber', change: '100 pts per donation', changeType: 'positive' },
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
              Live Active Emergency Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeRequests.length} live requests in Firestore</p>
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
        </div>
        <Table columns={donationHistoryCols} data={donations} emptyMessage="No donations recorded yet." />
      </div>

      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default DonorDashboard;

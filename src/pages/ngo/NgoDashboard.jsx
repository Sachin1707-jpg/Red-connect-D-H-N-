import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, Calendar, Users, Plus, Bell, MapPin, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { fetchCamps } from '../../redux/ngoSlice';

const NgoDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { camps = [], volunteers = [], ngoNotifications = [] } = useSelector((s) => s.ngo);

  useEffect(() => {
    dispatch(fetchCamps());
  }, [dispatch]);

  const activeCamps = camps.filter((c) => c.status === 'Active');
  const upcomingCamps = camps.filter((c) => c.status === 'Upcoming');
  const completedCamps = camps.filter((c) => c.status === 'Completed' || c.status === 'Fulfilled');

  const totalExpectedDonors = camps.reduce((acc, c) => acc + (c.target || 0), 0);
  const totalRegisteredDonors = camps.reduce((acc, c) => acc + (c.registered || 0), 0);

  const campCols = [
    {
      key: 'title',
      header: 'Camp Drive',
      render: (c) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">{c.title}</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" /> {c.location}
          </p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      render: (c) => (
        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          <p>{c.date}</p>
          <p className="text-[11px] text-slate-400">{c.startTime || '09:00 AM'} - {c.endTime || '05:00 PM'}</p>
        </div>
      ),
    },
    {
      key: 'registered',
      header: 'Registered / Target',
      render: (c) => (
        <div>
          <span className="font-bold text-emerald-600">{c.registered || 0} / {c.target}</span>
          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full"
              style={{ width: `${Math.min(((c.registered || 0) / (c.target || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <Badge
          variant={
            c.status === 'Active'
              ? 'success'
              : c.status === 'Upcoming'
              ? 'info'
              : c.status === 'Completed' || c.status === 'Fulfilled'
              ? 'default'
              : 'danger'
          }
          size="sm"
        >
          {c.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-red-400" />
            NGO Community Management Portal
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Organize voluntary donation camps, manage volunteer rosters, and send donor notification alerts
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/ngo/camps')}>
            Manage Camps
          </Button>
          <Button variant="outline" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-white/20" leftIcon={<Bell className="w-4 h-4" />} onClick={() => navigate('/ngo/notifications')}>
            Send Broadcast Alert
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Active Donation Drives',
            value: activeCamps.length,
            icon: <Calendar className="w-6 h-6 text-red-500" />,
            color: 'red',
            change: `${camps.length} total drives`,
            changeType: 'neutral',
          },
          {
            title: 'Upcoming Drives',
            value: upcomingCamps.length,
            icon: <Calendar className="w-6 h-6 text-indigo-500" />,
            color: 'indigo',
            change: `${completedCamps.length} completed`,
            changeType: 'positive',
          },
          {
            title: 'Volunteers Rostered',
            value: volunteers.length,
            icon: <Users className="w-6 h-6 text-emerald-500" />,
            color: 'emerald',
            change: `${volunteers.filter((v) => v.status === 'Assigned').length} assigned`,
            changeType: 'positive',
          },
          {
            title: 'Total Donor Turnout',
            value: totalRegisteredDonors,
            icon: <HeartHandshake className="w-6 h-6 text-amber-500" />,
            color: 'amber',
            change: `Target: ${totalExpectedDonors} units`,
            changeType: 'positive',
          },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick Action Notification Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl text-white p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base">Broadcast Alerts to Donors & Volunteers</h2>
            <p className="text-xs text-white/90 mt-0.5">Send urgent blood requirement notifications, camp reminders, or schedule updates directly to donor lock screens.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white text-red-600 hover:bg-slate-100 shrink-0 border-0 font-bold"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/ngo/notifications')}
        >
          Open Notification Center
        </Button>
      </div>

      {/* Donation Camps List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            Donation Camps Overview
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/ngo/camps')}>
            View All Camps
          </Button>
        </div>
        <Table columns={campCols} data={camps.slice(0, 5)} />
      </div>
    </div>
  );
};

export default NgoDashboard;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Send, Smartphone, CheckCircle2, ShieldAlert, Sparkles,
  Users, Calendar, MapPin, Heart, Filter, AlertTriangle, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sendNgoNotificationLocal } from '../../redux/ngoSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { StatsCard } from '../../components/ui/StatsCard';
import { SearchBar } from '../../components/ui/SearchBar';

const NOTIFICATION_TYPES = [
  { value: 'requirement', label: '🩸 Blood Donation Requirement', icon: '🩸', defaultTitle: 'Blood Donation Requirement Alert' },
  { value: 'announcement', label: '📢 Donation Camp Announcement', icon: '📢', defaultTitle: 'Upcoming Donation Camp Drive' },
  { value: 'urgent', label: '🚨 Urgent Blood Requirement', icon: '🚨', defaultTitle: 'URGENT: Critical Blood Needed Immediately' },
  { value: 'reminder', label: '📅 Camp Reminder', icon: '📅', defaultTitle: 'Reminder: Upcoming Blood Camp' },
  { value: 'location_update', label: '📍 Location/Time Update', icon: '📍', defaultTitle: 'Important Schedule / Venue Update' },
  { value: 'general', label: 'ℹ️ General NGO Announcement', icon: 'ℹ️', defaultTitle: 'Community Health Announcement' },
];

const TARGET_AUDIENCES = [
  { value: 'All Registered Donors', label: 'All Registered Donors (2,450+)' },
  { value: 'O- & O+ Universal Donors', label: 'Universal Donors (O- & O+)' },
  { value: 'Specific Blood Group: O-', label: 'Specific Blood Group: O- Negative' },
  { value: 'Specific Blood Group: A+', label: 'Specific Blood Group: A+ Positive' },
  { value: 'Specific Blood Group: B+', label: 'Specific Blood Group: B+ Positive' },
  { value: 'Specific Blood Group: AB-', label: 'Specific Blood Group: AB- Negative' },
  { value: 'Camp Attendees', label: 'Camp Registered Attendees' },
  { value: 'Volunteers', label: 'Rostered NGO Volunteers' },
];

export default function NgoNotificationCenter() {
  const dispatch = useDispatch();
  const { ngoNotifications = [], camps = [] } = useSelector((s) => s.ngo);

  const [type, setType] = useState('announcement');
  const [targetAudience, setTargetAudience] = useState('All Registered Donors');
  const [title, setTitle] = useState('📢 Mega Community Blood Drive Announcement');
  const [message, setMessage] = useState('Join us for our upcoming donation camp at NDMC Civic Centre, Connaught Place. Register now to save lives!');
  const [priority, setPriority] = useState('Normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [isSending, setIsSending] = useState(false);

  const handleTypeChange = (e) => {
    const selectedVal = e.target.value;
    setType(selectedVal);
    const found = NOTIFICATION_TYPES.find((t) => t.value === selectedVal);
    if (found && (!title || title.startsWith('📢') || title.startsWith('🩸') || title.startsWith('🚨') || title.startsWith('📅') || title.startsWith('📍') || title.startsWith('ℹ️'))) {
      setTitle(`${found.icon} ${found.defaultTitle}`);
    }
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please provide both notification title and message');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      let recCount = 1250;
      if (targetAudience.includes('Universal')) recCount = 480;
      else if (targetAudience.includes('Specific')) recCount = 140;
      else if (targetAudience.includes('Camp')) recCount = 162;
      else if (targetAudience.includes('Volunteers')) recCount = 25;

      const newNotif = {
        id: `ngo_notif_${Date.now()}`,
        title,
        message,
        type,
        targetAudience,
        priority,
        sentAt: new Date().toISOString(),
        recipientCount: recCount,
        status: 'Delivered',
        sender: 'RedConnect NGO Admin',
      };

      dispatch(sendNgoNotificationLocal(newNotif));
      setIsSending(false);
      toast.success(`🚀 Notification broadcast sent to ${recCount} recipients!`);

      // Reset message
      setMessage('');
    }, 600);
  };

  // Filter history
  const filteredNotifications = ngoNotifications.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase()) || n.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'All' || n.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const historyColumns = [
    {
      key: 'title',
      header: 'Announcement / Alert',
      render: (n) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
        </div>
      ),
    },
    {
      key: 'targetAudience',
      header: 'Target Audience',
      render: (n) => (
        <div>
          <Badge variant="indigo" size="sm">{n.targetAudience}</Badge>
          <p className="text-[11px] text-slate-400 mt-1">{n.recipientCount} recipients</p>
        </div>
      ),
    },
    {
      key: 'sentAt',
      header: 'Sent Time',
      render: (n) => (
        <span className="text-xs text-slate-500 font-medium">
          {new Date(n.sentAt).toLocaleDateString()} at {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Delivery Status',
      render: (n) => (
        <Badge variant={n.status === 'Delivered' ? 'success' : 'warning'} size="sm">
          {n.status}
        </Badge>
      ),
    },
  ];

  const totalRecipients = ngoNotifications.reduce((acc, curr) => acc + (curr.recipientCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-red-500" />
            Donor & Volunteer Notification Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Broadcast blood requirement alerts, donation camp announcements, and volunteer briefings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Notifications Broadcast"
          value={ngoNotifications.length}
          icon={<Send className="w-6 h-6 text-red-500" />}
          change={`${totalRecipients.toLocaleString()} total deliveries`}
          changeType="positive"
          color="red"
        />
        <StatsCard
          title="Registered Donors Reached"
          value="2,450+"
          icon={<Users className="w-6 h-6 text-emerald-500" />}
          change="98.4% Delivery Success"
          changeType="positive"
          color="emerald"
        />
        <StatsCard
          title="Active Drives Notified"
          value={camps.filter((c) => c.status === 'Active').length}
          icon={<Calendar className="w-6 h-6 text-indigo-500" />}
          change="All active camps covered"
          changeType="neutral"
          color="indigo"
        />
        <StatsCard
          title="Urgent Alerts Sent"
          value={ngoNotifications.filter((n) => n.type === 'urgent').length}
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
          change="Instant push & SMS"
          changeType="neutral"
          color="amber"
        />
      </div>

      {/* Main Composer & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Sparkles className="w-5 h-5 text-red-500" />
            Compose New Broadcast Notification
          </h2>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notification Type
                </label>
                <select
                  value={type}
                  onChange={handleTypeChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                >
                  {NOTIFICATION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                >
                  {TARGET_AUDIENCES.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notification Headline / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter compelling broadcast title..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message Body <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write message details (date, venue, urgent requirement info)..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Urgency:</span>
                {['Normal', 'High', 'Critical'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setPriority(u)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors ${
                      priority === u
                        ? u === 'Critical'
                          ? 'bg-red-600 text-white'
                          : u === 'High'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSending}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send Broadcast Alert
              </Button>
            </div>
          </form>
        </div>

        {/* Live Device Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/5 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-red-500" />
              Live Mobile Notification Preview
            </span>
          </div>

          {/* Smartphone Mockup */}
          <div className="w-full max-w-sm bg-slate-950 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 relative">
            {/* Camera Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-4" />

            {/* Lock Screen Push Notification */}
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-4 text-white space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                  <span>RedConnect</span>
                </div>
                <span>Just now</span>
              </div>

              <div>
                <p className="font-bold text-sm text-white line-clamp-1">{title || 'Notification Title'}</p>
                <p className="text-xs text-slate-300 mt-1 line-clamp-3">
                  {message || 'Your notification body preview will appear here as donors see it on their lock screens.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Target: {targetAudience}</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready to dispatch
                </span>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-500 mt-4">
              Pushes directly to RedConnect Mobile App & Web Desktop
            </p>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-red-500" />
              Broadcast Notification History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review previously sent donor announcements, emergency alerts, and volunteer briefings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search history..."
              className="w-48 sm:w-64"
            />
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <Bell className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No notifications found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or send your first broadcast above.</p>
          </div>
        ) : (
          <Table columns={historyColumns} data={filteredNotifications} />
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, CheckCheck, Siren, Heart, Gift, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchNotifications, markAllNotificationsRead, deleteNotification, markNotificationRead } from '../../redux/notificationSlice';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

const typeConfig = {
  emergency: { icon: Siren, color: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  pledge_accepted: { icon: Heart, color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  reminder: { icon: Bell, color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  reward: { icon: Gift, color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
};

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.notifications);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = filter === 'all' ? items : filter === 'unread' ? items.filter(n => !n.read) : items.filter(n => n.type === filter);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<CheckCheck className="w-4 h-4" />}
            onClick={async () => {
              await dispatch(markAllNotificationsRead());
              toast.success('All notifications marked as read');
            }}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'emergency', label: '🚨 Emergency' },
          { key: 'reminder', label: '🩸 Reminders' },
          { key: 'reward', label: '🏆 Rewards' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Bell className="w-12 h-12 text-slate-400" />} title="No notifications" description="You're all caught up! We'll notify you of emergency requests and donation updates." />
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filtered.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.reminder;
              const Icon = config.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm transition-all ${
                    !notif.read ? `${config.border} border-l-4` : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${config.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${!notif.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5">{notif.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => dispatch(markNotificationRead(notif.id))}
                        className="text-[11px] text-primary font-semibold hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        await dispatch(deleteNotification(notif.id));
                        toast.success('Notification removed');
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default NotificationsPage;

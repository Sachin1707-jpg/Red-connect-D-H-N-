import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Globe, Lock, Trash2, LogOut, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleDarkMode } from '../../redux/themeSlice';
import { logoutUser } from '../../redux/authSlice';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector((s) => s.theme);
  const { user } = useSelector((s) => s.auth);

  const [notifications, setNotifications] = useState({
    emergency: true,
    reminders: true,
    rewards: true,
    systemUpdates: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    toast.success('Signed out successfully');
  };

  const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
      <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your preferences, security, and account settings</p>
      </div>

      {/* Appearance */}
      <SettingsSection title="Appearance" icon={Sun}>
        <ToggleSwitch
          checked={darkMode}
          onChange={() => {
            dispatch(toggleDarkMode());
            toast.success(darkMode ? '☀️ Light mode enabled' : '🌙 Dark mode enabled');
          }}
          label="Dark Mode"
          description="Switch between light and dark interface themes"
        />
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Language</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Interface language preference</p>
          </div>
          <select className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100">
            <option>English (US)</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notification Preferences" icon={Bell}>
        {[
          { key: 'emergency', label: 'Emergency Blood Alerts', desc: 'Critical O- and rare blood type urgency alerts within 25km' },
          { key: 'reminders', label: 'Eligibility Reminders', desc: 'Notify me when I am eligible to donate again' },
          { key: 'rewards', label: 'Rewards & Badges', desc: 'Points earned and badge unlocked notifications' },
          { key: 'systemUpdates', label: 'System Announcements', desc: 'Platform updates and new feature announcements' },
        ].map((n) => (
          <ToggleSwitch
            key={n.key}
            checked={notifications[n.key]}
            onChange={(v) => {
              setNotifications(prev => ({ ...prev, [n.key]: v }));
              toast.success(`${n.label} ${v ? 'enabled' : 'disabled'}`);
            }}
            label={n.label}
            description={n.desc}
          />
        ))}
      </SettingsSection>

      {/* Security */}
      <SettingsSection title="Security & Privacy" icon={Shield}>
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Change Password</p>
            <p className="text-xs text-slate-500">Last changed: never</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setChangingPassword(!changingPassword)}>
            {changingPassword ? 'Cancel' : 'Update'}
          </Button>
        </div>

        {changingPassword && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <Input label="Current Password" type="password" placeholder="Your current password" />
            <Input label="New Password" type="password" placeholder="Create a strong password" />
            <Input label="Confirm New Password" type="password" placeholder="Repeat new password" />
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="ghost" size="sm" onClick={() => setChangingPassword(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => { toast.success('Password updated (demo mode)'); setChangingPassword(false); }}>
                Save New Password
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Profile Visibility</p>
            <p className="text-xs text-slate-500">Make your donor profile visible to hospitals</p>
          </div>
          <Badge variant="success">Public</Badge>
        </div>
      </SettingsSection>

      {/* Account Actions */}
      <SettingsSection title="Account" icon={Lock}>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" leftIcon={<LogOut className="w-4 h-4" />} onClick={() => setShowLogoutModal(true)}>
            Sign Out
          </Button>
          <Button variant="danger" className="flex-1" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </div>
      </SettingsSection>

      {/* Logout confirmation */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Sign Out">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to sign out from RedConnect? You'll need to sign in again to access your dashboard.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button variant="primary" leftIcon={<LogOut className="w-4 h-4" />} onClick={handleLogout}>Yes, Sign Out</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" subtitle="This cannot be undone">
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            ⚠️ All your donation history, badges, and reward points will be permanently deleted.
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { toast.error('Account deletion disabled in demo mode.'); setShowDeleteModal(false); }}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;

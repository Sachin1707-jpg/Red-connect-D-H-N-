import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Bell, CheckCircle, UserCheck, Filter, Send, MapPin,
  Clock, Shield, Sparkles, LayoutGrid, List, Heart, X, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { assignVolunteerThunk, updateVolunteerLocal, sendNgoNotificationLocal } from '../../redux/ngoSlice';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { SearchBar } from '../../components/ui/SearchBar';
import { Avatar } from '../../components/common/Avatar';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/common/Card';

const ROLES = [
  { value: 'Registration Desk', label: 'Registration Desk' },
  { value: 'Donor Assistance', label: 'Donor Assistance' },
  { value: 'Medical Support', label: 'Medical Support' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Camp Coordinator', label: 'Camp Coordinator' },
];

const VolunteerManagement = () => {
  const dispatch = useDispatch();
  const { volunteers = [] } = useSelector((s) => s.ngo);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modals state
  const [reassignVolunteer, setReassignVolunteer] = useState(null);
  const [assignRole, setAssignRole] = useState('');
  const [notifyVolunteer, setNotifyVolunteer] = useState(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Statistics
  const totalVolunteers = volunteers.length;
  const assignedCount = volunteers.filter((v) => v.status === 'Assigned').length;
  const availableCount = volunteers.filter((v) => v.availability === 'Available' || v.status === 'Available').length;
  const onBreakCount = volunteers.filter((v) => v.availability === 'On Break' || v.status === 'Pending').length;

  // Filter logic
  const filtered = volunteers.filter((v) => {
    const matchesSearch =
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.role.toLowerCase().includes(search.toLowerCase()) ||
      (v.location && v.location.toLowerCase().includes(search.toLowerCase())) ||
      (v.bloodGroup && v.bloodGroup.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Assigned'
        ? v.status === 'Assigned'
        : statusFilter === 'Available'
        ? v.availability === 'Available'
        : statusFilter === 'On Break'
        ? v.availability === 'On Break'
        : v.status === statusFilter;

    const matchesRole = roleFilter === 'All' || v.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleAssign = () => {
    if (!assignRole) {
      toast.error('Please select a role first');
      return;
    }
    const volId = reassignVolunteer.id || reassignVolunteer._id;
    dispatch(assignVolunteerThunk({ id: volId, role: assignRole }));
    dispatch(updateVolunteerLocal({ id: volId, role: assignRole, status: 'Assigned' }));
    toast.success(`✅ ${reassignVolunteer.name} reassigned to "${assignRole}"`);
    setReassignVolunteer(null);
    setAssignRole('');
  };

  const handleOpenNotifyModal = (volunteer) => {
    setNotifyVolunteer(volunteer);
    setNotifTitle(`📍 Duty Alert: ${volunteer.role || 'Camp Volunteer'}`);
    setNotifMessage(`Hi ${volunteer.name}, please report to your assigned post for the upcoming blood drive.`);
  };

  const handleSendVolunteerNotification = (e) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error('Please enter notification title and message');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      dispatch(
        sendNgoNotificationLocal({
          id: `notif_vol_${Date.now()}`,
          title: notifTitle,
          message: notifMessage,
          type: 'location_update',
          targetAudience: `Volunteer: ${notifyVolunteer.name}`,
          sentAt: new Date().toISOString(),
          recipientCount: 1,
          status: 'Delivered',
          sender: 'RedConnect NGO Admin',
        })
      );

      setIsSending(false);
      toast.success(`🔔 Direct alert sent to ${notifyVolunteer.name}!`);
      setNotifyVolunteer(null);
      setNotifTitle('');
      setNotifMessage('');
    }, 500);
  };

  const columns = [
    {
      key: 'name',
      header: 'Volunteer',
      render: (v) => (
        <div className="flex items-center gap-3">
          <Avatar name={v.name} size="md" bloodGroup={v.bloodGroup} />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</p>
            <p className="text-xs text-slate-500 truncate">{v.email || `${v.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      render: (v) => (
        <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-extrabold text-xs">
          {v.bloodGroup || 'O+'}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (v) => (
        <div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v.role}</span>
          {v.location && (
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-red-400" /> {v.location}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'availability',
      header: 'Availability',
      render: (v) => (
        <Badge
          variant={
            v.availability === 'Available'
              ? 'success'
              : v.availability === 'On Break'
              ? 'warning'
              : 'default'
          }
          size="sm"
        >
          {v.availability || 'Available'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Duty Status',
      render: (v) => (
        <Badge variant={v.status === 'Assigned' ? 'info' : 'warning'} size="sm">
          {v.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (v) => (
        <div className="flex items-center gap-2">
          {/* NOTIFY BUTTON (REPLACES PHONE CALL ICON) */}
          <Button
            variant="primary"
            size="sm"
            className="text-xs px-2.5 py-1.5"
            leftIcon={<Bell className="w-3.5 h-3.5" />}
            onClick={() => handleOpenNotifyModal(v)}
          >
            Notify
          </Button>

          {/* REASSIGN BUTTON */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-2.5 py-1.5"
            leftIcon={<UserCheck className="w-3.5 h-3.5" />}
            onClick={() => {
              setReassignVolunteer(v);
              setAssignRole(v.role);
            }}
          >
            Reassign
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-red-500" />
            Volunteer Roster Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign duties, send direct notifications, and track volunteer availability rosters
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Volunteers" value={totalVolunteers} icon={<Users className="w-6 h-6 text-indigo-500" />} color="indigo" />
        <StatsCard title="Assigned on Duty" value={assignedCount} icon={<UserCheck className="w-6 h-6 text-emerald-500" />} color="emerald" />
        <StatsCard title="Available Volunteers" value={availableCount} icon={<CheckCircle className="w-6 h-6 text-red-500" />} color="red" />
        <StatsCard title="On Break / Pending" value={onBreakCount} icon={<Clock className="w-6 h-6 text-amber-500" />} color="amber" />
      </div>

      {/* Filter and View Mode Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Search by name, role, blood group..."
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
            {['All', 'Assigned', 'Available', 'On Break', 'Pending'].map((status) => (
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

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Roles</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-red-500 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg ${viewMode === 'cards' ? 'bg-red-500 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center text-slate-500">
          <Users className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
          <p className="font-bold text-slate-800 dark:text-white">No volunteers match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search keywords.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <Table columns={columns} data={filtered} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((v, i) => (
              <motion.div key={v.id || v._id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hoverable className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={v.name} size="md" bloodGroup={v.bloodGroup} />
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{v.name}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[160px]">{v.email || 'volunteer@example.com'}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-black text-xs">
                      {v.bloodGroup || 'O+'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Assigned Duty:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{v.role}</span>
                    </div>
                    {v.location && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Location:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{v.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-400 font-medium">Availability:</span>
                      <Badge variant={v.availability === 'Available' ? 'success' : 'warning'} size="sm">
                        {v.availability || 'Available'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Duty Status:</span>
                      <Badge variant={v.status === 'Assigned' ? 'info' : 'warning'} size="sm">
                        {v.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    {/* NOTIFY BUTTON (REPLACES PHONE CALL ICON) */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                      leftIcon={<Bell className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenNotifyModal(v)}
                    >
                      Notify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setReassignVolunteer(v);
                        setAssignRole(v.role);
                      }}
                    >
                      Reassign
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Notify Volunteer Modal */}
      <Modal
        isOpen={!!notifyVolunteer}
        onClose={() => setNotifyVolunteer(null)}
        title={`Send Direct Alert to ${notifyVolunteer?.name || 'Volunteer'}`}
        subtitle="Send an instant broadcast alert or duty update directly to this volunteer's device"
      >
        {notifyVolunteer && (
          <form onSubmit={handleSendVolunteerNotification} className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Avatar name={notifyVolunteer.name} size="md" bloodGroup={notifyVolunteer.bloodGroup} />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{notifyVolunteer.name}</p>
                <p className="text-xs text-slate-500">Role: {notifyVolunteer.role} | Blood Group: {notifyVolunteer.bloodGroup || 'O+'}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notification Subject / Title
              </label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alert Message Body
              </label>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setNotifyVolunteer(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSending} leftIcon={<Send className="w-4 h-4" />}>
                Send Notification
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Reassign Duty Modal */}
      <Modal
        isOpen={!!reassignVolunteer}
        onClose={() => setReassignVolunteer(null)}
        title="Reassign Volunteer Duty Role"
        subtitle="Update this volunteer's duty assignment for upcoming donation drives"
      >
        {reassignVolunteer && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Avatar name={reassignVolunteer.name} size="md" bloodGroup={reassignVolunteer.bloodGroup} />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{reassignVolunteer.name}</p>
                <p className="text-xs text-slate-500">Currently: {reassignVolunteer.role}</p>
              </div>
            </div>

            <Select
              label="New Role Assignment"
              options={ROLES}
              value={assignRole}
              onChange={(e) => setAssignRole(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setReassignVolunteer(null)}>
                Cancel
              </Button>
              <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={handleAssign}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerManagement;

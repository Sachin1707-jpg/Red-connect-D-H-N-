import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Users, Search, Edit3, Trash2, ShieldCheck, ShieldOff, UserX, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUserRoleStatus } from '../../redux/adminSlice';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';

const ITEMS_PER_PAGE = 4;

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((s) => s.admin);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusChange = (id, status, userName) => {
    dispatch(updateUserRoleStatus({ id, status }));
    toast.success(`User "${userName}" status changed to ${status}`);
    setSelectedUser(null);
  };

  const columns = [
    {
      key: 'name', header: 'User', render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="sm" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
            <p className="text-xs text-slate-500">{u.email}</p>
          </div>
        </div>
      )
    },
    { key: 'role', header: 'Role', render: (u) => <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'hospital' ? 'info' : 'default'} size="sm" className="capitalize">{u.role}</Badge> },
    { key: 'status', header: 'Status', render: (u) => <Badge variant={u.status === 'Active' ? 'success' : u.status === 'Suspended' ? 'danger' : 'warning'}>{u.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (u) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)}>Manage</Button>
          {u.status === 'Active'
            ? <Button variant="warning" size="sm" leftIcon={<ShieldOff className="w-3.5 h-3.5" />} onClick={() => handleStatusChange(u.id, 'Suspended', u.name)}>Suspend</Button>
            : <Button variant="success" size="sm" leftIcon={<ShieldCheck className="w-3.5 h-3.5" />} onClick={() => handleStatusChange(u.id, 'Active', u.name)}>Activate</Button>
          }
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" />
          Platform User Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search, filter, and moderate all registered donors, hospitals, and NGOs</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} onClear={() => { setSearch(''); setPage(1); }} placeholder="Search by name or email..." className="sm:max-w-xs" />
        <div className="flex gap-2">
          {['ALL', 'donor', 'hospital', 'ngo', 'admin'].map((r) => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${roleFilter === r ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <Table columns={columns} data={paginated} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Manage User Account" subtitle="Review and modify user role and account status">
        {selectedUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <Avatar name={selectedUser.name} size="md" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedUser.name}</p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="info" size="sm" className="capitalize">{selectedUser.role}</Badge>
                  <Badge variant={selectedUser.status === 'Active' ? 'success' : 'danger'} size="sm">{selectedUser.status}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="success" onClick={() => handleStatusChange(selectedUser.id, 'Active', selectedUser.name)} leftIcon={<ShieldCheck className="w-4 h-4" />}>Activate</Button>
              <Button variant="warning" onClick={() => handleStatusChange(selectedUser.id, 'Suspended', selectedUser.name)} leftIcon={<ShieldOff className="w-4 h-4" />}>Suspend</Button>
              <Button variant="danger" className="col-span-2" leftIcon={<UserX className="w-4 h-4" />} onClick={() => { toast.error('Deletion disabled in demo mode.'); setSelectedUser(null); }}>
                Delete Account Permanently
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;

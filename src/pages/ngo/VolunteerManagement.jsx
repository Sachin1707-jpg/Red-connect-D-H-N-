import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Users, Phone, CheckCircle, UserCheck, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignVolunteer } from '../../redux/ngoSlice';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { SearchBar } from '../../components/ui/SearchBar';
import { Avatar } from '../../components/common/Avatar';

const ROLES = [
  { value: 'Registration Desk', label: 'Registration Desk' },
  { value: 'Donor Assistance', label: 'Donor Assistance' },
  { value: 'Medical Support', label: 'Medical Support' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Camp Coordinator', label: 'Camp Coordinator' },
];

const VolunteerManagement = () => {
  const dispatch = useDispatch();
  const { volunteers } = useSelector((s) => s.ngo);
  const [search, setSearch] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assignRole, setAssignRole] = useState('');

  const filtered = volunteers.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = () => {
    if (!assignRole) { toast.error('Please select a role first'); return; }
    dispatch(assignVolunteer({ id: selectedVolunteer.id, role: assignRole }));
    toast.success(`✅ ${selectedVolunteer.name} assigned to "${assignRole}"`);
    setSelectedVolunteer(null);
    setAssignRole('');
  };

  const columns = [
    {
      key: 'name', header: 'Volunteer', render: (v) => (
        <div className="flex items-center gap-3">
          <Avatar name={v.name} size="sm" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{v.name}</p>
            <p className="text-xs text-slate-500">{v.phone}</p>
          </div>
        </div>
      )
    },
    { key: 'role', header: 'Role', render: (v) => <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{v.role}</span> },
    { key: 'status', header: 'Status', render: (v) => <Badge variant={v.status === 'Assigned' ? 'success' : 'warning'}>{v.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (v) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<UserCheck className="w-3.5 h-3.5" />} onClick={() => { setSelectedVolunteer(v); setAssignRole(v.role); }}>
            Reassign
          </Button>
          <a href={`tel:${v.phone}`} className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors">
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" />
          Volunteer Roster Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Assign, contact, and track all camp volunteers by role and availability</p>
      </div>

      <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Search volunteer by name or role..." className="max-w-sm" />

      <Table columns={columns} data={filtered} />

      <Modal isOpen={!!selectedVolunteer} onClose={() => setSelectedVolunteer(null)} title="Reassign Volunteer Role" subtitle="Update this volunteer's duty assignment for the upcoming camp">
        {selectedVolunteer && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <Avatar name={selectedVolunteer.name} size="md" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedVolunteer.name}</p>
                <p className="text-xs text-slate-500">Currently: {selectedVolunteer.role}</p>
              </div>
            </div>
            <Select label="New Role Assignment" options={ROLES} value={assignRole} onChange={(e) => setAssignRole(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedVolunteer(null)}>Cancel</Button>
              <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={handleAssign}>Confirm Assignment</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerManagement;

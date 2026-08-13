import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, CheckCircle, X, MessageSquare, MapPin, User, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateDonorStatus } from '../../redux/hospitalSlice';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';

const DonorResponses = () => {
  const dispatch = useDispatch();
  const { donorResponses } = useSelector((s) => s.hospital);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDonor, setSelectedDonor] = useState(null);

  const filtered = donorResponses.filter((d) => {
    const matchSearch = !search || d.donorName.toLowerCase().includes(search.toLowerCase()) || d.bloodGroup.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAccept = (id, name) => {
    dispatch(updateDonorStatus({ id, status: 'Accepted' }));
    toast.success(`✅ ${name} accepted! They will be notified to arrive.`);
    setSelectedDonor(null);
  };

  const handleReject = (id, name) => {
    dispatch(updateDonorStatus({ id, status: 'Rejected' }));
    toast.error(`❌ ${name} pledge declined.`);
    setSelectedDonor(null);
  };

  const columns = [
    {
      key: 'donorName', header: 'Donor', render: (d) => (
        <div className="flex items-center gap-3">
          <Avatar name={d.donorName} size="sm" bloodGroup={d.bloodGroup} />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{d.donorName}</p>
            <p className="text-xs text-slate-500">{d.distance}</p>
          </div>
        </div>
      )
    },
    { key: 'bloodGroup', header: 'Blood Group', render: (d) => <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white font-black shadow-sm">{d.bloodGroup}</span> },
    { key: 'distance', header: 'Distance', render: (d) => <span className="text-slate-500 text-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-400" />{d.distance}</span> },
    { key: 'availability', header: 'Availability', render: (d) => <Badge variant="success" size="sm">{d.availability}</Badge> },
    { key: 'status', header: 'Status', render: (d) => <Badge variant={d.status === 'Accepted' ? 'success' : d.status === 'Rejected' ? 'danger' : 'warning'}>{d.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (d) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDonor(d)}>View</Button>
          {d.status === 'Pending' && (
            <>
              <Button variant="success" size="sm" onClick={() => handleAccept(d.id, d.donorName)}>Accept</Button>
              <Button variant="danger" size="sm" onClick={() => handleReject(d.id, d.donorName)}>Reject</Button>
            </>
          )}
          <a href={`tel:${d.phone}`} className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors">
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-7 h-7 text-primary" />
          Donor Pledge & Response Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review, accept, or decline incoming donor pledges for active blood requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Search donor name or blood group..." className="sm:max-w-xs" />
        <div className="flex gap-2">
          {['ALL', 'Pending', 'Accepted', 'Rejected'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0
        ? <EmptyState title="No donors found" description="Adjust search or status filter to find donor pledges." />
        : <Table columns={columns} data={filtered} />
      }

      {/* Donor Detail Modal */}
      <Modal isOpen={!!selectedDonor} onClose={() => setSelectedDonor(null)} title="Donor Pledge Details" subtitle="Review donor profile before accepting their pledge">
        {selectedDonor && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selectedDonor.donorName} size="xl" bloodGroup={selectedDonor.bloodGroup} />
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">{selectedDonor.donorName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="blood" size="sm">{selectedDonor.bloodGroup}</Badge>
                  <Badge variant={selectedDonor.status === 'Accepted' ? 'success' : 'warning'} size="sm">{selectedDonor.status}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Distance', value: selectedDonor.distance },
                { label: 'Availability', value: selectedDonor.availability },
                { label: 'Phone', value: selectedDonor.phone },
                { label: 'Pledge Status', value: selectedDonor.status },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-[11px] text-slate-500 uppercase font-semibold">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            {selectedDonor.status === 'Pending' && (
              <div className="flex gap-3 pt-2">
                <Button variant="danger" className="flex-1" leftIcon={<X className="w-4 h-4" />} onClick={() => handleReject(selectedDonor.id, selectedDonor.donorName)}>Decline Pledge</Button>
                <Button variant="success" className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={() => handleAccept(selectedDonor.id, selectedDonor.donorName)}>Accept Pledge</Button>
              </div>
            )}
            <a href={`tel:${selectedDonor.phone}`} className="block">
              <Button variant="outline" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>Call Donor Directly</Button>
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DonorResponses;

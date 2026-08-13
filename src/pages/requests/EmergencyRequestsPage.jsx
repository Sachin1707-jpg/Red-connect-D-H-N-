import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Clock, Phone, AlertTriangle, CheckCircle2, Plus, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchRequests, pledgeBloodRequest, setFilterBloodGroup, setFilterUrgency, setSearchQuery, setCurrentPage } from '../../redux/requestSlice';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import CreateRequestModal from './CreateRequestModal';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCIES = ['ALL', 'Critical', 'High', 'Medium'];
const ITEMS_PER_PAGE = 6;

const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning' };
const urgencyIcon = { Critical: '🚨', High: '🔴', Medium: '🟡' };

const EmergencyRequestsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, filters, pagination } = useSelector((s) => s.requests);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pledging, setPledging] = useState(null);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const filtered = items.filter((r) => {
    const matchGroup = filters.bloodGroup === 'ALL' || r.bloodGroup === filters.bloodGroup;
    const matchUrgency = filters.urgency === 'ALL' || r.urgency === filters.urgency;
    const matchSearch = !filters.search ||
      r.hospitalName.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.location.toLowerCase().includes(filters.search.toLowerCase());
    return matchGroup && matchUrgency && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (pagination.currentPage - 1) * ITEMS_PER_PAGE,
    pagination.currentPage * ITEMS_PER_PAGE
  );

  const handlePledge = async (requestId) => {
    setPledging(requestId);
    const result = await dispatch(pledgeBloodRequest(requestId));
    setPledging(null);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('🩸 Pledge confirmed! The hospital has been notified. Thank you for saving a life!');
      setSelectedRequest(null);
    } else {
      toast.error('Pledge failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Emergency Blood Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} active request{filtered.length !== 1 ? 's' : ''} — Updated live
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => dispatch(fetchRequests())}>
            Refresh
          </Button>
          <Button variant="emergency" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            Create Request
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchBar
            value={filters.search}
            onChange={(v) => { dispatch(setSearchQuery(v)); dispatch(setCurrentPage(1)); }}
            onClear={() => { dispatch(setSearchQuery('')); dispatch(setCurrentPage(1)); }}
          />
          <div className="flex gap-1.5 flex-wrap">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => { dispatch(setFilterBloodGroup(g)); dispatch(setCurrentPage(1)); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filters.bloodGroup === g
                    ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {URGENCIES.map((u) => (
              <button
                key={u}
                onClick={() => { dispatch(setFilterUrgency(u)); dispatch(setCurrentPage(1)); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filters.urgency === u
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {u !== 'ALL' && `${urgencyIcon[u]} `}{u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Request Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12 text-slate-400" />}
          title="No requests match your filters"
          description="Try adjusting your blood group or urgency filter, or clear the search query."
          actionLabel="Clear All Filters"
          onAction={() => {
            dispatch(setFilterBloodGroup('ALL'));
            dispatch(setFilterUrgency('ALL'));
            dispatch(setSearchQuery(''));
          }}
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filters.bloodGroup}-${filters.urgency}-${pagination.currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginated.map((req) => (
              <motion.div key={req.id} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
                <div className={`relative rounded-2xl border bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  req.urgency === 'Critical' ? 'border-red-400 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                }`}>
                  {req.urgency === 'Critical' && (
                    <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-rose-500 animate-pulse" />
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-500/30 shrink-0">
                          {req.bloodGroup}
                        </div>
                        <div>
                          <Badge variant={urgencyVariant[req.urgency] || 'default'} size="sm" pulse={req.urgency === 'Critical'}>
                            {urgencyIcon[req.urgency]} {req.urgency}
                          </Badge>
                          <Badge variant={req.status === 'Fulfilled' ? 'success' : 'info'} size="sm" className="ml-1">
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">Units</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{req.unitsRequired}</p>
                        <p className="text-[11px] text-emerald-500 font-semibold">{req.unitsPledged} pledged</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{req.hospitalName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{req.patientName}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" />{req.distanceKm} km</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" />{req.requiredDate}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>{req.unitsPledged} of {req.unitsRequired} units pledged</span>
                        <span className="font-semibold text-emerald-500">{Math.round((req.unitsPledged / req.unitsRequired) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(req.unitsPledged / req.unitsRequired) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedRequest(req)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant={req.status === 'Fulfilled' ? 'success' : 'primary'}
                        size="sm"
                        className="flex-1"
                        isDisabled={req.status === 'Fulfilled'}
                        isLoading={pledging === req.id}
                        leftIcon={<Heart className="w-3.5 h-3.5" />}
                        onClick={() => handlePledge(req.id)}
                      >
                        {req.status === 'Fulfilled' ? 'Fulfilled ✓' : 'Pledge Help'}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={totalPages}
        onPageChange={(p) => dispatch(setCurrentPage(p))}
      />

      {/* Create Request Modal */}
      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Request Detail Modal */}
      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Blood Request Details" subtitle="Contact the hospital for arrival coordination">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-2xl shadow-lg">
                {selectedRequest.bloodGroup}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedRequest.hospitalName}</p>
                <p className="text-sm text-slate-500">{selectedRequest.patientName}</p>
                <Badge variant={urgencyVariant[selectedRequest.urgency] || 'default'} className="mt-1" pulse={selectedRequest.urgency === 'Critical'}>
                  {selectedRequest.urgency}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Units Required', value: selectedRequest.unitsRequired },
                { label: 'Units Pledged', value: selectedRequest.unitsPledged },
                { label: 'Required Date', value: selectedRequest.requiredDate },
                { label: 'Distance', value: `${selectedRequest.distanceKm} km` },
              ].map((d) => (
                <div key={d.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wide">{d.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wide mb-1">Clinical Notes</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{selectedRequest.description}</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Hospital Contact</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest.hospitalContact}</p>
              </div>
              <a href={`tel:${selectedRequest.hospitalContact}`} className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <Button
              variant={selectedRequest.status === 'Fulfilled' ? 'success' : 'emergency'}
              size="lg"
              className="w-full"
              isDisabled={selectedRequest.status === 'Fulfilled'}
              isLoading={pledging === selectedRequest.id}
              leftIcon={<Heart className="w-5 h-5" />}
              onClick={() => handlePledge(selectedRequest.id)}
            >
              {selectedRequest.status === 'Fulfilled' ? 'Request Already Fulfilled ✓' : 'Confirm My Pledge to Donate'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmergencyRequestsPage;

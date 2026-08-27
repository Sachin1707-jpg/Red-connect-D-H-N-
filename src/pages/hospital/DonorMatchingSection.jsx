import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Bell, Filter, Users, Sparkles, CheckCircle2, ShieldCheck, Siren } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockNearbyDonors, mockBloodRequests } from '../../data/mockData';
import { isBloodCompatible } from '../../services/matchingService';
import { donorService } from '../../services/donorService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = ['ALL', 'Critical', 'High', 'Medium'];

export const DonorMatchingSection = () => {
  // 1. Combine Redux requests with mock requests as initial/fallback data
  const reduxRequests = useSelector((s) => s.requests.items) || [];
  
  const allRequests = useMemo(() => {
    // Standardize requests
    const combined = [...reduxRequests];
    mockBloodRequests.forEach((mr) => {
      if (!combined.some((r) => r.id === mr.id)) {
        combined.push(mr);
      }
    });
    return combined;
  }, [reduxRequests]);

  // Selected Blood Request ID state (default to first request)
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [isSearching, setIsSearching] = useState(false);

  // Notification States for Donors (Sending, Notified/Success, Failed/Retry)
  const [notifyingDonorIds, setNotifyingDonorIds] = useState(new Set());
  const [notifiedDonorIds, setNotifiedDonorIds] = useState(new Set());
  const [failedDonorIds, setFailedDonorIds] = useState(new Set());

  // Set default request on initial load or when new request is added
  useEffect(() => {
    if (allRequests.length > 0 && (!selectedRequestId || !allRequests.some((r) => r.id === selectedRequestId))) {
      setSelectedRequestId(allRequests[0].id);
    }
  }, [allRequests, selectedRequestId]);

  const selectedRequest = useMemo(() => {
    return allRequests.find((r) => r.id === selectedRequestId) || allRequests[0] || null;
  }, [allRequests, selectedRequestId]);

  // Filter & match donors
  const matchedDonors = useMemo(() => {
    if (!selectedRequest) return mockNearbyDonors;

    const reqGroup = selectedRequest.bloodGroup || 'O+';
    const reqUrgency = selectedRequest.urgency || selectedRequest.priority || 'High';

    const filtered = mockNearbyDonors.filter((donor) => {
      // 1. Blood group compatibility check
      const isCompatible = isBloodCompatible(donor.bloodGroup, reqGroup);
      if (!isCompatible) return false;

      // 2. Extra blood group filter UI
      if (bloodGroupFilter !== 'ALL' && donor.bloodGroup !== bloodGroupFilter) {
        return false;
      }

      // 3. Urgency level filter UI (applies if request matches urgency)
      if (urgencyFilter !== 'ALL') {
        const normUrgency = reqUrgency.toLowerCase();
        const normFilter = urgencyFilter.toLowerCase();
        if (!normUrgency.includes(normFilter) && !normFilter.includes(normUrgency)) {
          return false;
        }
      }

      return true;
    });

    // Sort in ascending order by distance (nearest first)
    return [...filtered].sort((a, b) => {
      const distA = a.distanceKm ?? parseFloat(a.distance) ?? 0;
      const distB = b.distanceKm ?? parseFloat(b.distance) ?? 0;
      return distA - distB;
    });
  }, [selectedRequest, bloodGroupFilter, urgencyFilter]);

  const handleFindMatching = () => {
    setIsSearching(true);
    toast.success('🔍 Matching Engine scanned nearby radius & computed compatibility!');
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleNotifyDonor = async (donor) => {
    if (!selectedRequest) {
      toast.error('Please select an active blood request first.');
      return;
    }

    const donorId = donor.id || donor._id;

    // Prevent duplicate concurrent clicks
    if (notifyingDonorIds.has(donorId)) return;

    setNotifyingDonorIds((prev) => new Set(prev).add(donorId));
    setFailedDonorIds((prev) => {
      const next = new Set(prev);
      next.delete(donorId);
      return next;
    });

    try {
      const reqId = selectedRequest.id || selectedRequest._id || 'REQ001';
      const hospName = selectedRequest.hospitalName || selectedRequest.hospital?.name || 'AIIMS New Delhi';
      const mapsUrl = 'https://maps.google.com/?q=AIIMS+Delhi';
      const payload = {
        requestId: reqId,
        donorPhone: donor.phone,
        donorName: donor.name,
        bloodGroup: selectedRequest.bloodGroup || donor.bloodGroup || 'O+',
        unitsRequired: selectedRequest.unitsRequired || selectedRequest.unitsNeeded || 1,
        hospitalName: hospName,
        hospitalLocation: selectedRequest.location || selectedRequest.hospitalLocation || selectedRequest.hospital?.address || 'Ansari Nagar, New Delhi',
        hospitalContact: selectedRequest.hospitalContact || selectedRequest.hospital?.contact || '+91-11-26588500',
        mapsUrl: mapsUrl,
      };

      const response = await donorService.notifyDonor(donorId, reqId, payload);

      if (response && response.success) {
        setNotifiedDonorIds((prev) => new Set(prev).add(donorId));
        toast.success(`📱 SMS sent successfully to ${donor.name}! (SID: ${response.sid ? response.sid.slice(0, 10) + '...' : 'OK'})`, {
          duration: 4000,
        });
      } else {
        setFailedDonorIds((prev) => new Set(prev).add(donorId));
        const errMsg = response?.errorMessage || response?.message || 'Unable to send SMS. Please try again.';
        toast.error(`❌ ${errMsg}`, { duration: 5000 });
      }
    } catch (err) {
      console.error('[DonorMatchingSection] SMS Notification failed:', err);
      setFailedDonorIds((prev) => new Set(prev).add(donorId));
      const errMsg = err.response?.data?.errorMessage || err.response?.data?.message || err.message || 'Unable to send SMS. Please try again.';
      toast.error(`❌ ${errMsg}`, { duration: 6000 });
    } finally {
      setNotifyingDonorIds((prev) => {
        const next = new Set(prev);
        next.delete(donorId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card — Matching Engine Selection */}
      <Card className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              Donor Matching Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select an active blood request to run spatial & blood group compatibility matching
            </p>
          </div>

          {/* Request Selector + Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Select Blood Request
              </label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all min-w-[280px]"
              >
                {allRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.bloodGroup} · {req.patientName ? `${req.patientName} · ` : ''}{req.hospitalName || req.location}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="font-bold text-xs px-4 py-2 mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
              leftIcon={<Search className="w-3.5 h-3.5" />}
              isLoading={isSearching}
              onClick={handleFindMatching}
            >
              Find Matching Donors
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Donors:</span>
          </div>

          {/* Blood Group Filter */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Blood Group:</span>
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setBloodGroupFilter(group)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  bloodGroupFilter === group
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-400 text-[11px] font-medium">Urgency:</span>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border-none focus:ring-1 focus:ring-rose-500"
            >
              {URGENCY_LEVELS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Selected Request Detail Banner */}
      {selectedRequest && (
        <motion.div
          key={selectedRequest.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-base flex items-center justify-center shadow-sm shrink-0">
              {selectedRequest.bloodGroup}
            </div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                {selectedRequest.hospitalName || 'Fortis Greater Noida'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedRequest.patientName || 'Emergency Patient'}</span> · {selectedRequest.unitsRequired || 2} units needed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="emergency" size="sm" pulse>
              Urgency: {(selectedRequest.urgency || selectedRequest.priority || 'URGENT').toUpperCase()}
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Matched Donors Header & Count */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Matched Donors
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            (Sorted by Distance: Ascending ↑)
          </span>
        </h3>
        <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
          {matchedDonors.length} matched
        </span>
      </div>

      {/* Matched Donor Cards List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {matchedDonors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm"
            >
              No compatible donors match the current filters. Try relaxing the blood group filter.
            </motion.div>
          ) : (
            matchedDonors.map((donor, idx) => {
              const donorId = donor.id || donor._id;
              const isNotifying = notifyingDonorIds.has(donorId);
              const isNotified = notifiedDonorIds.has(donorId);
              const isFailed = failedDonorIds.has(donorId);

              let buttonText = 'Notify';
              let buttonIcon = <Bell className="w-3.5 h-3.5" />;
              let buttonStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20';

              if (isNotified) {
                buttonText = 'SMS Sent';
                buttonIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
                buttonStyle = 'bg-emerald-700 text-white cursor-default';
              } else if (isFailed) {
                buttonText = 'Retry';
                buttonIcon = <Bell className="w-3.5 h-3.5 text-amber-200" />;
                buttonStyle = 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20';
              }

              return (
                <motion.div
                  key={donorId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Avatar & Donor Details */}
                  <div className="flex items-center gap-3.5">
                    <Avatar name={donor.name} size="md" bloodGroup={donor.bloodGroup} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {donor.name}
                        </h4>
                        {donor.isAvailable ? (
                          <Badge variant="success" size="sm">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-300 text-[11px]">
                          {donor.bloodGroup}
                        </span>
                        <span>· {donor.location}</span>
                        {donor.totalDonations && (
                          <span className="hidden md:inline text-slate-400">· {donor.totalDonations} donations</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Distance & Action Buttons */}
                  <div className="flex items-center gap-3 justify-end shrink-0">
                    {/* Distance Badge */}
                    <div className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      <span>{donor.distance || `${donor.distanceKm} km`}</span>
                    </div>

                    {/* Contact Phone Call Link */}
                    {donor.phone && (
                      <a
                        href={`tel:${donor.phone}`}
                        title={`Call ${donor.name}`}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}

                    {/* Notify Button */}
                    <Button
                      variant="success"
                      size="sm"
                      isDisabled={isNotifying || isNotified}
                      isLoading={isNotifying}
                      leftIcon={isNotifying ? null : buttonIcon}
                      className={`font-bold text-xs px-4 py-2 ${buttonStyle}`}
                      onClick={() => handleNotifyDonor(donor)}
                    >
                      {isNotifying ? 'Sending...' : buttonText}
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DonorMatchingSection;

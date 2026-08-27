import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Loader2, AlertCircle, Filter,
  Heart, Building2, Droplets, Clock, ChevronRight,
  CheckCircle2, XCircle, Siren, Sparkles, Phone, Bell, Search, Users, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { StatsCard } from '../../components/ui/StatsCard';

import RedConnectMap from '../../components/map/RedConnectMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getAvailableDonors, getHospitals, getActiveBloodRequests } from '../../services/firestoreDataService';
import { findMatchingDonors } from '../../services/matchingService';
import { notificationService } from '../../services/notificationService';
import { donorService } from '../../services/donorService';
import { mockNearbyDonors, mockHospitals, mockBloodRequests } from '../../data/mockData';

// ─── Filter Constants ─────────────────────────────────────────────────────────

const CITIES = ['All Cities', 'New Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'];
const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = ['ALL', 'Critical', 'High', 'Medium'];

const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning', Low: 'success' };
const urgencyBg = {
  Critical: 'from-red-600 to-rose-600',
  High:     'from-amber-500 to-orange-500',
  Medium:   'from-blue-500 to-indigo-500',
  Low:      'from-emerald-500 to-teal-500',
};

// ─── Sub-Component: Donor Row ──────────────────────────────────────────────────

const DonorRow = ({ match, rank, onNotify, isNotifying, isNotified, isFailed }) => {
  const donor = match.donor || match;
  const donorId = donor.id || donor._id;
  const isAvailable = donor.available === true || donor.isAvailable === true;

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-red-300 dark:hover:border-red-800 transition-all flex items-center justify-between gap-3"
    >
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">
          {rank + 1}
        </div>
        <Avatar name={donor.name} size="sm" bloodGroup={donor.bloodGroup} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
              {donor.name}
            </h4>
            <span className={`w-2 h-2 rounded-full shrink-0 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            <span className="font-bold text-red-600 dark:text-red-400">{donor.bloodGroup}</span> · {donor.location || 'Delhi NCR'}
          </p>
        </div>
      </div>

      {/* Right: Route Distance & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {match.distanceKm ?? donor.distanceKm ?? donor.distance} km
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-end gap-0.5">
            <Clock className="w-3 h-3" /> {match.durationMinutes ?? 12} min
          </p>
        </div>

        {donor.phone && (
          <a
            href={`tel:${donor.phone}`}
            title={`Call ${donor.name}`}
            className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}

        <Button
          variant="success"
          size="sm"
          isDisabled={isNotifying || isNotified}
          isLoading={isNotifying}
          leftIcon={isNotifying ? null : buttonIcon}
          className={`font-bold text-[11px] px-2.5 py-1 ${buttonStyle}`}
          onClick={() => onNotify(donor)}
        >
          {isNotifying ? 'Sending...' : buttonText}
        </Button>
      </div>
    </motion.div>
  );
};

// ─── Main Interactive Maps Page Component ─────────────────────────────────────

const InteractiveMapsPage = () => {
  // Geolocation hook
  const { latitude, longitude, accuracy, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

  // Data State
  const [donors, setDonors] = useState(mockNearbyDonors);
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [requests, setRequests] = useState(mockBloodRequests);
  const [dataLoading, setDataLoading] = useState(true);

  // Filter & Selection State
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  // Layer Visibility State
  const [showLayers, setShowLayers] = useState({
    requests: true,
    hospitals: true,
    donors: true,
  });

  // Matching & Notification State
  const [matchedDonors, setMatchedDonors] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [notifyingDonorIds, setNotifyingDonorIds] = useState(new Set());
  const [notifiedDonorIds, setNotifiedDonorIds] = useState(new Set());
  const [failedDonorIds, setFailedDonorIds] = useState(new Set());

  // Load initial data from Firestore + mock data combination
  useEffect(() => {
    const load = async () => {
      setDataLoading(true);
      try {
        const [d, h, r] = await Promise.all([
          getAvailableDonors(),
          getHospitals(),
          getActiveBloodRequests(),
        ]);
        if (d && d.length > 0) setDonors(d);
        if (h && h.length > 0) setHospitals(h);
        if (r && r.length > 0) setRequests(r);
      } catch (err) {
        console.error('[MapPage] Firestore load error:', err);
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []);

  // Filter requests based on criteria
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (bloodGroupFilter !== 'ALL' && r.bloodGroup !== bloodGroupFilter) return false;
      if (urgencyFilter !== 'ALL') {
        const normUrgency = (r.urgency || r.priority || '').toLowerCase();
        if (!normUrgency.includes(urgencyFilter.toLowerCase())) return false;
      }
      if (cityFilter !== 'All Cities') {
        const loc = (r.location || r.hospitalLocation || r.address || r.city || '').toLowerCase();
        if (!loc.includes(cityFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [requests, bloodGroupFilter, urgencyFilter, cityFilter]);

  // Set default request ID when requests change
  useEffect(() => {
    if (filteredRequests.length > 0 && (!selectedRequestId || !filteredRequests.some(r => r.id === selectedRequestId))) {
      setSelectedRequestId(filteredRequests[0].id);
    }
  }, [filteredRequests, selectedRequestId]);

  const selectedRequest = useMemo(() => {
    return filteredRequests.find((r) => r.id === selectedRequestId) || filteredRequests[0] || null;
  }, [filteredRequests, selectedRequestId]);

  // Filter donors based on filters
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (bloodGroupFilter !== 'ALL' && d.bloodGroup !== bloodGroupFilter) return false;
      if (cityFilter !== 'All Cities') {
        const loc = (d.location || d.city || d.address || '').toLowerCase();
        if (!loc.includes(cityFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [donors, bloodGroupFilter, cityFilter]);

  // Run Smart Donor Matching algorithm
  useEffect(() => {
    if (!selectedRequest) {
      setMatchedDonors([]);
      return;
    }
    const runMatch = async () => {
      setMatchLoading(true);
      try {
        const results = await findMatchingDonors(selectedRequest, filteredDonors);
        setMatchedDonors(results);
      } catch (err) {
        console.error('[MapPage] Matching error:', err);
        setMatchedDonors([]);
      } finally {
        setMatchLoading(false);
      }
    };
    runMatch();
  }, [selectedRequest, filteredDonors]);

  // Handle emergency alert broadcast
  const handleDispatchAlert = async () => {
    if (!selectedRequest) return;
    setDispatching(true);
    try {
      const priority = selectedRequest.priority || selectedRequest.urgency || 'High';
      const isCritical = priority.toLowerCase() === 'critical' || priority.toLowerCase() === 'emergency';

      if (!isCritical) {
        toast.error('Emergency notifications are only sent for Critical priority requests.');
        return;
      }

      const { sentCount, skippedCount } = await notificationService.sendEmergencyNotification(selectedRequest, matchedDonors);
      if (sentCount > 0) {
        toast.success(`🚨 Emergency Alert sent to ${sentCount} nearby donor(s)!`);
      } else if (skippedCount > 0) {
        toast.info('Alerts were previously sent to nearby donors.');
      } else {
        toast.error('No nearby available donors found to notify.');
      }
    } catch (err) {
      console.error('[MapPage] Dispatch alert error:', err);
      toast.error('Failed to send emergency notification.');
    } finally {
      setDispatching(false);
    }
  };

  // Handle individual SMS notification to donor
  const handleNotifyDonor = async (donor) => {
    if (!selectedRequest) {
      toast.error('Please select an active blood request first.');
      return;
    }

    const donorId = donor.id || donor._id;
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
      const payload = {
        requestId: reqId,
        donorPhone: donor.phone,
        donorName: donor.name,
        bloodGroup: selectedRequest.bloodGroup || donor.bloodGroup || 'O+',
        unitsRequired: selectedRequest.unitsRequired || selectedRequest.unitsNeeded || 1,
        hospitalName: hospName,
        hospitalLocation: selectedRequest.location || selectedRequest.hospitalLocation || 'New Delhi',
        hospitalContact: selectedRequest.hospitalContact || '+91-11-26588500',
      };

      const response = await donorService.notifyDonor(donorId, reqId, payload);
      if (response && response.success) {
        setNotifiedDonorIds((prev) => new Set(prev).add(donorId));
        toast.success(`📱 SMS notification sent to ${donor.name}!`);
      } else {
        setFailedDonorIds((prev) => new Set(prev).add(donorId));
        toast.error(`❌ ${response?.message || 'Failed to send SMS'}`);
      }
    } catch (err) {
      console.error('[MapPage] SMS notify error:', err);
      setFailedDonorIds((prev) => new Set(prev).add(donorId));
      toast.error('❌ Failed to send SMS notification');
    } finally {
      setNotifyingDonorIds((prev) => {
        const next = new Set(prev);
        next.delete(donorId);
        return next;
      });
    }
  };

  const toggleLayer = (layer) =>
    setShowLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));

  const userPosition = latitude && longitude ? { latitude, longitude, accuracy } : null;

  return (
    <div className="space-y-6">

      {/* ── 1. Page Header (Standardized Dashboard Design) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            Emergency Spatial Locator & Map
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time GPS discovery, smart donor matching engine, and live hospital dispatch network
          </p>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Navigation className="w-4 h-4 text-blue-500" />}
            onClick={requestLocation}
            isLoading={geoLoading}
          >
            {geoLoading ? 'Detecting Location...' : userPosition ? 'Location Detected ✓' : 'Detect My Location'}
          </Button>
        </div>
      </div>

      {/* ── 2. Top Stats Cards Grid (Matching App Dashboard) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatsCard
            title="Active Blood Requests"
            value={filteredRequests.length}
            icon={<Droplets className="w-6 h-6" />}
            color="red"
            change={`${filteredRequests.filter(r => r.urgency === 'Critical' || r.priority === 'Critical').length} critical cases`}
            changeType="negative"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatsCard
            title="Verified Hospitals"
            value={hospitals.length}
            icon={<Building2 className="w-6 h-6" />}
            color="indigo"
            change="Delhi NCR Network"
            changeType="neutral"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatsCard
            title="Available Donors"
            value={filteredDonors.filter(d => d.available === true || d.isAvailable === true).length}
            icon={<Heart className="w-6 h-6" />}
            color="emerald"
            change="Active & ready"
            changeType="positive"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatsCard
            title="Matched Candidates"
            value={matchedDonors.length}
            icon={<Sparkles className="w-6 h-6" />}
            color="amber"
            change="Optimal spatial fit"
            changeType="positive"
          />
        </motion.div>
      </div>

      {/* ── 3. Controls & Filter Card ── */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Map Filters & Layer Controls
            </h3>
          </div>

          {/* City & Urgency Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">City:</span>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Urgency:</span>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {URGENCY_LEVELS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blood Group Chips & Layer Toggles Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Blood Group Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1">Blood Group:</span>
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setBloodGroupFilter(group)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  bloodGroupFilter === group
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Layer Visibility Toggles */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Layers:</span>
            <button
              onClick={() => toggleLayer('requests')}
              className={`px-3 py-1 rounded-lg font-bold text-xs border transition-all flex items-center gap-1.5 ${
                showLayers.requests
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Requests ({filteredRequests.length})
            </button>

            <button
              onClick={() => toggleLayer('hospitals')}
              className={`px-3 py-1 rounded-lg font-bold text-xs border transition-all flex items-center gap-1.5 ${
                showLayers.hospitals
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Hospitals ({hospitals.length})
            </button>

            <button
              onClick={() => toggleLayer('donors')}
              className={`px-3 py-1 rounded-lg font-bold text-xs border transition-all flex items-center gap-1.5 ${
                showLayers.donors
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Donors ({filteredDonors.length})
            </button>
          </div>
        </div>
      </Card>

      {/* ── 4. Main Section: 2-Column Desktop Grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left Column: Blood Requests & Matched Donors (1 Column) ── */}
        <div className="lg:col-span-1 space-y-6">

          {/* Blood Request Selector Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                <Droplets className="w-4 h-4 text-red-500" />
                Select Blood Request
              </h3>
              <span className="text-xs text-slate-500">{filteredRequests.length} active</span>
            </div>

            <select
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              {filteredRequests.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.bloodGroup} · {req.hospitalName || req.location} ({req.urgency || 'Urgent'})
                </option>
              ))}
            </select>

            {/* Selected Request Detail Preview */}
            {selectedRequest && (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shadow shrink-0">
                      {selectedRequest.bloodGroup}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {selectedRequest.hospitalName || 'AIIMS New Delhi'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedRequest.unitsRequired || 2} units needed · {selectedRequest.location || 'Delhi'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={urgencyVariant[selectedRequest.urgency || selectedRequest.priority] || 'default'} size="sm">
                    {selectedRequest.urgency || selectedRequest.priority || 'High'}
                  </Badge>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Matched Nearby Donors Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Matched Nearby Donors
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Ranked by OSRM road distance & blood compatibility
                </p>
              </div>

              {selectedRequest && (selectedRequest.priority === 'Critical' || selectedRequest.urgency === 'Critical') && (
                <Button
                  variant="emergency"
                  size="sm"
                  isDisabled={dispatching || matchedDonors.length === 0}
                  isLoading={dispatching}
                  onClick={handleDispatchAlert}
                  leftIcon={<Siren className="w-3.5 h-3.5" />}
                  className="text-xs py-1.5 px-3"
                >
                  Alert Donors
                </Button>
              )}
            </div>

            {/* Donor Rows List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {!selectedRequest ? (
                <p className="text-center text-xs text-slate-400 py-8">Select a blood request to view matched donors</p>
              ) : matchLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : matchedDonors.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <XCircle className="w-7 h-7 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  No compatible donors found for this request.
                </div>
              ) : (
                matchedDonors.map((match, rank) => {
                  const donor = match.donor || match;
                  const donorId = donor.id || donor._id;
                  return (
                    <DonorRow
                      key={donorId}
                      match={match}
                      rank={rank}
                      onNotify={handleNotifyDonor}
                      isNotifying={notifyingDonorIds.has(donorId)}
                      isNotified={notifiedDonorIds.has(donorId)}
                      isFailed={failedDonorIds.has(donorId)}
                    />
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* ── Right Column: Map Canvas Container (2 Columns) ── */}
        <div className="lg:col-span-2 flex flex-col space-y-3">
          <Card className="p-0 overflow-hidden relative shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl h-[620px] flex flex-col">
            
            {/* Map Component */}
            {dataLoading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm font-semibold text-slate-500">Loading Map Data...</p>
              </div>
            ) : (
              <RedConnectMap
                donors={showLayers.donors ? filteredDonors : []}
                hospitals={showLayers.hospitals ? hospitals : []}
                requests={showLayers.requests ? filteredRequests : []}
                matchedDonors={matchedDonors}
                userPosition={userPosition}
                selectedRequest={selectedRequest}
                onRequestClick={(req) => setSelectedRequestId(req.id)}
                onMyLocation={requestLocation}
                className="w-full h-full"
              />
            )}
          </Card>

          {/* Map Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
            <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
              Legend
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-ping" style={{ animationDuration: '2s' }} />
                Critical Request
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                Hospital
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                Available Donor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                Your GPS Location
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              © OpenStreetMap contributors · OSRM Routing Engine
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InteractiveMapsPage;

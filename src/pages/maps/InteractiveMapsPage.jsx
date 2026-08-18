import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Loader2, AlertCircle, Filter,
  Heart, Building2, Droplets, Clock, Ruler, ChevronRight,
  RefreshCw, CheckCircle2, XCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import RedConnectMap from '../../components/map/RedConnectMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getAvailableDonors, getHospitals, getActiveBloodRequests } from '../../services/firestoreDataService';
import { findMatchingDonors, findNearbyDonors } from '../../services/matchingService';
import { notificationService } from '../../services/notificationService';
import { Siren } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Blood group filter chips ────────────────────────────────────────────────
const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const urgencyVariant  = { Critical: 'emergency', High: 'danger', Medium: 'warning', Low: 'success' };
const urgencyBg = {
  Critical: 'from-red-600 to-rose-600',
  High:     'from-amber-500 to-orange-500',
  Medium:   'from-blue-500 to-indigo-500',
  Low:      'from-emerald-500 to-teal-500',
};

// ─── Small sub-components ────────────────────────────────────────────────────

const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
    <Icon className={`w-4 h-4 ${color}`} />
    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-xs font-bold text-slate-900 dark:text-white">{value}</span>
  </div>
);

const DonorRow = ({ match, rank }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.06 }}
    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 hover:shadow-sm transition-all duration-200"
  >
    {/* Rank */}
    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 shrink-0">
      {rank + 1}
    </div>
    {/* Blood Group Badge */}
    <div className="w-9 h-9 rounded-xl bg-red-600 text-white text-xs font-black flex items-center justify-center shadow shrink-0">
      {match.bloodGroup || match.donor?.bloodGroup}
    </div>
    {/* Name */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{match.name || match.donor?.name}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{match.matchReason || 'Compatible Donor'}</p>
    </div>
    {/* Distance */}
    <div className="text-right shrink-0">
      <p className="text-sm font-bold text-slate-800 dark:text-white">{match.distanceKm} km</p>
      <p className="text-[11px] text-slate-500 flex items-center justify-end gap-0.5">
        <Clock className="w-3 h-3" /> {match.durationMinutes} min
      </p>
    </div>
    {/* Availability dot */}
    <div className={`w-2 h-2 rounded-full shrink-0 ${
      (match.available || match.donor?.available || match.donor?.isAvailable) ? 'bg-emerald-500' : 'bg-slate-300'
    }`} />
  </motion.div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const InteractiveMapsPage = () => {
  // Geolocation
  const { latitude, longitude, accuracy, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

  // Data
  const [donors,     setDonors]     = useState([]);
  const [hospitals,  setHospitals]  = useState([]);
  const [requests,   setRequests]   = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError,   setDataError]   = useState(null);

  // UI state
  const [selectedRequest,  setSelectedRequest]  = useState(null);
  const [filterGroup,      setFilterGroup]      = useState('ALL');
  const [matchedDonors,    setMatchedDonors]    = useState([]);
  const [matchLoading,     setMatchLoading]     = useState(false);
  const [dispatching,      setDispatching]      = useState(false);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      setDataLoading(true);
      setDataError(null);
      try {
        const [d, h, r] = await Promise.all([
          getAvailableDonors(),
          getHospitals(),
          getActiveBloodRequests(),
        ]);
        setDonors(d);
        setHospitals(h);
        setRequests(r);
        if (r.length > 0) setSelectedRequest(r[0]);
      } catch (err) {
        console.error('[MapPage] Data load failed:', err);
        setDataError('Failed to load map data. Please refresh.');
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []);

  // Run smart matching whenever selectedRequest or donors change
  useEffect(() => {
    if (!selectedRequest) {
      setMatchedDonors([]);
      return;
    }
    const runMatch = async () => {
      setMatchLoading(true);
      try {
        const results = await findMatchingDonors(selectedRequest, donors);
        setMatchedDonors(results);
      } catch (err) {
        console.error('[MapPage] Matching failed:', err);
        setMatchedDonors([]);
      } finally {
        setMatchLoading(false);
      }
    };
    runMatch();
  }, [selectedRequest, donors]);

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
        toast.info(`Alerts were previously sent to nearby donors.`);
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


  // Filter donors by blood group chip
  const visibleDonors = filterGroup === 'ALL'
    ? donors
    : donors.filter((d) => d.bloodGroup === filterGroup);

  const userPosition = latitude && longitude
    ? { latitude, longitude, accuracy }
    : null;

  const handleMyLocation = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  const handleLocationSelect = useCallback((result) => {
    // Could set a "searched location" marker — map already flies there via MapSearch
    console.log('[MapPage] User searched:', result.displayName);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-red-600" />
            Emergency Spatial Locator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time OpenStreetMap · Smart Donor Matching · OSRM Road Routing
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-2">
          <StatPill icon={Heart}      label="Donors"    value={donors.length}    color="text-emerald-500" />
          <StatPill icon={Building2}  label="Hospitals" value={hospitals.length} color="text-blue-500"    />
          <StatPill icon={Droplets}   label="Requests"  value={requests.length}  color="text-red-500"     />
        </div>
      </div>

      {/* ── Geolocation status bar ── */}
      <AnimatePresence>
        {geoLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300"
          >
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            Requesting your location…
          </motion.div>
        )}
        {geoError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {geoError}
          </motion.div>
        )}
        {userPosition && !geoLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Location detected · {latitude?.toFixed(4)}°N, {longitude?.toFixed(4)}°E
            {accuracy && <span className="text-emerald-500 ml-1">(±{Math.round(accuracy)}m)</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Data error ── */}
      {dataError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {dataError}
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="grid lg:grid-cols-3 gap-4" style={{ minHeight: '72vh' }}>

        {/* ── Left Sidebar ── */}
        <div className="lg:col-span-1 flex flex-col gap-4 order-2 lg:order-1">

          {/* Blood Request Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                <Droplets className="w-4 h-4 text-red-500" />
                Blood Requests
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a request to find matching donors</p>
            </div>
            <div className="p-3 space-y-2 max-h-[260px] overflow-y-auto">
              {dataLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : requests.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No active requests</p>
              ) : (
                requests.map((req) => {
                  const isSel = selectedRequest?.id === req.id;
                  const isCritical = req.urgency === 'Critical';
                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        isSel
                          ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-700/40 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 bg-gradient-to-br ${urgencyBg[req.urgency] || 'from-slate-400 to-slate-500'} shadow`}>
                        {req.bloodGroup}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{req.hospitalName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{req.unitsRequired} units · {req.location}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant={urgencyVariant[req.urgency] || 'default'} size="sm" pulse={isCritical}>
                          {req.urgency}
                        </Badge>
                        {isSel && <ChevronRight className="w-3 h-3 text-red-500" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Matching Donors Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  Nearby Matching Donors
                </h3>
                {selectedRequest && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    For <span className="font-bold text-red-600">{selectedRequest.bloodGroup}</span> · {selectedRequest.hospitalName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {matchLoading && <Loader2 className="w-4 h-4 animate-spin text-red-500 shrink-0" />}
                {selectedRequest && (selectedRequest.priority === 'Critical' || selectedRequest.urgency === 'Critical') && (
                  <Button
                    variant="emergency"
                    size="sm"
                    disabled={dispatching || matchedDonors.length === 0}
                    onClick={handleDispatchAlert}
                    className="flex items-center gap-1.5 text-xs py-1 px-2.5"
                  >
                    <Siren className="w-3.5 h-3.5" />
                    {dispatching ? 'Sending...' : 'Send Alert'}
                  </Button>
                )}
              </div>
            </div>

            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
              {!selectedRequest ? (
                <p className="text-center text-sm text-slate-400 py-8">Select a blood request above to find matched donors</p>
              ) : matchLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : matchedDonors.length === 0 ? (
                <div className="text-center py-8">
                  <XCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No compatible available donors found nearby</p>
                </div>
              ) : (
                matchedDonors.map((match, i) => (
                  <DonorRow key={match.donor.id} match={match} rank={i} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Map Panel ── */}
        <div className="lg:col-span-2 order-1 lg:order-2" style={{ minHeight: '60vh' }}>

          {/* Blood group filter chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setFilterGroup(group)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 border ${
                  filterGroup === group
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {group}
              </button>
            ))}
            <button
              onClick={handleMyLocation}
              className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              <Navigation className="w-3 h-3" />
              {geoLoading ? 'Locating…' : 'My Location'}
            </button>
          </div>

          {/* The actual map */}
          <div style={{ height: 'calc(100% - 44px)', minHeight: '55vh' }}>
            {dataLoading ? (
              <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-red-500 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">Loading map data…</p>
                </div>
              </div>
            ) : (
              <RedConnectMap
                donors={visibleDonors}
                hospitals={hospitals}
                requests={requests}
                matchedDonors={matchedDonors}
                userPosition={userPosition}
                selectedRequest={selectedRequest}
                onRequestClick={setSelectedRequest}
                onMyLocation={handleMyLocation}
                onLocationSelect={handleLocationSelect}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-400">
        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-[11px]">Map Legend</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Your Location</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Available Donor</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-700 inline-block" /> Hospital</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-ping" style={{ animationDuration: '1.5s' }} /> Critical Request</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> High-Priority Request</span>
        <span className="ml-auto text-slate-400 text-[10px]">
          © OpenStreetMap contributors · Routing by OSRM
        </span>
      </div>
    </div>
  );
};

export default InteractiveMapsPage;

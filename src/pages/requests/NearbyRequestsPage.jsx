import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation, Filter, Heart, Clock, Info, Loader2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import RedConnectMap from '../../components/map/RedConnectMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getAvailableDonors, getHospitals, getActiveBloodRequests } from '../../services/firestoreDataService';
import { findMatchingDonors } from '../../services/matchingService';
import toast from 'react-hot-toast';

const NearbyRequestsPage = () => {
  const { latitude, longitude, accuracy, loading: geoLoading, requestLocation } = useGeolocation();

  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [matchedDonors, setMatchedDonors] = useState([]);

  const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning', Low: 'success' };

  // Load map data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
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
        console.error('[NearbyRequestsPage] Load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Run smart matching when selected request changes
  useEffect(() => {
    if (!selectedRequest) {
      setMatchedDonors([]);
      return;
    }
    const match = async () => {
      try {
        const results = await findMatchingDonors(selectedRequest, donors);
        setMatchedDonors(results);
      } catch (err) {
        console.error('[NearbyRequestsPage] Matching error:', err);
      }
    };
    match();
  }, [selectedRequest, donors]);

  const userPosition = latitude && longitude ? { latitude, longitude, accuracy } : null;

  const handleUpdateLocation = useCallback(() => {
    requestLocation();
    toast.success('Location update requested');
  }, [requestLocation]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Nearby Blood Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency requests within 25km of your location — sorted by urgency</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUpdateLocation}
            isDisabled={geoLoading}
            leftIcon={geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          >
            {geoLoading ? 'Locating...' : 'Update Location'}
          </Button>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">Loading interactive map data...</p>
            </div>
          </div>
        ) : (
          <RedConnectMap
            donors={donors}
            hospitals={hospitals}
            requests={requests}
            matchedDonors={matchedDonors}
            userPosition={userPosition}
            selectedRequest={selectedRequest}
            onRequestClick={(req) => setSelectedRequest(req)}
            onMyLocation={handleUpdateLocation}
            className="w-full h-full"
          />
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
            Active Requests Nearby ({requests.length})
          </h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <EmptyState title="No nearby requests" description="No emergency requests match your location right now." />
            ) : (
              requests.map((req, i) => {
                const isSel = selectedRequest?.id === req.id;
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                      isSel
                        ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/30 dark:bg-red-950/20'
                        : req.urgency === 'Critical' || req.priority === 'Critical'
                        ? 'border-red-400 dark:border-red-700 border-l-4 bg-white dark:bg-slate-800 hover:border-red-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
                        {req.bloodGroup}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={urgencyVariant[req.urgency] || urgencyVariant[req.priority] || 'default'} size="sm" pulse={req.urgency === 'Critical' || req.priority === 'Critical'}>
                            {req.urgency || req.priority || 'Normal'}
                          </Badge>
                          <Badge variant={req.status === 'Fulfilled' ? 'success' : 'info'} size="sm">{req.status}</Badge>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">{req.hospitalName}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{req.patientName}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" />{req.distanceKm || 2.5} km
                          </span>
                          <span className="text-[11px] text-slate-500">{req.unitsRequired || req.units || 1} units needed</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {req.hospitalContact && (
                          <a
                            href={`tel:${req.hospitalContact}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                        leftIcon={<Info className="w-3.5 h-3.5" />}
                      >
                        Focus Map
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        isDisabled={req.status === 'Fulfilled'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Pledge recorded for ${req.hospitalName}!`);
                        }}
                        leftIcon={<Heart className="w-3.5 h-3.5" />}
                      >
                        {req.status === 'Fulfilled' ? 'Fulfilled' : 'Pledge'}
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Compatible Donors Nearby */}
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
            Matched Donors Nearby {selectedRequest && <span className="text-red-600 font-bold">({selectedRequest.bloodGroup})</span>}
          </h2>
          <div className="space-y-3">
            {matchedDonors.length > 0 ? (
              matchedDonors.map((match, i) => (
                <motion.div
                  key={match.donorId || match.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
                    {match.bloodGroup}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{match.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={match.available ? 'success' : 'warning'} size="sm" pulse={match.available}>
                        {match.available ? 'Available' : 'On Break'}
                      </Badge>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />{match.distanceKm} km
                      </span>
                      {match.durationMinutes && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />~{match.durationMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                  {match.donor?.phone && (
                    <a
                      href={`tel:${match.donor.phone}`}
                      className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              donors.map((donor, i) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
                    {donor.bloodGroup}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{donor.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={donor.available || donor.isAvailable ? 'success' : 'warning'} size="sm" pulse={donor.available || donor.isAvailable}>
                        {donor.available || donor.isAvailable ? 'Available' : 'On Break'}
                      </Badge>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{donor.distanceKm || 2.0} km
                      </span>
                    </div>
                  </div>
                  {donor.phone && (
                    <a
                      href={`tel:${donor.phone}`}
                      className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyRequestsPage;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation, Filter, Heart, Clock, Info } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { mockBloodRequests, mockNearbyDonors } from '../../data/mockData';

const NearbyRequestsPage = () => {
  const requests = mockBloodRequests.filter(r => r.status === 'Active');

  const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Nearby Blood Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency requests within 25km of your location — sorted by urgency</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          <Button variant="ghost" size="sm" leftIcon={<Navigation className="w-4 h-4" />}>Update Location</Button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-lg border border-slate-200 dark:border-slate-700 text-center max-w-sm">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
            <p className="font-bold text-slate-900 dark:text-white text-sm">Interactive Map View</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full Mapbox/Google Maps integration available in production. Shows donor & hospital pins in real-time.</p>
          </div>
        </div>
        {/* Fake grid lines for map look */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Requests */}
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Active Requests Nearby ({requests.length})</h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <EmptyState title="No nearby requests" description="No emergency requests match your location right now." />
            ) : (
              requests.map((req, i) => (
                <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm ${req.urgency === 'Critical' ? 'border-red-400 dark:border-red-700 border-l-4' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={urgencyVariant[req.urgency] || 'default'} size="sm" pulse={req.urgency === 'Critical'}>{req.urgency}</Badge>
                        <Badge variant={req.status === 'Fulfilled' ? 'success' : 'info'} size="sm">{req.status}</Badge>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">{req.hospitalName}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{req.patientName}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" />{req.distanceKm} km</span>
                        <span className="text-[11px] text-slate-500">{req.unitsRequired} units needed</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <a href={`tel:${req.hospitalContact}`} className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1" leftIcon={<Info className="w-3.5 h-3.5" />}>Details</Button>
                    <Button variant="primary" size="sm" className="flex-1" isDisabled={req.status === 'Fulfilled'} leftIcon={<Heart className="w-3.5 h-3.5" />}>
                      {req.status === 'Fulfilled' ? 'Fulfilled' : 'Pledge'}
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Nearby Donors */}
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Compatible Donors Nearby</h2>
          <div className="space-y-3">
            {mockNearbyDonors.map((donor, i) => (
              <motion.div key={donor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
                  {donor.bloodGroup}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{donor.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={donor.isAvailable ? 'success' : 'warning'} size="sm" pulse={donor.isAvailable}>
                      {donor.isAvailable ? 'Available' : 'On Break'}
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{donor.distanceKm} km</span>
                  </div>
                </div>
                <a href={`tel:${donor.phone}`} className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-200 transition-colors shrink-0">
                  <Phone className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyRequestsPage;

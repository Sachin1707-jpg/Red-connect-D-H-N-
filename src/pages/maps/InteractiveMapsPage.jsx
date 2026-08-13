import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Filter, Phone, Siren, Building2, Heart, Search, Layers } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { mockBloodRequests, mockNearbyDonors, mockHospitals } from '../../data/mockData';

const InteractiveMapsPage = () => {
  const [selectedPin, setSelectedPin] = useState(null);
  const [filterGroup, setFilterGroup] = useState('ALL');

  const urgencyVariant = { Critical: 'emergency', High: 'danger', Medium: 'warning' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-primary" />
            Interactive Emergency Spatial Locator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time geospatial mapping of nearby donors, hospitals, and critical blood requests</p>
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid lg:grid-cols-3 gap-6 h-[75vh]">
        {/* Map View */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl flex flex-col justify-between p-6">
          {/* Fake Map Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#EF4444 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Map Controls Header */}
          <div className="relative z-10 flex items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Metropolis Central Sector</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-red-400"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> Emergency Pins</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Donors</span>
            </div>
          </div>

          {/* Map Pins Simulation */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-8">
            <div className="relative w-full max-w-lg h-64 border border-dashed border-red-500/30 rounded-full flex items-center justify-center">
              {/* User Center Pin */}
              <div className="p-3 rounded-full bg-primary text-white shadow-2xl shadow-red-500/50 animate-pulse cursor-pointer">
                <Navigation className="w-6 h-6" />
              </div>

              {/* Request Pin 1 */}
              <button
                onClick={() => setSelectedPin(mockBloodRequests[0])}
                className="absolute top-4 left-12 p-2 rounded-xl bg-red-600 text-white shadow-lg font-black text-xs hover:scale-125 transition-transform"
              >
                🚨 O-
              </button>

              {/* Request Pin 2 */}
              <button
                onClick={() => setSelectedPin(mockBloodRequests[1])}
                className="absolute bottom-8 right-16 p-2 rounded-xl bg-amber-600 text-white shadow-lg font-black text-xs hover:scale-125 transition-transform"
              >
                AB-
              </button>

              {/* Donor Pin */}
              <button
                onClick={() => setSelectedPin(mockNearbyDonors[0])}
                className="absolute top-10 right-20 p-2 rounded-full bg-emerald-600 text-white shadow-lg font-bold text-xs hover:scale-125 transition-transform"
              >
                👤 Alex
              </button>
            </div>
          </div>

          {/* Route Preview Footer */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-slate-300">
            <span>Radius: 25 km · Navigation mode active</span>
            <Button variant="emergency" size="sm">Recalculate Route</Button>
          </div>
        </div>

        {/* Sidebar Pin Detail */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 overflow-y-auto space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Marker Details</h3>

          {selectedPin ? (
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center">
                  {selectedPin.bloodGroup}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedPin.hospitalName || selectedPin.name}</p>
                  <p className="text-xs text-slate-500">{selectedPin.location || selectedPin.distanceKm + ' km away'}</p>
                </div>
              </div>

              {selectedPin.urgency && (
                <Badge variant={urgencyVariant[selectedPin.urgency] || 'default'} pulse={selectedPin.urgency === 'Critical'}>
                  {selectedPin.urgency} Urgency
                </Badge>
              )}

              {selectedPin.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300">{selectedPin.description}</p>
              )}

              <Button variant="primary" size="sm" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                Contact Immediately
              </Button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-10">Click any marker pin on the map to inspect details.</p>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Nearby Emergency Requests</h4>
            <div className="space-y-2">
              {mockBloodRequests.slice(0, 3).map((r) => (
                <div key={r.id} onClick={() => setSelectedPin(r)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{r.hospitalName}</p>
                    <p className="text-slate-500 text-[11px]">{r.bloodGroup} · {r.distanceKm} km</p>
                  </div>
                  <Badge variant={urgencyVariant[r.urgency] || 'default'} size="sm">{r.urgency}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapsPage;

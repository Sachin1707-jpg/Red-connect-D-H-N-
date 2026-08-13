import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, Building2, Users, MapPin, Filter } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { mockBloodRequests, mockHospitals, mockNearbyDonors } from '../../data/mockData';

const GlobalSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState('all');

  const requests = mockBloodRequests.filter(r => r.hospitalName.toLowerCase().includes(query.toLowerCase()) || r.patientName.toLowerCase().includes(query.toLowerCase()) || r.bloodGroup.toLowerCase().includes(query.toLowerCase()));
  const hospitals = mockHospitals.filter(h => h.name.toLowerCase().includes(query.toLowerCase()) || h.city.toLowerCase().includes(query.toLowerCase()));
  const donors = mockNearbyDonors.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.bloodGroup.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-7 h-7 text-primary" />
          Global Search Results
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search requests, hospitals, donors, and donation camps across RedConnect</p>
      </div>

      <SearchBar
        value={query}
        onChange={(v) => { setQuery(v); setSearchParams({ q: v }); }}
        onClear={() => { setQuery(''); setSearchParams({}); }}
        placeholder="Type to search requests, hospitals, or blood groups..."
        className="max-w-xl"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        {[
          { key: 'all', label: `All Results (${requests.length + hospitals.length + donors.length})` },
          { key: 'requests', label: `Emergency Requests (${requests.length})` },
          { key: 'hospitals', label: `Hospitals (${hospitals.length})` },
          { key: 'donors', label: `Nearby Donors (${donors.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === t.key ? 'bg-primary text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {(tab === 'all' || tab === 'requests') && requests.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Emergency Blood Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((r) => (
                <Card key={r.id} hoverable className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                    {r.bloodGroup}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{r.hospitalName}</p>
                    <p className="text-xs text-slate-500 truncate">{r.patientName}</p>
                  </div>
                  <Badge variant={r.urgency === 'Critical' ? 'emergency' : 'danger'}>{r.urgency}</Badge>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(tab === 'all' || tab === 'hospitals') && hospitals.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Hospitals & Blood Banks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((h) => (
                <Card key={h.id} hoverable className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{h.name}</p>
                    <p className="text-xs text-slate-500">{h.address}, {h.city}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchPage;

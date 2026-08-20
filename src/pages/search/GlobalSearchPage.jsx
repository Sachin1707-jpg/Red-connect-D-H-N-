import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, Building2, Users, MapPin, Loader2 } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { getAvailableDonors, getHospitals, getActiveBloodRequests } from '../../services/firestoreDataService';

const GlobalSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState('all');

  const [allRequests, setAllRequests] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [allDonors, setAllDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [d, h, r] = await Promise.all([
          getAvailableDonors(),
          getHospitals(),
          getActiveBloodRequests(),
        ]);
        setAllDonors(d);
        setAllHospitals(h);
        setAllRequests(r);
      } catch (err) {
        console.error('[GlobalSearchPage] Load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const q = query.toLowerCase().trim();

  const requests = allRequests.filter(
    (r) =>
      !q ||
      (r.hospitalName && r.hospitalName.toLowerCase().includes(q)) ||
      (r.patientName && r.patientName.toLowerCase().includes(q)) ||
      (r.bloodGroup && r.bloodGroup.toLowerCase().includes(q))
  );

  const hospitals = allHospitals.filter(
    (h) =>
      !q ||
      (h.name && h.name.toLowerCase().includes(q)) ||
      (h.city && h.city.toLowerCase().includes(q)) ||
      (h.address && h.address.toLowerCase().includes(q))
  );

  const donors = allDonors.filter(
    (d) =>
      !q ||
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.bloodGroup && d.bloodGroup.toLowerCase().includes(q))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-7 h-7 text-primary" />
          Global Search Results
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search live blood requests, hospitals, donors, and blood banks across RedConnect
        </p>
      </div>

      <SearchBar
        value={query}
        onChange={(v) => { setQuery(v); setSearchParams({ q: v }); }}
        onClear={() => { setQuery(''); setSearchParams({}); }}
        placeholder="Type to search requests, hospitals, or blood groups..."
        className="max-w-xl"
      />

      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-sm text-slate-500 font-medium">Searching live database...</span>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 flex-wrap">
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
                  tab === t.key
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                        <p className="text-xs text-slate-500 truncate">{r.patientName || 'Emergency Patient'}</p>
                      </div>
                      <Badge variant={r.urgency === 'Critical' || r.priority === 'Critical' ? 'emergency' : 'danger'}>
                        {r.urgency || r.priority || 'High'}
                      </Badge>
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
                        <p className="text-xs text-slate-500">{h.address || h.location || 'Metropolis'}, {h.city || ''}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(tab === 'all' || tab === 'donors') && donors.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Available Donors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donors.map((d) => (
                    <Card key={d.id} hoverable className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                        {d.bloodGroup}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{d.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold">Available Donor</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalSearchPage;

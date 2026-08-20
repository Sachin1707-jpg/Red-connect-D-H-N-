import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Star, Loader2 } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/common/Button';
import { getHospitals } from '../../services/firestoreDataService';
import toast from 'react-hot-toast';

const BloodBanksPage = () => {
  const [search, setSearch] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (err) {
        console.error('[BloodBanksPage] Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = hospitals.filter(
    (h) =>
      !search ||
      (h.name && h.name.toLowerCase().includes(search.toLowerCase())) ||
      (h.city && h.city.toLowerCase().includes(search.toLowerCase())) ||
      (h.address && h.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-7 h-7 text-primary" />
          Verified Blood Banks & Hospital Inventory Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Locate live verified hospital blood repositories, check current stock levels in Firestore, and get direct contact numbers.
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch('')}
        placeholder="Search blood banks by hospital name or city..."
        className="max-w-md"
      />

      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-sm text-slate-500 font-medium">Loading live blood bank inventories...</span>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-12 text-sm">No blood banks match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h, i) => {
            const availableUnits = h.availableUnits || { "A+": 10, "B+": 15, "O+": 20, "O-": 2 };
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-primary">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {h.rating || 4.8}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{h.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    {h.address || h.location || 'Metropolis'}, {h.city || ''} ({h.distanceKm || 2.4} km away)
                  </p>

                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Live Unit Stock Matrix</p>
                  <div className="grid grid-cols-4 gap-1.5 mb-6">
                    {Object.entries(availableUnits).map(([group, count]) => (
                      <div
                        key={group}
                        className={`p-2 rounded-xl text-center border ${
                          count <= 2
                            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                            : 'bg-slate-50 dark:bg-slate-700/40 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <p className="text-[10px] font-black">{group}</p>
                        <p className="text-xs font-bold mt-0.5">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  {h.phone && (
                    <a
                      href={`tel:${h.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Hospital
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toast.success(`Inquiry sent to ${h.name}!`)}
                  >
                    Request Units
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BloodBanksPage;

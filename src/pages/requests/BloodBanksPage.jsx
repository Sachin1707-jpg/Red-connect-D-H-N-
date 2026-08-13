import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Star, Search, ShieldCheck } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { mockHospitals } from '../../data/mockData';

const BloodBanksPage = () => {
  const [search, setSearch] = useState('');

  const filtered = mockHospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-7 h-7 text-primary" />
          Verified Blood Banks & Hospital Inventory Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Locate verified hospital blood repositories, check current stock levels, and get direct contact numbers.
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch('')}
        placeholder="Search blood banks by hospital name or city..."
        className="max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-primary">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {h.rating}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{h.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                {h.address}, {h.city} ({h.distanceKm} km away)
              </p>

              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Live Unit Stock Matrix</p>
              <div className="grid grid-cols-4 gap-1.5 mb-6">
                {Object.entries(h.availableUnits).map(([group, count]) => (
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
              <a
                href={`tel:${h.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Hospital
              </a>
              <Button variant="outline" size="sm" className="flex-1">
                Request Units
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BloodBanksPage;

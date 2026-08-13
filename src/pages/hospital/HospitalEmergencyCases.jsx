import React from 'react';
import { motion } from 'framer-motion';
import { Siren, Clock, MapPin, Phone, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import toast from 'react-hot-toast';

const priorityConfig = {
  Critical: { variant: 'emergency', border: 'border-red-500', stripe: 'from-red-600 to-rose-600', pulse: true },
  High:     { variant: 'danger',    border: 'border-amber-500', stripe: 'from-amber-600 to-orange-500', pulse: false },
  Medium:   { variant: 'warning',   border: 'border-yellow-400', stripe: 'from-yellow-500 to-amber-400', pulse: false },
};

const HospitalEmergencyCases = () => {
  const { emergencyCases, donorResponses } = useSelector((s) => s.hospital);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Siren className="w-7 h-7 text-primary animate-pulse" />
          Active Emergency Cases & Status Tracker
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time priority board for all ongoing critical blood procurement cases</p>
      </div>

      {/* Priority Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emergencyCases.map((c, i) => {
          const conf = priorityConfig[c.priority] || priorityConfig.Medium;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`relative border-l-4 ${conf.border} overflow-hidden`}>
                {/* Priority stripe */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${conf.stripe} absolute top-0 left-0 right-0 ${conf.pulse ? 'animate-pulse' : ''}`} />

                <div className="pt-3">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/30 shrink-0">
                        {c.bloodGroup}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white">{c.patientName}</p>
                        <Badge variant={conf.variant} size="sm" pulse={conf.pulse} className="mt-1">{c.priority} Priority</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Units Needed</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{c.unitsRequired}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
                    <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-semibold">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Timeline: {c.timeline}</span>
                    </div>
                  </div>

                  {/* Nearby donors assigned */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-2">Assigned Donors</p>
                    <div className="flex gap-2 flex-wrap">
                      {donorResponses.filter(d => d.status === 'Accepted').slice(0, 2).map((d) => (
                        <div key={d.id} className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {d.donorName} ({d.bloodGroup})
                        </div>
                      ))}
                      {donorResponses.filter(d => d.status === 'Accepted').length === 0 && (
                        <span className="text-xs text-slate-500 italic">No donors assigned yet</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="emergency" size="sm" className="flex-1" onClick={() => toast.success(`Emergency escalated for ${c.patientName}`)}>
                      Escalate Alert
                    </Button>
                    <Button variant="success" size="sm" className="flex-1" onClick={() => toast.success(`Case ${c.patientName} marked resolved!`)}>
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Map Placeholder */}
      <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#EF4444 1px, transparent 1px), linear-gradient(90deg, #EF4444 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-center max-w-sm bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
          <MapPin className="w-10 h-10 text-primary mx-auto mb-3 animate-bounce" />
          <p className="text-white font-bold">Real-Time Emergency Map</p>
          <p className="text-slate-400 text-xs mt-1">Google Maps / Mapbox integration shows live case pins, nearby donors, and route ETAs in production.</p>
          <Button variant="emergency" size="sm" className="mt-4" onClick={() => toast.success('Opening navigation — production feature')}>
            Open Full Map View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitalEmergencyCases;

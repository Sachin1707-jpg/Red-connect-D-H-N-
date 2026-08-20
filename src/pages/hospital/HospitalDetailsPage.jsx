import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Phone, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getHospitals } from '../../services/firestoreDataService';

const HospitalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (id) {
          const docRef = doc(db, 'hospitals', id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setHospital({ id: snap.id, ...snap.data() });
            setLoading(false);
            return;
          }
        }
        const all = await getHospitals();
        setHospital(all.find((h) => h.id === id) || all[0] || null);
      } catch (err) {
        console.error('[HospitalDetailsPage] Error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        <span className="text-sm text-slate-500 font-medium">Loading hospital profile from Firestore...</span>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-slate-500 text-sm">Hospital record not found in live database.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  const availableUnits = hospital.availableUnits || { 'A+': 12, 'B+': 18, 'O+': 25, 'O-': 2 };

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
        Back to Hospitals
      </Button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-primary shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">{hospital.name}</h1>
                <Badge variant="success" size="sm">Verified</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />{hospital.address || hospital.location || 'Metropolis'}, {hospital.city || ''}
              </p>
            </div>
          </div>
          {hospital.phone && (
            <a href={`tel:${hospital.phone}`}>
              <Button variant="primary" size="sm" leftIcon={<Phone className="w-4 h-4" />}>Call Hospital</Button>
            </a>
          )}
        </div>
      </div>

      <Card>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Live Blood Inventory Units</h3>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(availableUnits).map(([group, count]) => (
            <div key={group} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-center border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-black text-red-600">{group}</p>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{count}</p>
              <p className="text-[10px] text-slate-400">units</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HospitalDetailsPage;

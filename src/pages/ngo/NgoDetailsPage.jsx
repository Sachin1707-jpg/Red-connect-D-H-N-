import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, MapPin, Calendar, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

const NgoDetailsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
        Back to Directory
      </Button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Red Cross Community Foundation</h1>
              <Badge variant="success" size="sm">Verified NGO</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">Reg #: NGO-88291-NY · Metropolis North Sector</p>
          </div>
        </div>
      </div>

      <Card>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Active Community Drives</h3>
        <p className="text-xs text-slate-500">Host of 14 successful blood donation camps in 2026 saving 400+ lives.</p>
      </Card>
    </div>
  );
};

export default NgoDetailsPage;

import React from 'react';
import { Siren, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const EmergencyWidget = () => (
  <Card className="h-full border-red-400 dark:border-red-800 bg-red-50/40 dark:bg-red-950/20">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Siren className="w-5 h-5 text-red-600 animate-pulse" />
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Critical Emergency Dispatch</h3>
      </div>
      <Badge variant="emergency" pulse>LIVE</Badge>
    </div>
    <div className="mt-3">
      <p className="text-2xl font-black text-red-600">3 O- Negative Requests</p>
      <p className="text-xs text-slate-500 mt-0.5">Required within 30 mins in Metropolis General Hospital</p>
    </div>
  </Card>
);

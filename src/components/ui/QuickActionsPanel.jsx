import React from 'react';
import { PlusCircle, HeartHandshake, UserCheck, PhoneCall } from 'lucide-react';
import { Button } from '../common/Button';

export const QuickActionsPanel = ({ onCreateRequest, onToggleAvailability, isAvailable }) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">Emergency Quick Actions Panel</h4>
          <p className="text-xs text-slate-400">Manage donor status or dispatch urgent hospital blood requests in seconds.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          variant={isAvailable ? 'success' : 'outline'}
          size="sm"
          leftIcon={<UserCheck className="w-4 h-4" />}
          onClick={onToggleAvailability}
        >
          {isAvailable ? 'Status: Available' : 'Status: On Break'}
        </Button>

        <Button
          variant="emergency"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={onCreateRequest}
        >
          Create Emergency Request
        </Button>
      </div>
    </div>
  );
};

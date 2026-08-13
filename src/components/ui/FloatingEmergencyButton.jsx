import React, { useState } from 'react';
import { Siren, PhoneCall } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const FloatingEmergencyButton = ({ onRequestClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-2xl shadow-red-600/50 hover:scale-110 active:scale-95 transition-all duration-300 animate-heart-pulse flex items-center justify-center focus:outline-none"
          title="Emergency Blood Request SOS"
        >
          <Siren className="w-7 h-7 animate-spin-slow" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Emergency Hotline / SOS
          </span>
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="🚨 Emergency Blood Dispatch & SOS Hotline"
        subtitle="Immediate assistance for critical trauma & ICU surgeries"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            <h4 className="font-bold text-sm mb-1">24/7 RedConnect National Emergency Desk</h4>
            <p className="text-xs">If you require immediate rare blood group units (O- / AB-) for an emergency surgery, call our priority toll-free line or dispatch an instant request.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Toll-Free Emergency Number</span>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">1-800-RED-HELP (733-4357)</p>
            </div>
            <a
              href="tel:18007334357"
              className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
            >
              <PhoneCall className="w-5 h-5" />
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="emergency"
              size="lg"
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                if (onRequestClick) onRequestClick();
              }}
            >
              Issue Urgent Emergency Request
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

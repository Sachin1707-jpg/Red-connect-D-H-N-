import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, MapPin, CheckCircle, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { notificationService } from '../../services/notificationService';
import { useSelector } from 'react-redux';

export const EmergencyNotificationBanner = () => {
  const [activeAlert, setActiveAlert] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth || {});

  useEffect(() => {
    const handleEmergencyEvent = (e) => {
      if (e.detail) {
        setActiveAlert(e.detail);
      }
    };

    window.addEventListener('redconnect_emergency_alert', handleEmergencyEvent);
    return () => {
      window.removeEventListener('redconnect_emergency_alert', handleEmergencyEvent);
    };
  }, []);

  if (!activeAlert) return null;

  const handleAccept = async () => {
    try {
      const donorId = user?.uid || user?.id || 'current_donor';
      await notificationService.respondToEmergencyRequest(activeAlert.requestId, donorId, 'accepted');
      toast.success('Pledge registered! Thank you for responding to this emergency.');
      setActiveAlert(null);
    } catch (err) {
      toast.error('Could not record response. Please try again.');
    }
  };

  const handleDismiss = () => {
    setActiveAlert(null);
  };

  const handleViewRequest = () => {
    setActiveAlert(null);
    navigate('/maps');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden"
      >
        {/* Animated accent pulse */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 animate-bounce shadow-lg shadow-red-500/40">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  Critical Alert
                </span>
                <span className="text-xs text-slate-400">Just Now</span>
              </div>
              <h4 className="text-base font-black text-white mt-1">
                🚨 {activeAlert.bloodGroup} Blood Needed
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Hospital: <span className="font-bold text-white">{activeAlert.hospitalName}</span>
                <br />
                Distance: <span className="font-bold text-emerald-400">{activeAlert.distanceKm ? `${activeAlert.distanceKm} km` : 'Nearby'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={handleViewRequest}
            className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Request
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 shadow-md shadow-emerald-600/30 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmergencyNotificationBanner;

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const AuthLayout = () => (
  <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900">
    {/* Left decorative panel */}
    <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-md">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-red-600 to-rose-500 rounded-2xl shadow-xl shadow-red-500/40">
            <Heart className="w-10 h-10 text-white fill-white animate-heart-pulse" />
          </div>
          <span className="font-black text-4xl text-white">Red<span className="text-red-400">Connect</span></span>
        </div>

        <h2 className="text-2xl font-black text-white mb-4 leading-tight">
          Every Drop Counts.<br />
          <span className="text-red-400">Connect. Save. Inspire.</span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Join 12,000+ active donors, 385+ verified hospitals, and countless NGOs working together to save lives every minute.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '12K+', label: 'Active Donors' },
            { value: '1.4K+', label: 'Lives Saved' },
            { value: '385+', label: 'Hospitals' },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right: Auth form */}
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
          <Heart className="w-6 h-6 text-red-400 fill-red-400 animate-heart-pulse" />
          <span className="font-black text-2xl text-white">Red<span className="text-red-400">Connect</span></span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-900/40 border border-slate-200 dark:border-slate-700 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

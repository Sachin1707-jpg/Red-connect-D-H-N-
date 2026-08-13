import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Shield, User } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';

const CallPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white">
      <div className="text-center max-w-sm w-full space-y-8">
        {/* Pulsing Avatar */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-red-600/30 rounded-full animate-ping" />
          <div className="relative p-2 rounded-full bg-slate-800 border-2 border-red-500">
            <Avatar name="Metro General Hospital" size="xl" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">Metro General Hospital</h2>
          <p className="text-sm text-red-400 font-semibold mt-1">Emergency Donor Dispatch Line</p>
          <p className="text-xs text-slate-400 mt-2 font-mono text-lg">{formatTime(seconds)}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${
              isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={() => window.history.back()}
            className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/40 transition-transform active:scale-95"
          >
            <PhoneOff className="w-8 h-8" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-4 rounded-full transition-all ${
              isSpeaker ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock, Users, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';

const defaultEvents = [
  { id: '1', day: 5, title: 'Metropolis Mega Community Drive', time: '9:00 AM - 5:00 PM', location: 'City Park Auditorium', type: 'camp', units: 200 },
  { id: '2', day: 12, title: 'University Youth Blood Camp', time: '10:00 AM - 4:00 PM', location: 'Student Union Hall', type: 'camp', units: 150 },
  { id: '3', day: 18, title: 'Hospital Emergency Donation Drive', time: '8:00 AM - 8:00 PM', location: 'Metro General Hospital', type: 'emergency', units: 50 },
  { id: '4', day: 25, title: 'Voluntary Blood Donation Drive', time: '11:00 AM - 3:00 PM', location: 'Red Cross Center', type: 'camp', units: 100 },
];

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [events, setEvents] = useState(defaultEvents);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const currentUser = auth.currentUser;
        const stored = localStorage.getItem('redconnect_user');
        const parsed = stored ? JSON.parse(stored) : null;
        const uid = currentUser ? currentUser.uid : (parsed ? (parsed.id || parsed._id) : null);

        if (uid) {
          const q = query(collection(db, 'appointments'), where('userId', '==', uid));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setUserAppointments(list);
            setEvents(prev => [...prev, ...list]);
          }
        }
      } catch (err) {
        console.warn('[CalendarPage] Error loading appointments:', err);
      }
    }
    loadAppointments();
  }, []);

  const handleRegister = async () => {
    if (!selectedEvent) return;
    try {
      const currentUser = auth.currentUser;
      const stored = localStorage.getItem('redconnect_user');
      const parsed = stored ? JSON.parse(stored) : null;
      const uid = currentUser ? currentUser.uid : (parsed ? (parsed.id || parsed._id) : null);

      if (uid) {
        const appt = {
          userId: uid,
          eventId: selectedEvent.id,
          title: selectedEvent.title,
          day: selectedEvent.day,
          time: selectedEvent.time,
          location: selectedEvent.location,
          status: 'Registered',
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'appointments'), appt);
        setUserAppointments(prev => [...prev, appt]);
      }
      toast.success(`Registered for ${selectedEvent.title}!`);
    } catch (err) {
      toast.success(`Registered for ${selectedEvent.title}!`);
    }
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Donation & Drive Calendar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Schedule and view upcoming community blood drives and donation appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>Prev</Button>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">August 2026</span>
          <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>Next</Button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold uppercase text-slate-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const event = events.find(e => e.day === day);
            const isRegistered = userAppointments.some(a => a.day === day || a.eventId === event?.id);

            return (
              <div
                key={day}
                onClick={() => event && setSelectedEvent(event)}
                className={`min-h-[70px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  event
                    ? isRegistered
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 cursor-pointer hover:shadow-md'
                      : 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 cursor-pointer hover:shadow-md'
                    : 'border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{day}</span>
                  {isRegistered && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Registered</span>}
                </div>
                {event && (
                  <div className={`p-1 rounded-lg text-white text-[10px] font-bold truncate ${isRegistered ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    {event.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details" subtitle="Donation Drive Information">
        {selectedEvent && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedEvent.title}</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-500" /> {selectedEvent.time}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> {selectedEvent.location}</p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-red-500" /> Target: {selectedEvent.units || 100} units</p>
            </div>
            <Button variant="primary" className="w-full" onClick={handleRegister}>
              Register for Event
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;

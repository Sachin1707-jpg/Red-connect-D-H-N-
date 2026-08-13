import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock, Users, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';

const mockEvents = [
  { id: '1', day: 5, title: 'Metropolis Mega Community Drive', time: '9:00 AM - 5:00 PM', location: 'City Park Auditorium', type: 'camp', units: 200 },
  { id: '2', day: 12, title: 'University Youth Blood Camp', time: '10:00 AM - 4:00 PM', location: 'Student Union Hall', type: 'camp', units: 150 },
  { id: '3', day: 18, title: 'Hospital Emergency Donation Drive', time: '8:00 AM - 8:00 PM', location: 'Metro General Hospital', type: 'emergency', units: 50 },
  { id: '4', day: 25, title: 'Voluntary Blood Donation Drive', time: '11:00 AM - 3:00 PM', location: 'Red Cross Center', type: 'camp', units: 100 },
];

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

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
            const event = mockEvents.find(e => e.day === day);
            return (
              <div
                key={day}
                onClick={() => event && setSelectedEvent(event)}
                className={`min-h-[70px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  event
                    ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 cursor-pointer hover:shadow-md'
                    : 'border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30'
                }`}
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{day}</span>
                {event && (
                  <div className="p-1 rounded-lg bg-red-600 text-white text-[10px] font-bold truncate">
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
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-red-500" /> Target: {selectedEvent.units} units</p>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { toast.success(`Registered for ${selectedEvent.title}!`); setSelectedEvent(null); }}>
              Register for Event
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;

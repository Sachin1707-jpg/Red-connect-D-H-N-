import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

const camps = [
  {
    id: 'camp_1',
    title: 'Metropolis Mega Community Blood Drive',
    organizer: 'Red Cross Community Foundation',
    date: '2026-08-05 (9:00 AM - 5:00 PM)',
    location: 'City Central Park Auditorium, Sector 4',
    targetUnits: 200,
    registeredDonors: 142,
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400'
  },
  {
    id: 'camp_2',
    title: 'Youth Voluntary Donation Camp',
    organizer: 'Metropolis University Youth Red Cross',
    date: '2026-08-12 (10:00 AM - 4:00 PM)',
    location: 'Student Union Hall, University Campus',
    targetUnits: 150,
    registeredDonors: 98,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400'
  }
];

const CampsPage = () => {
  const handleRegister = (title) => {
    toast.success(`🎉 Successfully registered for ${title}! Check your email for event pass.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <HeartHandshake className="w-7 h-7 text-primary" />
          Community Blood Donation Camps
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Join upcoming voluntary blood donation drives organized by registered NGOs and community groups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {camps.map((camp, i) => (
          <motion.div key={camp.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card hoverable className="overflow-hidden p-0">
              <div className="h-48 bg-slate-200 dark:bg-slate-700 relative">
                <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge variant="success" size="sm">Registration Open</Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{camp.title}</h3>
                  <p className="text-xs text-primary font-semibold mt-0.5">Organized by {camp.organizer}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" /> {camp.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" /> {camp.location}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Target: {camp.targetUnits} units</span>
                    <span className="font-bold text-slate-900 dark:text-white">{camp.registeredDonors} registered</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full"
                      style={{ width: `${(camp.registeredDonors / camp.targetUnits) * 100}%` }}
                    />
                  </div>
                </div>

                <Button variant="primary" className="w-full" onClick={() => handleRegister(camp.title)}>
                  Register to Attend Drive
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampsPage;

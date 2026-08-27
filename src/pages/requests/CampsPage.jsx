import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Users, HeartHandshake, CheckCircle2, Search, Filter,
  Clock, Phone, ShieldCheck, Award, Info, Sparkles, Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { fetchCamps } from '../../redux/ngoSlice';
import { awardPoints } from '../../redux/rewardSlice';
import { updateUserLocal } from '../../redux/authSlice';
import { mockCamps } from '../../data/mockData';

const BLOOD_GROUPS = ['ALL', 'O-', 'O+', 'A+', 'B+', 'AB+'];

const CampsPage = () => {
  const dispatch = useDispatch();
  const { camps = [] } = useSelector((s) => s.ngo);
  const { user } = useSelector((s) => s.auth);

  const [campList, setCampList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [registeredCampPass, setRegisteredCampPass] = useState(null);
  const [registeredIds, setRegisteredIds] = useState({});

  useEffect(() => {
    dispatch(fetchCamps());
  }, [dispatch]);

  useEffect(() => {
    if (camps && camps.length > 0) {
      setCampList(camps);
    } else {
      setCampList(mockCamps);
    }
  }, [camps]);

  // Handle Camp Registration / Pledge
  const handleRegister = (camp) => {
    if (registeredIds[camp.id]) {
      setRegisteredCampPass(camp);
      return;
    }

    setRegisteredIds((prev) => ({ ...prev, [camp.id]: true }));

    // Award +50 Reward Points for pledging camp attendance
    dispatch(awardPoints(50));
    if (user) {
      dispatch(updateUserLocal({ rewardPoints: (user.rewardPoints || 0) + 50 }));
    }

    setRegisteredCampPass(camp);
    toast.success(`🎉 Registered for "${camp.title}"! +50 Reward Points added to your profile.`);
  };

  const filteredCamps = campList.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.organizer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    const matchesGroup =
      bloodGroupFilter === 'ALL' ||
      !c.requiredBloodGroups ||
      c.requiredBloodGroups.includes('All Groups') ||
      c.requiredBloodGroups.includes(bloodGroupFilter);

    return matchesSearch && matchesStatus && matchesGroup;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-red-600" />
            Community Blood Donation Camps
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse upcoming blood donation drives, pledge attendance, and earn +50 reward points per camp
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> +50 Reward Points per Registration
          </div>
          <h2 className="text-xl md:text-2xl font-black">Save Lives at Local Community Drives</h2>
          <p className="text-xs md:text-sm text-red-100 max-w-xl">
            Voluntary blood camps are organized by verified NGOs & hospital networks. Register in advance to secure your preferred time slot and fast-track health screening.
          </p>
        </div>
        <div className="shrink-0 z-10">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <p className="text-xs text-red-100 font-semibold uppercase">Active Drives</p>
            <p className="text-3xl font-black">{campList.filter((c) => c.status === 'Active' || c.status === 'Upcoming').length}</p>
            <p className="text-[11px] text-red-200 mt-0.5">Ready for Donors</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search by camp title, location, or NGO..."
          />

          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {['ALL', 'Active', 'Upcoming', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Blood:</span>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setBloodGroupFilter(bg)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  bloodGroupFilter === bg
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camp Cards Grid */}
      {filteredCamps.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake className="w-12 h-12 text-slate-400" />}
          title="No donation camps match your filter"
          description="Try adjusting your blood group or status filter, or clear your search query."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('ALL');
            setBloodGroupFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCamps.map((camp, i) => {
            const isRegistered = registeredIds[camp.id];
            const isCompleted = camp.status === 'Completed';
            const isCancelled = camp.status === 'Cancelled';

            return (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col justify-between p-5 hover:shadow-md transition-all border border-slate-200 dark:border-slate-700">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant={
                          camp.status === 'Active'
                            ? 'success'
                            : camp.status === 'Upcoming'
                            ? 'indigo'
                            : camp.status === 'Completed'
                            ? 'default'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {camp.status}
                      </Badge>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {camp.registered || 0} / {camp.target || 100} pledged
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2">{camp.title}</h3>
                      <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">
                        Organized by {camp.organizer}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{camp.date} ({camp.startTime || '09:00 AM'} - {camp.endTime || '05:00 PM'})</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{camp.location}</span>
                      </p>
                      {camp.requiredBloodGroups && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          <span className="text-[11px] text-slate-400 font-semibold">Needed:</span>
                          {camp.requiredBloodGroups.map((g) => (
                            <span key={g} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Registration Progress */}
                    <div className="pt-1">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Target: {camp.target} units</span>
                        <span className="font-bold text-emerald-500">
                          {Math.round(((camp.registered || 0) / (camp.target || 1)) * 100)}% Capacity
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full"
                          style={{ width: `${Math.min(((camp.registered || 0) / (camp.target || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => setSelectedCamp(camp)}>
                      View Details
                    </Button>
                    <Button
                      variant={isRegistered ? 'success' : isCompleted || isCancelled ? 'outline' : 'primary'}
                      size="sm"
                      className="flex-1 text-xs"
                      isDisabled={isCompleted || isCancelled}
                      leftIcon={isRegistered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                      onClick={() => handleRegister(camp)}
                    >
                      {isRegistered ? 'Pass Ready ✓' : isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : 'Register (+50 Pts)'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Camp Detail Modal */}
      <Modal
        isOpen={!!selectedCamp}
        onClose={() => setSelectedCamp(null)}
        title="Donation Camp Details"
        subtitle={selectedCamp?.organizer}
      >
        {selectedCamp && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{selectedCamp.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">{selectedCamp.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Date & Time</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCamp.date}</p>
                <p className="text-slate-500">{selectedCamp.startTime} - {selectedCamp.endTime}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Contact Helpline</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCamp.contactPhone || '+91-98765-00300'}</p>
                <p className="text-slate-500">Camp Coordinator</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-xs">
              <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Full Venue Address</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-1">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                {selectedCamp.address || selectedCamp.location}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedCamp(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                leftIcon={<Ticket className="w-4 h-4" />}
                onClick={() => {
                  handleRegister(selectedCamp);
                  setSelectedCamp(null);
                }}
              >
                Register to Attend
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Registration Event Pass Modal */}
      <Modal
        isOpen={!!registeredCampPass}
        onClose={() => setRegisteredCampPass(null)}
        title="Donor Event Pass — Ready"
        subtitle="Present this digital pass at the camp registration desk"
      >
        {registeredCampPass && (
          <div className="space-y-4 text-center">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-white space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-red-100 tracking-wider">Official Entry Pass</p>
                <h3 className="text-lg font-black mt-0.5">{registeredCampPass.title}</h3>
                <p className="text-xs text-red-100 mt-1">{registeredCampPass.date} ({registeredCampPass.startTime || '09:00 AM'})</p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md border border-white/20 text-xs space-y-1 text-left">
                <p><strong>Donor Name:</strong> {user?.name || 'Registered Donor'}</p>
                <p><strong>Blood Group:</strong> {user?.bloodGroup || 'O+'}</p>
                <p><strong>Pass ID:</strong> PASS-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p><strong>Reward Awarded:</strong> +50 Pts Credited</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              📍 Venue: {registeredCampPass.address || registeredCampPass.location}
            </p>

            <Button
              variant="primary"
              className="w-full"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => setRegisteredCampPass(null)}
            >
              Got it, Close Pass
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CampsPage;

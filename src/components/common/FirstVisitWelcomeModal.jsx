import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Building2, Users, Sparkles, CheckCircle2, ArrowRight, User } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { dismissFirstVisit } from '../../redux/authSlice';

const ROLE_WELCOME = {
  donor: {
    icon: Heart,
    title: 'Welcome to the RedConnect Blood Donor Network! 🩸',
    desc: 'You are now ready to save lives! Monitor emergency requests, update your availability, and earn rewards for every donation.',
    color: 'text-red-500 bg-red-50 dark:bg-red-950/40',
    profileLink: '/profile',
  },
  hospital: {
    icon: Building2,
    title: 'Welcome to your Hospital Administration Portal! 🏥',
    desc: 'Manage blood inventory stock, dispatch emergency requests to nearby donors, and coordinate blood procurement.',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    profileLink: '/hospital/profile',
  },
  ngo: {
    icon: Users,
    title: 'Welcome to your NGO Organizer Hub! 🤝',
    desc: 'Schedule community blood donation camps, manage volunteers, and monitor hospital blood shortages in real-time.',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    profileLink: '/ngo/camps',
  },
};

export const FirstVisitWelcomeModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isFirstVisit } = useSelector((s) => s.auth);

  if (!isFirstVisit || !user) return null;

  const roleKey = user.role || 'donor';
  const welcome = ROLE_WELCOME[roleKey] || ROLE_WELCOME.donor;
  const Icon = welcome.icon;

  const handleDismiss = () => {
    dispatch(dismissFirstVisit());
  };

  const handleGoToProfile = () => {
    dispatch(dismissFirstVisit());
    navigate(welcome.profileLink);
  };

  return (
    <Modal
      isOpen={isFirstVisit}
      onClose={handleDismiss}
      title=""
      maxWidth="max-w-md"
    >
      <div className="text-center space-y-4 pt-2">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md ${welcome.color}`}>
          <Icon className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <Badge variant="success" size="sm" className="mb-2">Account Ready ✓</Badge>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Hello, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {welcome.desc}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-left space-y-2 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200">✨ Quick Highlights:</p>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Live Emergency Request Notifications</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Interactive Spatial Map & Location Matching</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Direct Contact & Coordination Features</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" size="lg" className="w-full" onClick={handleDismiss} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Get Started
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={handleGoToProfile} leftIcon={<User className="w-3.5 h-3.5" />}>
            Complete Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};

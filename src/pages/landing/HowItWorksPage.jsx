import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, ShieldCheck, Zap, Heart, ChevronDown, ChevronUp,
  Building2, HeartHandshake, Droplets, Bell, MapPin, CheckCircle2,
  ArrowRight, Users, Siren
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const ROLES = [
  {
    key: 'donor',
    icon: Heart,
    title: 'As a Blood Donor',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    steps: [
      { step: '01', title: 'Register & Verify', desc: 'Sign up with your blood group, location, and emergency contact. Complete your medical profile.' },
      { step: '02', title: 'Toggle Availability', desc: 'Enable real-time alerts when you\'re ready to donate. Pause anytime with one click.' },
      { step: '03', title: 'Receive Notifications', desc: 'Get instant push notifications when a nearby patient matches your blood type.' },
      { step: '04', title: 'Accept & Donate', desc: 'Accept the request, head to the hospital, donate, and earn reward points for every verified donation.' },
    ]
  },
  {
    key: 'hospital',
    icon: Building2,
    title: 'As a Hospital / Blood Bank',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    steps: [
      { step: '01', title: 'Register & Get Verified', desc: 'Submit hospital credentials, blood bank license, and operating details. Admin review takes <24 hrs.' },
      { step: '02', title: 'Manage Blood Inventory', desc: 'Keep real-time stock levels updated for all 8 blood types. Get low-stock alerts automatically.' },
      { step: '03', title: 'Create Blood Requests', desc: 'Post emergency or standard requests with blood group, units needed, urgency, and patient details.' },
      { step: '04', title: 'Track Donor Responses', desc: 'View incoming donor pledges, coordinate donation slots, and close requests once fulfilled.' },
    ]
  },
  {
    key: 'ngo',
    icon: HeartHandshake,
    title: 'As an NGO / Community Organizer',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    steps: [
      { step: '01', title: 'Register Organization', desc: 'Submit your NGO registration certificate and coordinator details for admin approval.' },
      { step: '02', title: 'Organize Donation Camps', desc: 'Schedule camps, set location & timing, and broadcast to nearby eligible donors in the area.' },
      { step: '03', title: 'Monitor Blood Shortages', desc: 'Access the shortage monitor to identify critical blood type gaps in your region.' },
      { step: '04', title: 'Manage Volunteers', desc: 'Assign volunteer roles, track participation, and report impact to your NGO dashboard.' },
    ]
  },
];

const FAQS = [
  { q: 'Is RedConnect free to use?', a: 'Yes. RedConnect is completely free for individual donors. Hospitals and NGOs have a free tier with all core features.' },
  { q: 'How does the matching engine work?', a: 'When a hospital creates a blood request, our engine matches nearby eligible donors based on blood type compatibility, real-time availability status, and proximity. Priority donors are notified first.' },
  { q: 'How often can I donate blood?', a: 'Whole blood donors can donate every 56 days (about 8 weeks). Platelet donors can donate every 7 days. The app tracks your last donation and reminds you when you\'re eligible again.' },
  { q: 'What happens if I decline an emergency alert?', a: 'No penalty — life happens. If you decline, the next eligible donor on the priority list is immediately notified. You can toggle your availability off anytime to pause alerts.' },
  { q: 'How are hospitals verified?', a: 'Every hospital submits government registration numbers, blood bank licenses, and operating details. Our admin team manually reviews documents within 24 hours before granting access.' },
];

const FEATURES = [
  { icon: Bell, title: 'Real-Time Push Alerts', desc: 'Blood group & location-targeted notifications within seconds of an emergency being posted.' },
  { icon: MapPin, title: 'Live Donor Map', desc: 'Interactive map showing nearby available donors and hospitals with live inventory status.' },
  { icon: ShieldCheck, title: 'Admin Verification Gate', desc: 'Every request passes through admin validation before being dispatched to the matching engine.' },
  { icon: CheckCircle2, title: 'Donation Tracking', desc: 'Complete history of donations with verification certificates and points earned.' },
  { icon: Users, title: 'NGO Drive Network', desc: 'NGOs can post donation camps visible to all eligible donors within the coverage radius.' },
  { icon: Siren, title: 'Escalation System', desc: 'Unfulfilled requests auto-escalate to NGO network for emergency donation drives.' },
];

const HowItWorksPage = () => {
  const [activeRole, setActiveRole] = useState('donor');
  const [openFaq, setOpenFaq] = useState(null);

  const activeData = ROLES.find(r => r.key === activeRole);

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center bg-gradient-to-br from-slate-900 via-red-950/30 to-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div {...fadeUp(0)}>
            <Badge variant="danger" className="mb-6 inline-flex">How RedConnect Works</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              From Registration to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                Saving a Life
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Whether you're a donor, hospital, or NGO — RedConnect is built around your role. Explore how each piece of the network works together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Role Selector */}
      <section className="py-16 bg-white dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Choose Your Role</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">See the exact flow for your role on the platform</p>
          </div>
          {/* Role Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {ROLES.map(r => {
              const Icon = r.icon;
              const isActive = activeRole === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setActiveRole(r.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                    isActive
                      ? `${r.bg} ${r.border} ${r.color} shadow-md`
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {r.title}
                </button>
              );
            })}
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {activeData.steps.map((s, i) => (
                <div key={s.step} className="relative">
                  <Card className={`h-full border-2 ${activeData.border}`}>
                    <div className={`w-12 h-12 rounded-2xl ${activeData.bg} flex items-center justify-center font-black text-lg ${activeData.color} mb-4 shadow-sm`}>
                      {s.step}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                  </Card>
                  {i < activeData.steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Platform Flow Diagram */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="danger" className="mb-4">System Flow</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">The Complete Request Lifecycle</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">From a hospital posting a blood request to a donor completing the donation</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Building2, label: 'Hospital Creates Request', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
              { icon: ShieldCheck, label: 'Admin Validates & Approves', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
              { icon: Zap, label: 'Matching Engine Finds Donors', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
              { icon: Bell, label: 'Push Alerts Sent', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' },
              { icon: Heart, label: 'Donor Accepts & Donates', color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
              { icon: CheckCircle2, label: 'Request Fulfilled', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
            ].map((f, i) => (
              <motion.div key={f.label} {...fadeUp(i * 0.08)} className="flex flex-col items-center text-center gap-3">
                <div className={`p-4 rounded-2xl ${f.color} shadow-sm`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{f.label}</p>
                {i < 5 && (
                  <div className="hidden lg:block absolute mt-8 translate-x-[120%] text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="warning" className="mb-4">Platform Features</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Everything Built Into One Network</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.08)}>
                <Card hoverable className="flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="danger" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)}>
                <div
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{faq.q}</p>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    }
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp(0)}>
            <Droplets className="w-14 h-14 text-white/30 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
            <p className="text-red-100 text-sm mb-8">Create your free account in under 2 minutes and become part of the network saving lives every day.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="bg-white text-red-600 hover:bg-red-50 font-black">
                  Join RedConnect Free
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;

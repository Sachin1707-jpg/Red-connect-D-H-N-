import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Users, Building2, HeartHandshake, ShieldCheck,
  Droplets, Globe2, Zap, Award, ArrowRight, Star
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

const STATS = [
  { label: 'Registered Donors', value: '12,400+', icon: Users, color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
  { label: 'Verified Hospitals', value: '385+', icon: Building2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  { label: 'Partner NGOs', value: '42+', icon: HeartHandshake, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
  { label: 'Lives Saved', value: '1,420+', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' },
];

const VALUES = [
  { icon: Zap, title: 'Speed First', desc: 'Every second matters in a blood emergency. We prioritize real-time matching and instant alerts over everything else.', color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
  { icon: ShieldCheck, title: 'Verified & Trusted', desc: 'All hospitals, NGOs, and medical documents are admin-verified before gaining access to our network.', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
  { icon: Globe2, title: 'Community Driven', desc: 'Built on the voluntary spirit of everyday heroes — donors, volunteers, and healthcare workers.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  { icon: Award, title: 'Reward Generosity', desc: 'Our gamified reward engine recognizes every donation with badges, points, and real-world health perks.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
];

const TEAM = [
  { name: 'Dr. Anita Rao', role: 'Medical Director & Co-Founder', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200', bio: 'Emergency physician with 18 years in trauma care. Passionate about closing the blood supply gap.', stars: 5 },
  { name: 'Marcus Chen', role: 'CTO & Engineering Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', bio: 'Full-stack engineer and open-source contributor who architected the matching engine.', stars: 5 },
  { name: 'Priya Nambiar', role: 'NGO & Community Head', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', bio: 'Former Red Cross director who manages all NGO partnerships and donation camp programs.', stars: 5 },
];

const AboutPage = () => {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-slate-900 via-red-950/30 to-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div {...fadeUp(0)}>
            <Badge variant="danger" className="mb-6 inline-flex">Our Mission</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Building the World's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                Most Connected
              </span>{' '}
              Blood Network
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              RedConnect was founded on a single belief: no patient should lose their life because a willing donor couldn't be found in time. We exist to make that scenario impossible.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button variant="emergency" size="lg" leftIcon={<Heart className="w-5 h-5" />}>
                  Join as Donor
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  How It Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.1)}>
                <Card className="text-center p-6">
                  <div className={`inline-flex p-3 rounded-2xl mb-3 ${s.color}`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">{s.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0)}>
            <Badge variant="warning" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-5">
              Born from a Real Emergency
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
              In 2024, our co-founder Dr. Anita Rao watched a patient lose their life in the ER — not because blood wasn't available in the city, but because no system existed to connect the right donor within the critical window.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
              That night, she called Marcus Chen and together they sketched RedConnect on a napkin. What started as a prototype connecting 50 local donors now powers a network of 12,000+ donors across hundreds of hospitals and NGOs.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Today, RedConnect is more than a platform — it's a lifeline woven into communities everywhere.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-4">
            {[
              { year: '2024', event: 'RedConnect founded after an ER tragedy', color: 'bg-red-500' },
              { year: 'Q2 2024', event: '1,000 donors onboarded in first 60 days', color: 'bg-amber-500' },
              { year: 'Q4 2024', event: 'First 100 hospital partnerships', color: 'bg-emerald-500' },
              { year: '2025', event: '1,420+ verified lives saved platform-wide', color: 'bg-indigo-500' },
            ].map((e, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${e.color} mb-2`} />
                <p className="text-xs font-black text-slate-900 dark:text-white">{e.year}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{e.event}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="danger" className="mb-4">Core Values</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.1)}>
                <Card hoverable className="h-full">
                  <div className={`inline-flex p-3 rounded-2xl mb-4 ${v.color}`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="warning" className="mb-4">Leadership</Badge>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">The Team Behind RedConnect</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)}>
                <Card hoverable className="text-center p-6">
                  <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
                  <div className="flex gap-1 justify-center mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white">{t.name}</h3>
                  <p className="text-xs text-primary font-semibold mt-1 mb-3">{t.role}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.bio}</p>
                </Card>
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
            <h2 className="text-3xl font-black text-white mb-4">Be Part of the Mission</h2>
            <p className="text-red-100 text-sm mb-8 max-w-lg mx-auto">
              Every registration, every donation, and every moment of availability is a life saved. Join the RedConnect community today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="bg-white text-red-600 hover:bg-red-50 font-black">
                  Register Now
                </Button>
              </Link>
              <Link to="/requests">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  View Emergency Requests
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

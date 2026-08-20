import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '../../redux/requestSlice';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Heart, Droplets, MapPin, Award, Siren, ArrowRight,
  CheckCircle2, Users, Building2, HeartHandshake, ChevronRight, Star, Zap
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

const CountUp = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000 });
  const display = useTransform(spring, (v) => `${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: liveRequests } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const activeRequests = (liveRequests || []).filter(r => r.status === 'Active' || r.status === 'open' || !r.status);
  const emergencyAlerts = activeRequests.filter(r => r.urgency === 'Critical' || r.urgency === 'critical');

  const stats = [
    { label: 'Registered Donors', value: 12400, suffix: '+', icon: Users, color: 'text-red-500' },
    { label: 'Verified Hospitals', value: 385, suffix: '+', icon: Building2, color: 'text-emerald-500' },
    { label: 'Lives Saved', value: 1420, suffix: '+', icon: Heart, color: 'text-rose-500' },
    { label: 'Emergency Requests', value: activeRequests.length || 289, suffix: ' active', icon: Siren, color: 'text-amber-500' },
  ];

  const features = [
    { icon: Zap, title: 'Instant Emergency Alerts', desc: 'Receive geo-targeted blood type notifications within seconds of a critical request being posted.', color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
    { icon: MapPin, title: 'Nearby Donor Matching', desc: 'Smart radius-based filtering connects eligible donors with hospitals within minutes.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { icon: Award, title: 'Gamified Reward System', desc: 'Earn points, unlock health vouchers, and climb the community leaderboard with every donation.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { icon: Droplets, title: 'Live Inventory Dashboard', desc: 'Hospitals manage real-time blood stock levels across all 8 blood types with low-stock warnings.', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
  ];

  const steps = [
    { step: '01', title: 'Register Your Role', desc: 'Sign up as a Donor, Hospital, or NGO in under 2 minutes.' },
    { step: '02', title: 'Set Availability', desc: 'Donors toggle their status. Hospitals keep inventory updated.' },
    { step: '03', title: 'Emergency Match', desc: 'Critical requests are broadcast to compatible donors instantly.' },
    { step: '04', title: 'Save a Life', desc: 'Donor arrives, donates, earns points, and saves lives.' },
  ];

  const testimonials = [
    { name: 'Dr. Anita Rao', role: 'Emergency Physician, City General Hospital', text: 'RedConnect reduced our average donor procurement time from 3 hours to under 20 minutes for rare blood types. It is genuinely life-saving technology.', stars: 5 },
    { name: 'Marcus Chen', role: 'Regular Donor, O-Negative', text: 'Being notified within seconds of a nearby emergency that matches my blood type makes me feel like a true everyday hero. The rewards program keeps me engaged.', stars: 5 },
    { name: 'Priya Nambiar', role: 'NGO Director, Red Cross Community', text: 'Our blood camp registrations tripled after listing drives on RedConnect. Incredible platform for community organizations.', stars: 5 },
  ];

  const urgencyColors = { Critical: 'emergency', High: 'danger', Medium: 'warning' };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-red-950/30 to-slate-900">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Emergency ticker */}
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 overflow-hidden">
          <div className="flex items-center gap-2 animate-marquee whitespace-nowrap">
            {(emergencyAlerts.length > 0 ? emergencyAlerts : activeRequests).map((a, i) => (
              <span key={a.id || i} className="flex items-center gap-3 mr-12 text-xs font-semibold">
                <Siren className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                🚨 URGENT: {a.bloodGroup} Needed — {a.hospitalName || a.hospital?.name || 'Local Hospital'} ({a.location || 'Near You'})
                <span className="text-red-300">•••</span>
              </span>
            ))}
            {activeRequests.length === 0 && (
              <span className="flex items-center gap-3 mr-12 text-xs font-semibold">
                <Siren className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                🚨 LIVE NETWORK ACTIVE — Ready to transmit emergency blood requests 24/7
              </span>
            )}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10 grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Emergency Network Active
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
              Every Drop Counts.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                Save a Life Today.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              RedConnect bridges the gap between voluntary blood donors and emergency patients in real-time. Powered by community, built to save lives.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button variant="emergency" size="lg" leftIcon={<Siren className="w-5 h-5" />} onClick={() => navigate('/requests')}>
                View Emergency Requests
              </Button>
              <Button variant="outline" size="lg" leftIcon={<Heart className="w-5 h-5" />} onClick={() => navigate('/signup')} className="border-white/20 text-white hover:bg-white/10">
                Become a Donor
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {[
                '✅ Free & Open Platform',
                '✅ Verified Hospitals Only',
                '✅ Real-Time Alerts',
              ].map((t) => (
                <span key={t} className="text-xs text-slate-400 font-medium">{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Live Request Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">🩸 Active Emergency Requests</p>
            {activeRequests.slice(0, 3).map((req, i) => (
              <motion.div
                key={req.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/40 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0 font-black text-white text-lg shadow-lg shadow-red-600/40">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{req.hospitalName || req.hospital?.name || 'Local Hospital'}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{req.patientName || 'Patient'}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={urgencyColors[req.urgency] || 'default'} size="sm" pulse={req.urgency === 'Critical'}>
                          {req.urgency || 'Critical'}
                        </Badge>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {req.location || 'Nearby'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Units Needed</p>
                    <p className="text-lg font-black text-white">{req.unitsRequired || req.unitsNeeded || 1}</p>
                    <p className="text-[11px] text-emerald-400">{req.unitsPledged || 0} pledged</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {activeRequests.length === 0 && (
              <p className="text-sm text-slate-400 italic">No active requests at present.</p>
            )}
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/requests')}>
              View All {activeRequests.length} Active Requests
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 mb-3 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="danger" className="mb-4">Core Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Built for Life-Saving Speed
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              RedConnect combines real-time matching, gamification, and hospital-grade tools in one seamless platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hoverable className="h-full">
                  <div className={`inline-flex p-3 rounded-2xl mb-4 ${f.color}`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">How RedConnect Works</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Four simple steps from registration to saving a life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-xl shadow-red-500/30 mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute mt-7 ml-[80%] text-slate-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Voices of the Community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card hoverable className="h-full">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Heart className="w-14 h-14 text-white/30 fill-white/20 mx-auto mb-6 animate-heart-pulse" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Save a Life?</h2>
            <p className="text-red-100 text-sm mb-8 max-w-lg mx-auto">
              Join 12,000+ donors, 385+ hospitals, and hundreds of NGOs already on the RedConnect network.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={() => navigate('/signup')} className="bg-white text-red-600 hover:bg-red-50 font-black">
                Register as Donor
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={() => navigate('/requests')}>
                Browse Requests
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

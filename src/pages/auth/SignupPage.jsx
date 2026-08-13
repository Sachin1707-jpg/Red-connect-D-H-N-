import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Phone, MapPin, Droplets, Building2, Users, ShieldCheck, Eye, EyeOff, Calendar, Weight, CheckCircle2, ShieldAlert, ArrowRight, PartyPopper, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { MedicalDocumentUploader } from '../../components/forms/MedicalDocumentUploader';
import { signupUser } from '../../redux/authSlice';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];
const HOSPITAL_TYPES = ['Government Hospital', 'Private Hospital', 'Blood Bank Center', 'Trauma Care Center'];
const NGO_TYPES = ['Charitable Trust', 'Non-Profit Organization', 'Community Red Cross Chapter', 'Youth Society'];

// Schemas per role
const donorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string(),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  dob: z.string().min(1, 'Date of birth required'),
  gender: z.string().min(1, 'Gender is required'),
  weight: z.string().min(1, 'Weight is required'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  emergencyContact: z.string().min(7, 'Emergency contact required'),
  medicalHistory: z.string().optional(),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const hospitalSchema = z.object({
  hospitalName: z.string().min(2, 'Hospital name is required'),
  hospitalType: z.string().min(1, 'Hospital type is required'),
  registrationNumber: z.string().min(3, 'Registration number is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  emergencyContact: z.string().min(7, 'Emergency contact required'),
  licenseNumber: z.string().min(3, 'License number is required'),
  website: z.string().optional(),
  operatingHours: z.string().min(2, 'Operating hours required'),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ngoSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  registrationNumber: z.string().min(3, 'Registration number is required'),
  organizationType: z.string().min(1, 'Organization type is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  website: z.string().optional(),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  coordinatorName: z.string().min(2, 'Coordinator name is required'),
  coordinatorPhone: z.string().min(7, 'Coordinator phone required'),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ROLE_CARDS = [
  {
    key: 'donor',
    title: 'Register as Donor',
    icon: Heart,
    desc: 'Become a verified blood donor and help save lives.',
    btnText: 'Register as Donor',
    accent: 'border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-600',
  },
  {
    key: 'hospital',
    title: 'Register as Hospital / Blood Bank',
    icon: Building2,
    desc: 'Manage emergency requests and blood inventory.',
    btnText: 'Register as Hospital / Blood Bank',
    accent: 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600',
  },
  {
    key: 'ngo',
    title: 'Register as NGO / Community Organizer',
    icon: Users,
    desc: 'Organize donation camps and coordinate volunteers.',
    btnText: 'Register as NGO / Community Organizer',
    accent: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600',
  },
  {
    key: 'admin',
    title: 'Register as Administrator',
    icon: ShieldCheck,
    desc: 'Administrative access reserved for platform operators.',
    btnText: 'Admin Notice',
    accent: 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 text-purple-600',
  },
];

const ROLE_REDIRECT_MAP = {
  donor: '/dashboard',
  hospital: '/hospital/dashboard',
  ngo: '/ngo/dashboard',
  admin: '/admin/dashboard',
};

const ROLE_WELCOME_TOASTS = {
  donor: '❤️ Welcome! Thank you for joining RedConnect as a Blood Donor.',
  hospital: '🏥 Welcome! Your Hospital / Blood Bank account is ready.',
  ngo: '🤝 Welcome! Your NGO / Community Organizer account has been created successfully.',
};

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [selectedRole, setSelectedRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const activeSchema = selectedRole === 'hospital' ? hospitalSchema : selectedRole === 'ngo' ? ngoSchema : donorSchema;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(activeSchema),
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      role: selectedRole,
      name: data.name || data.hospitalName || data.organizationName,
      isAvailable,
    };

    const result = await dispatch(signupUser(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      // Show role-specific welcome message
      const welcomeMsg = ROLE_WELCOME_TOASTS[selectedRole] || '🎉 Welcome to RedConnect!';
      toast.success(welcomeMsg, { duration: 4000 });

      // Trigger success animation overlay briefly, then redirect
      setRegistrationSuccess(true);
      setTimeout(() => {
        const targetRoute = ROLE_REDIRECT_MAP[selectedRole] || '/dashboard';
        navigate(targetRoute, { replace: true });
      }, 1800);
    } else {
      toast.error(result.payload || 'Registration failed. Please try again.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* ✅ Registration Success Overlay */}
      <AnimatePresence>
        {registrationSuccess && (
          <motion.div
            key="success-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40"
            >
              <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6 space-y-2 px-8"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Account Created!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Welcome to RedConnect. Redirecting to your dashboard…
              </p>
              <div className="flex justify-center pt-3">
                <div className="flex gap-1.5">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Join RedConnect</h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Choose how you want to register</p>
      </div>


      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLE_CARDS.map((card) => {
          const isSelected = selectedRole === card.key;
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(card.key)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? `${card.accent} ring-2 ring-offset-2 ring-primary shadow-md`
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/80 dark:bg-slate-800 shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{card.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.desc}</p>
              </div>
              <span className="text-[11px] font-bold text-primary mt-3 flex items-center gap-1">
                {card.btnText} <ArrowRight className="w-3 h-3" />
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Admin Notice Card */}
      {selectedRole === 'admin' ? (
        <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-purple-600 mx-auto" />
          <div>
            <h3 className="font-bold text-purple-900 dark:text-purple-200 text-lg">Administrator Registration Locked</h3>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 max-w-sm mx-auto">
              Administrator accounts are created only by the Super Admin for security compliance.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/login">
              <Button variant="outline" size="sm">Back to Login</Button>
            </Link>
            <Button variant="primary" size="sm" onClick={() => toast.success('Support request sent to Super Admin!')}>
              Contact Administrator
            </Button>
          </div>
        </div>
      ) : (
        /* Form per role */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Registering as: <span className="capitalize text-primary font-black">{selectedRole}</span></span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          {/* Donor Fields */}
          {selectedRole === 'donor' && (
            <div className="space-y-3">
              <Input label="Full Name" placeholder="Sarah Jenkins" leftIcon={<User className="w-4 h-4" />} error={errors.name?.message} required {...register('name')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Email" type="email" placeholder="sarah@example.com" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} required {...register('email')} />
                <Input label="Phone Number" placeholder="+1-555-0147" leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} required {...register('phone')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select label="Blood Group" options={BLOOD_GROUPS.map(g => ({ value: g, label: g }))} leftIcon={<Droplets className="w-4 h-4" />} error={errors.bloodGroup?.message} required {...register('bloodGroup')} />
                <Input label="Date of Birth" type="date" error={errors.dob?.message} required {...register('dob')} />
                <Select label="Gender" options={GENDERS.map(g => ({ value: g, label: g }))} error={errors.gender?.message} required {...register('gender')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Weight (kg)" placeholder="64 kg" leftIcon={<Weight className="w-4 h-4" />} error={errors.weight?.message} required {...register('weight')} />
                <Input label="Emergency Contact" placeholder="+1-555-9988" leftIcon={<Phone className="w-4 h-4" />} error={errors.emergencyContact?.message} required {...register('emergencyContact')} />
              </div>
              <Input label="Street Address" placeholder="120 Main Street" leftIcon={<MapPin className="w-4 h-4" />} error={errors.address?.message} required {...register('address')} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" placeholder="Metropolis" error={errors.city?.message} required {...register('city')} />
                <Input label="State" placeholder="NY" error={errors.state?.message} required {...register('state')} />
                <Input label="Pincode" placeholder="10001" error={errors.pincode?.message} required {...register('pincode')} />
              </div>
              <Textarea label="Medical History (Optional)" placeholder="Any past surgeries, conditions, or allergies..." rows={2} {...register('medicalHistory')} />
              <ToggleSwitch checked={isAvailable} onChange={setIsAvailable} label="Available for Emergency Alerts" description="Enable to receive real-time SMS & push alerts for nearby matching blood requests" />
            </div>
          )}

          {/* Hospital Fields */}
          {selectedRole === 'hospital' && (
            <div className="space-y-3">
              <Input label="Hospital Name" placeholder="Metro General Hospital" leftIcon={<Building2 className="w-4 h-4" />} error={errors.hospitalName?.message} required {...register('hospitalName')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select label="Hospital Type" options={HOSPITAL_TYPES.map(t => ({ value: t, label: t }))} error={errors.hospitalType?.message} required {...register('hospitalType')} />
                <Input label="Govt Registration #" placeholder="HOSP-REG-8812" error={errors.registrationNumber?.message} required {...register('registrationNumber')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Official Email" type="email" placeholder="emergency@metrogen.org" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} required {...register('email')} />
                <Input label="Phone Number" placeholder="+1-555-0199" leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} required {...register('phone')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Blood Bank License #" placeholder="LIC-BB-99120" error={errors.licenseNumber?.message} required {...register('licenseNumber')} />
                <Input label="Operating Hours" placeholder="24/7 Emergency" error={errors.operatingHours?.message} required {...register('operatingHours')} />
              </div>
              <Input label="Address" placeholder="120 Medical Center Drive" leftIcon={<MapPin className="w-4 h-4" />} error={errors.address?.message} required {...register('address')} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" placeholder="Metropolis" error={errors.city?.message} required {...register('city')} />
                <Input label="State" placeholder="NY" error={errors.state?.message} required {...register('state')} />
                <Input label="Pincode" placeholder="10001" error={errors.pincode?.message} required {...register('pincode')} />
              </div>
              <Input label="Emergency Contact Line" placeholder="+1-555-EMERGENCY" leftIcon={<Phone className="w-4 h-4" />} error={errors.emergencyContact?.message} required {...register('emergencyContact')} />
              <MedicalDocumentUploader label="Upload Blood Bank License Document" description="Upload PDF or Image copy of license for admin verification" />
            </div>
          )}

          {/* NGO Fields */}
          {selectedRole === 'ngo' && (
            <div className="space-y-3">
              <Input label="Organization Name" placeholder="Red Cross Community Foundation" leftIcon={<Users className="w-4 h-4" />} error={errors.organizationName?.message} required {...register('organizationName')} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select label="Organization Type" options={NGO_TYPES.map(t => ({ value: t, label: t }))} error={errors.organizationType?.message} required {...register('organizationType')} />
                <Input label="Registration #" placeholder="NGO-REG-4412" error={errors.registrationNumber?.message} required {...register('registrationNumber')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Official Email" type="email" placeholder="contact@redcross.org" leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} required {...register('email')} />
                <Input label="Phone Number" placeholder="+1-555-4400" leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} required {...register('phone')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Lead Coordinator Name" placeholder="David Miller" leftIcon={<User className="w-4 h-4" />} error={errors.coordinatorName?.message} required {...register('coordinatorName')} />
                <Input label="Coordinator Phone" placeholder="+1-555-4411" leftIcon={<Phone className="w-4 h-4" />} error={errors.coordinatorPhone?.message} required {...register('coordinatorPhone')} />
              </div>
              <Input label="Address" placeholder="45 Community Way" leftIcon={<MapPin className="w-4 h-4" />} error={errors.address?.message} required {...register('address')} />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" placeholder="Metropolis" error={errors.city?.message} required {...register('city')} />
                <Input label="State" placeholder="NY" error={errors.state?.message} required {...register('state')} />
                <Input label="Pincode" placeholder="10001" error={errors.pincode?.message} required {...register('pincode')} />
              </div>
              <MedicalDocumentUploader label="Upload NGO Registration Certificate" description="Upload PDF/Scan of NGO registration certificate" />
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Create password" leftIcon={<Lock className="w-4 h-4" />} error={errors.password?.message} required {...register('password')} />
            <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} placeholder="Repeat password" leftIcon={<Lock className="w-4 h-4" />} error={errors.confirmPassword?.message} required {...register('confirmPassword')} />
          </div>

          <label className="flex items-start gap-2 cursor-pointer pt-1">
            <input type="checkbox" {...register('terms')} className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              I agree to the <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
            Complete Registration as {selectedRole.toUpperCase()}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Sign in →
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupPage;

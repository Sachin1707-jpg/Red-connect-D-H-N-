import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Heart, Building2, Users, ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { loginUser, loginWithGoogle } from '../../redux/authSlice';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const ROLE_CONFIGS = {
  donor: {
    title: 'Donor',
    welcomeMsg: 'Welcome Donor',
    icon: Heart,
    desc: 'Donate blood and respond to nearby emergency blood requests.',
    btnLabel: 'Continue as Donor',
    accentColor: 'red',
    borderClass: 'border-red-500 ring-red-500/30 bg-red-50/50 dark:bg-red-950/30',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    gradientBtn: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/25',
    defaultEmail: 'sarah.j@example.com',
  },
  hospital: {
    title: 'Hospital / Blood Bank',
    welcomeMsg: 'Welcome Hospital',
    icon: Building2,
    desc: 'Manage blood inventory, create emergency blood requests, and coordinate with donors.',
    btnLabel: 'Continue as Hospital / Blood Bank',
    accentColor: 'blue',
    borderClass: 'border-blue-500 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    gradientBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25',
    defaultEmail: 'emergency@citygeneral.org',
  },
  ngo: {
    title: 'NGO / Community Organizer',
    welcomeMsg: 'Welcome NGO',
    icon: Users,
    desc: 'Organize donation camps, manage volunteers, and support emergency blood drives.',
    btnLabel: 'Continue as NGO / Community Organizer',
    accentColor: 'emerald',
    borderClass: 'border-emerald-500 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    gradientBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25',
    defaultEmail: 'contact@redcrosscommunity.org',
  },
  admin: {
    title: 'Administrator',
    welcomeMsg: 'Welcome Administrator',
    icon: ShieldCheck,
    desc: 'Manage users, hospitals, NGOs, reports, analytics, and platform operations.',
    btnLabel: 'Continue as Administrator',
    accentColor: 'purple',
    borderClass: 'border-purple-500 ring-purple-500/30 bg-purple-50/50 dark:bg-purple-950/30',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    gradientBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/25',
    defaultEmail: 'admin@redconnect.org',
  },
};

const ROLE_REDIRECT_MAP = {
  donor: '/dashboard',
  hospital: '/hospital/dashboard',
  ngo: '/ngo/dashboard',
  admin: '/admin/dashboard',
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const savedRole = localStorage.getItem('redconnect_selected_role') || 'donor';
  const [selectedRole, setSelectedRole] = useState(savedRole);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const activeConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.donor;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    localStorage.setItem('redconnect_selected_role', roleKey);
    const cfg = ROLE_CONFIGS[roleKey];
    setValue('email', cfg.defaultEmail);
    toast.success(`Role selected: ${cfg.title}`);
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pass.length < 10) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    const payload = { ...data, role: selectedRole };
    const result = await dispatch(loginUser(payload));

    if (result.meta.requestStatus === 'fulfilled') {
      const user = result.payload.user;
      toast.success(`🎉 ${activeConfig.welcomeMsg}! Logged in as ${user.name}`);
      const targetRoute = ROLE_REDIRECT_MAP[selectedRole] || '/dashboard';
      navigate(targetRoute);
    } else {
      toast.error(result.payload || 'Login failed. Please verify credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await dispatch(loginWithGoogle(selectedRole));
    if (result.meta.requestStatus === 'fulfilled') {
      const user = result.payload.user;
      toast.success(`🎉 ${activeConfig.welcomeMsg}! Logged in as ${user.name}`);
      const targetRoute = ROLE_REDIRECT_MAP[selectedRole] || '/dashboard';
      navigate(targetRoute);
    } else {
      toast.error(result.payload || 'Google Login failed. Please verify configuration.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>Welcome Back</span>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Choose how you want to sign in
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(ROLE_CONFIGS).map(([key, config]) => {
          const isSelected = selectedRole === key;
          const Icon = config.icon;
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(key)}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? `${config.borderClass} ring-4 shadow-lg`
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? config.badgeClass : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {config.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {config.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className={`text-xs font-bold flex items-center justify-between ${
                  isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}>
                  {config.btnLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Welcome Accent Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRole}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`p-3.5 rounded-2xl border ${activeConfig.borderClass} flex items-center justify-between`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${activeConfig.badgeClass}`}>
              <activeConfig.icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {activeConfig.welcomeMsg}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            Role: <span className="capitalize text-slate-900 dark:text-white">{selectedRole}</span>
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <div className="space-y-1">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              required
              {...register('password', {
                onChange: (e) => setPasswordValue(e.target.value)
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwordValue && (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'} flex-1 transition-all`} />
                <div className={`h-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'} flex-1 transition-all`} />
                <div className={`h-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'} flex-1 transition-all`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{passwordStrength.label}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-slate-600 dark:text-slate-300">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-primary font-bold hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={loading}
          className={`w-full shadow-lg ${activeConfig.gradientBtn}`}
        >
          Sign In as {activeConfig.title}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-semibold tracking-wide">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-bold hover:underline">
          Register new account →
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;

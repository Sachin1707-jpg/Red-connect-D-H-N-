import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bell, Menu, Sun, Moon, LogOut, User, Settings, Award,
  ChevronDown, Heart, Search, Command, X
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { toggleDarkMode, toggleSidebar, setCommandPaletteOpen } from '../../redux/themeSlice';
import { logoutUser } from '../../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ isPublic = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.theme);
  const notifications = useSelector((s) => s.notifications.items);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Emergency Requests', to: '/requests' },
    { label: 'Blood Banks', to: '/blood-banks' },
    { label: 'Donation Camps', to: '/camps' },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-700/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo + Sidebar Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2.5 font-black text-xl text-primary select-none">
              <div className="p-1.5 bg-gradient-to-br from-red-600 to-rose-500 rounded-xl shadow-md shadow-red-500/30">
                <Heart className="w-5 h-5 text-white fill-white animate-heart-pulse" />
              </div>
              <span className="font-black tracking-tight text-slate-900 dark:text-white">Red<span className="text-primary">Connect</span></span>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Command Palette */}
            {isAuthenticated && (
              <button
                onClick={() => dispatch(setCommandPaletteOpen(true))}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium hover:border-primary/50 hover:text-primary transition-all duration-200"
                title="Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Quick Nav</span>
                <kbd className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">Ctrl K</kbd>
              </button>
            )}

            {/* Dark Mode */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  aria-label={`Notifications (${unreadCount} unread)`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</span>
                        {unreadCount > 0 && <Badge variant="danger" size="sm">{unreadCount} new</Badge>}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                        {notifications.slice(0, 4).map((n) => (
                          <div key={n.id} className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors ${!n.read ? 'bg-red-50/60 dark:bg-red-950/20' : ''}`}>
                            <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>{n.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.timestamp}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-100 dark:border-slate-700/60">
                        <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block text-xs text-primary font-semibold text-center hover:underline">
                          View All Notifications →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Avatar / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="sm" bloodGroup={user?.bloodGroup} />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                    >
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-700/60">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      {[
                        { icon: <User className="w-4 h-4" />, label: 'My Profile', to: '/profile' },
                        { icon: <Award className="w-4 h-4" />, label: 'Rewards', to: '/rewards' },
                        { icon: <Settings className="w-4 h-4" />, label: 'Settings', to: '/settings' },
                      ].map((item) => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="text-slate-400">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 dark:border-slate-700/60 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-bold bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

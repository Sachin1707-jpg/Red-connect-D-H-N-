import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, MapPin, Droplets, History, Award,
  Bell, User, Settings, LogOut, ChevronLeft, ChevronRight,
  Heart, Building2, HeartHandshake, ShieldCheck, BarChart3, Map,
  X, Calendar, MessageSquare, FileText
} from 'lucide-react';
import { toggleSidebar } from '../../redux/themeSlice';
import { logoutUser } from '../../redux/authSlice';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const collapsed = useSelector((s) => s.theme.sidebarCollapsed);
  const { user } = useSelector((s) => s.auth);
  const notifications = useSelector((s) => s.notifications.items);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const getNavItems = () => {
    const role = user?.role || 'donor';

    if (role === 'hospital') {
      return [
        { label: 'Hospital Dashboard',  to: '/hospital/dashboard', icon: Building2 },
        { label: 'Blood Inventory',     to: '/hospital/inventory', icon: Droplets },
        { label: 'Donor Responses',     to: '/hospital/donors',    icon: User },
        { label: 'Emergency Cases',     to: '/hospital/emergency', icon: Droplets },
        { label: 'Blood Requests',      to: '/requests', icon: Droplets },
        { label: 'Maps',                to: '/maps',               icon: Map },
        { label: 'Analytics',           to: '/analytics',          icon: BarChart3 },
        { label: 'Calendar',            to: '/calendar',           icon: Calendar },
        { label: 'Chat',                to: '/chat',               icon: MessageSquare },
        { label: 'Reports',             to: '/reports',            icon: FileText },
        { label: 'Notifications',       to: '/notifications',      icon: Bell },
        { label: 'Settings',            to: '/settings',           icon: Settings },
      ];
    }

    if (role === 'ngo') {
      return [
        { label: 'NGO Dashboard',       to: '/ngo/dashboard',      icon: HeartHandshake },
        { label: 'Donation Camps',      to: '/ngo/camps',          icon: HeartHandshake },
        { label: 'Volunteers',          to: '/ngo/volunteers',     icon: User },
        { label: 'Shortage Monitor',    to: '/ngo/shortages',      icon: Droplets },
        { label: 'Blood Requests',      to: '/requests', icon: Droplets },
        { label: 'Maps',                to: '/maps',               icon: Map },
        { label: 'Calendar',            to: '/calendar',           icon: Calendar },
        { label: 'Chat',                to: '/chat',               icon: MessageSquare },
        { label: 'Notifications',       to: '/notifications',      icon: Bell },
        { label: 'Settings',            to: '/settings',           icon: Settings },
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Admin Dashboard',     to: '/admin/dashboard',    icon: ShieldCheck },
        { label: 'User Management',     to: '/admin/users',        icon: User },
        { label: 'Hospital Approvals',  to: '/admin/hospitals',    icon: Building2 },
        { label: 'NGO Approvals',       to: '/admin/ngos',         icon: HeartHandshake },
        { label: 'Audit Logs',          to: '/admin/activity',     icon: FileText },
        { label: 'Blood Requests',      to: '/requests', icon: Droplets },
        { label: 'Analytics',           to: '/analytics',          icon: BarChart3 },
        { label: 'Reports',             to: '/reports',            icon: FileText },
        { label: 'Maps',                to: '/maps',               icon: Map },
        { label: 'Chat',                to: '/chat',               icon: MessageSquare },
        { label: 'Notifications',       to: '/notifications',      icon: Bell },
        { label: 'Settings',            to: '/settings',           icon: Settings },
      ];
    }

    // Default Donor Portal
    return [
      { label: 'Donor Dashboard',     to: '/dashboard',           icon: LayoutDashboard },
      { label: 'Nearby Requests',     to: '/nearby-requests',     icon: MapPin },
      { label: 'Blood Requests',      to: '/requests',  icon: Droplets },
      { label: 'Blood Banks',         to: '/blood-banks',         icon: Building2 },
      { label: 'Donation Camps',      to: '/camps',      icon: HeartHandshake },
      { label: 'Maps',                to: '/maps',                icon: Map },
      { label: 'Donation History',    to: '/history',             icon: History },
      { label: 'Rewards',             to: '/rewards',             icon: Award },
      { label: 'Calendar',            to: '/calendar',            icon: Calendar },
      { label: 'Chat',                to: '/chat',                icon: MessageSquare },
      { label: 'Notifications',       to: '/notifications',       icon: Bell },
      { label: 'Profile',             to: '/profile',             icon: User },
      { label: 'Settings',            to: '/settings',            icon: Settings },
    ];
  };

  const navItems = getNavItems();

  // On mobile: sidebar is a drawer (off-screen when collapsed, on-screen when open)
  // On desktop (lg+): sidebar is always visible, either full (w-64) or icon-only (w-16)
  const sidebarClasses = collapsed
    ? '-translate-x-full lg:translate-x-0 lg:w-16'  // mobile: hidden | desktop: icon strip
    : 'translate-x-0 w-64';                           // mobile: full drawer | desktop: full

  return (
    <>
      {/* Mobile backdrop overlay — clicking it closes the sidebar */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full flex flex-col
        bg-slate-900 dark:bg-slate-950 text-white
        border-r border-slate-800 shadow-2xl
        transition-all duration-300 ease-in-out
        ${sidebarClasses}
      `}>
        {/* Header */}
        <div className={`flex items-center h-16 border-b border-slate-800 px-4 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 font-black text-lg text-white">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span>Red<span className="text-red-400">Connect</span></span>
            </Link>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Profile Card */}
        {!collapsed && user && (
          <div className="p-4 border-b border-slate-800/60 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
              <Avatar src={user.avatar} name={user.name} size="md" bloodGroup={user.bloodGroup} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role} Portal</p>
                <Badge variant={user.isAvailable ? 'success' : 'warning'} size="sm" className="mt-1">
                  {user.isAvailable ? 'Available' : 'On Break'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                // On mobile, close sidebar when a nav item is clicked
                if (window.innerWidth < 1024 && !collapsed) {
                  dispatch(toggleSidebar());
                }
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
              title={collapsed ? label : undefined}
            >
              <div className="relative shrink-0">
                <Icon className="w-5 h-5" />
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-600/15 hover:text-red-400 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

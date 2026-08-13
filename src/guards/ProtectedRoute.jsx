import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from '../components/common/Loader';

const ROLE_DASHBOARD_MAP = {
  hospital: '/hospital/dashboard',
  ngo: '/ngo/dashboard',
  admin: '/admin/dashboard',
  donor: '/dashboard',
};

export const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader text="Validating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If an authenticated user hits /dashboard but their role is not 'donor',
  // silently redirect them to the correct portal
  if (location.pathname === '/dashboard' && user?.role && user.role !== 'donor') {
    const targetDashboard = ROLE_DASHBOARD_MAP[user.role];
    if (targetDashboard) return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};

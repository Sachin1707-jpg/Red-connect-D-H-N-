import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ROLE_DASHBOARD_MAP = {
  hospital: '/hospital/dashboard',
  ngo: '/ngo/dashboard',
  admin: '/admin/dashboard',
  donor: '/dashboard',
};

export const GuestRoute = () => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  if (isAuthenticated && user) {
    const targetDashboard = ROLE_DASHBOARD_MAP[user.role] || '/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};

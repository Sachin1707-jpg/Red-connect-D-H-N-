import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ForbiddenPage from '../pages/errors/ForbiddenPage';

export const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useSelector((s) => s.auth);
  const userRole = user?.role || 'donor';

  if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
    return <ForbiddenPage />;
  }

  return <Outlet />;
};

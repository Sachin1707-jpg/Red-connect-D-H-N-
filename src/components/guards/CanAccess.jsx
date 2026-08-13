import React from 'react';
import { usePermissions } from '../../context/PermissionContext';

export const CanAccess = ({ permission, role, children, fallback = null }) => {
  const { can, hasRole } = usePermissions();

  if (permission && !can(permission)) return fallback;
  if (role && !hasRole(role)) return fallback;

  return <>{children}</>;
};

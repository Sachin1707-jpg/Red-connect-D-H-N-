import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const PermissionContext = createContext();

export const ROLE_PERMISSIONS = {
  admin: [
    'create_request', 'manage_inventory', 'manage_camps', 'manage_volunteers',
    'view_analytics', 'manage_users', 'approve_hospitals', 'approve_ngos',
    'moderate_content', 'view_audit_logs', 'export_reports'
  ],
  hospital: [
    'create_request', 'manage_inventory', 'accept_pledges', 'view_analytics',
    'upload_verification', 'view_nearby_donors'
  ],
  ngo: [
    'manage_camps', 'manage_volunteers', 'monitor_shortages', 'send_support',
    'view_nearby_hospitals'
  ],
  donor: [
    'pledge_blood', 'update_profile', 'view_history', 'redeem_rewards',
    'view_nearby_requests'
  ]
};

export const PermissionProvider = ({ children }) => {
  const user = useSelector((s) => s.auth.user);
  const userRole = user?.role || 'donor';
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  const can = (permission) => permissions.includes(permission) || userRole === 'admin';
  const hasRole = (role) => Array.isArray(role) ? role.includes(userRole) : userRole === role;

  return (
    <PermissionContext.Provider value={{ userRole, permissions, can, hasRole }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

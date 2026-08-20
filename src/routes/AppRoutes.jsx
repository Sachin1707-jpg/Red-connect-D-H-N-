import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Loader } from '../components/common/Loader';
import { PermissionProvider } from '../context/PermissionContext';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { RoleProtectedRoute } from '../guards/RoleProtectedRoute';
import { GuestRoute } from '../guards/GuestRoute';
import { useSelector } from 'react-redux';

// Lazy-loaded pages
const LandingPage           = lazy(() => import('../pages/landing/LandingPage'));
const AboutPage             = lazy(() => import('../pages/landing/AboutPage'));
const HowItWorksPage        = lazy(() => import('../pages/landing/HowItWorksPage'));
const EmergencyRequestsPage = lazy(() => import('../pages/requests/EmergencyRequestsPage'));
const NearbyRequestsPage    = lazy(() => import('../pages/requests/NearbyRequestsPage'));
const BloodBanksPage        = lazy(() => import('../pages/requests/BloodBanksPage'));
const CampsPage             = lazy(() => import('../pages/requests/CampsPage'));
const GlobalSearchPage      = lazy(() => import('../pages/search/GlobalSearchPage'));

const LoginPage  = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));

// Portals
const DonorDashboard         = lazy(() => import('../pages/dashboard/DonorDashboard'));
const DonorProfilePage       = lazy(() => import('../pages/profile/DonorProfilePage'));
const AdvancedMedicalProfilePage = lazy(() => import('../pages/profile/AdvancedMedicalProfilePage'));
const DonationHistoryPage    = lazy(() => import('../pages/dashboard/DonationHistoryPage'));
const RewardsPage            = lazy(() => import('../pages/rewards/RewardsPage'));
const NotificationsPage      = lazy(() => import('../pages/notifications/NotificationsPage'));
const SettingsPage           = lazy(() => import('../pages/settings/SettingsPage'));

const HospitalDashboard      = lazy(() => import('../pages/hospital/HospitalDashboard'));
const CreateBloodRequestPage = lazy(() => import('../pages/hospital/CreateBloodRequestPage'));
const HospitalInventory      = lazy(() => import('../pages/hospital/HospitalInventory'));
const DonorResponses         = lazy(() => import('../pages/hospital/DonorResponses'));
const HospitalEmergencyCases = lazy(() => import('../pages/hospital/HospitalEmergencyCases'));
const HospitalProfile        = lazy(() => import('../pages/hospital/HospitalProfile'));

const NgoDashboard           = lazy(() => import('../pages/ngo/NgoDashboard'));
const DonationCampManagement = lazy(() => import('../pages/ngo/DonationCampManagement'));
const VolunteerManagement    = lazy(() => import('../pages/ngo/VolunteerManagement'));
const BloodShortageMonitor   = lazy(() => import('../pages/ngo/BloodShortageMonitor'));

const AdminDashboard         = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement         = lazy(() => import('../pages/admin/UserManagement'));
const HospitalApproval       = lazy(() => import('../pages/admin/HospitalApproval'));
const NgoApproval            = lazy(() => import('../pages/admin/NgoApproval'));
const RequestVerificationPage= lazy(() => import('../pages/admin/RequestVerificationPage'));
const AuditLogsPage          = lazy(() => import('../pages/admin/AuditLogsPage'));

// Advanced Modules
const InteractiveMapsPage   = lazy(() => import('../pages/maps/InteractiveMapsPage'));
const AdvancedAnalyticsPage = lazy(() => import('../pages/analytics/AdvancedAnalyticsPage'));
const CalendarPage          = lazy(() => import('../pages/calendar/CalendarPage'));
const ChatPage              = lazy(() => import('../pages/chat/ChatPage'));
const CallPage              = lazy(() => import('../pages/call/CallPage'));
const ReportCenterPage      = lazy(() => import('../pages/reports/ReportCenterPage'));
const UserDetailsPage       = lazy(() => import('../pages/users/UserDetailsPage'));
const HospitalDetailsPage   = lazy(() => import('../pages/hospital/HospitalDetailsPage'));
const NgoDetailsPage        = lazy(() => import('../pages/ngo/NgoDetailsPage'));

// Error Pages
const UnauthorizedPage = lazy(() => import('../pages/errors/UnauthorizedPage'));
const ForbiddenPage    = lazy(() => import('../pages/errors/ForbiddenPage'));
const ServerErrorPage  = lazy(() => import('../pages/errors/ServerErrorPage'));
const NotFoundPage     = lazy(() => import('../pages/NotFoundPage'));

const SuspenseFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader text="Loading RedConnect..." />
  </div>
);

const W = (Component) => (
  <Suspense fallback={<SuspenseFallback />}><Component /></Suspense>
);

const AuthAwareLayout = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? <DashboardLayout /> : <PublicLayout />;
};

const router = createBrowserRouter([
  // Public
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true,         element: W(LandingPage) },
      { path: 'about',       element: W(AboutPage) },
      { path: 'how-it-works',element: W(HowItWorksPage) },
    ],
  },
  // Shared (Auth Aware)
  {
    path: '/',
    element: <AuthAwareLayout />,
    children: [
      { path: 'requests',    element: W(EmergencyRequestsPage) },
      { path: 'blood-banks', element: W(BloodBanksPage) },
      { path: 'camps',       element: W(CampsPage) },
      { path: 'search',      element: W(GlobalSearchPage) },
    ],
  },
  // Auth (Guest Protected)
  {
    path: '/',
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login',  element: W(LoginPage) },
          { path: 'signup', element: W(SignupPage) },
        ],
      },
    ],
  },
  // Protected Dashboard Routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard',          element: W(DonorDashboard) },
          { path: 'nearby-requests',    element: W(NearbyRequestsPage) },
          { path: 'profile',            element: W(DonorProfilePage) },
          { path: 'profile/medical',    element: W(AdvancedMedicalProfilePage) },
          { path: 'history',            element: W(DonationHistoryPage) },
          { path: 'rewards',            element: W(RewardsPage) },
          { path: 'notifications',      element: W(NotificationsPage) },
          { path: 'settings',           element: W(SettingsPage) },

          // Hospital
          { path: 'hospital/dashboard', element: W(HospitalDashboard) },
          { path: 'hospital/create-request', element: W(CreateBloodRequestPage) },
          { path: 'hospital/inventory', element: W(HospitalInventory) },
          { path: 'hospital/donors',    element: W(DonorResponses) },
          { path: 'hospital/emergency', element: W(HospitalEmergencyCases) },
          { path: 'hospital/profile',   element: W(HospitalProfile) },

          // NGO
          { path: 'ngo/dashboard',  element: W(NgoDashboard) },
          { path: 'ngo/camps',      element: W(DonationCampManagement) },
          { path: 'ngo/volunteers', element: W(VolunteerManagement) },
          { path: 'ngo/shortages',  element: W(BloodShortageMonitor) },

          // Admin
          { path: 'admin/dashboard', element: W(AdminDashboard) },
          { path: 'admin/users',     element: W(UserManagement) },
          { path: 'admin/hospitals', element: W(HospitalApproval) },
          { path: 'admin/ngos',      element: W(NgoApproval) },
          { path: 'admin/requests',  element: W(RequestVerificationPage) },
          { path: 'admin/activity',  element: W(AuditLogsPage) },

          // Advanced Modules
          { path: 'maps',            element: W(InteractiveMapsPage) },
          { path: 'analytics',       element: W(AdvancedAnalyticsPage) },
          { path: 'calendar',        element: W(CalendarPage) },
          { path: 'chat',            element: W(ChatPage) },
          { path: 'call',            element: W(CallPage) },
          { path: 'reports',         element: W(ReportCenterPage) },
          { path: 'users/:id',       element: W(UserDetailsPage) },
          { path: 'hospital/:id',    element: W(HospitalDetailsPage) },
          { path: 'ngo/:id',         element: W(NgoDetailsPage) },
        ],
      },
    ],
  },
  // Error Pages
  { path: 'unauthorized', element: W(UnauthorizedPage) },
  { path: 'forbidden',    element: W(ForbiddenPage) },
  { path: '500',          element: W(ServerErrorPage) },
  { path: '*',            element: W(NotFoundPage) },
]);

export const AppRoutes = () => (
  <PermissionProvider>
    <RouterProvider router={router} />
  </PermissionProvider>
);

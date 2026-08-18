import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { FloatingEmergencyButton } from '../components/ui/FloatingEmergencyButton';
import { BackToTop } from '../components/ui/BackToTop';
import { CommandPalette } from '../components/ui/CommandPalette';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { FirstVisitWelcomeModal } from '../components/common/FirstVisitWelcomeModal';
import { EmergencyNotificationBanner } from '../components/ui/EmergencyNotificationBanner';
import { Toaster } from 'react-hot-toast';

export const DashboardLayout = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const collapsed = useSelector((s) => s.theme.sidebarCollapsed);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />

      {/* Main content — on mobile always full width; on lg+ offset by sidebar width */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <Navbar />
        <main id="main-content" className="flex-1 p-4 sm:p-6 max-w-full overflow-x-hidden">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>

      <FirstVisitWelcomeModal />
      <EmergencyNotificationBanner />
      <FloatingEmergencyButton />
      <BackToTop />
      <CommandPalette />
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white text-sm font-medium',
        duration: 4000,
      }} />
    </div>
  );
};


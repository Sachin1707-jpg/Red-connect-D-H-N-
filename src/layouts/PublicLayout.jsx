import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BackToTop } from '../components/ui/BackToTop';
import { CommandPalette } from '../components/ui/CommandPalette';
import { Toaster } from 'react-hot-toast';

export const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
    <Navbar isPublic={true} />
    <main id="main-content" className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <BackToTop />
    <CommandPalette />
    <Toaster position="top-right" toastOptions={{
      className: 'dark:bg-slate-800 dark:text-white text-sm font-medium',
      duration: 4000,
    }} />
  </div>
);

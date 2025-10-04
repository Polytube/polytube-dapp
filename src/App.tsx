import React, { JSX, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

// Lazy load heavy route components to reduce initial bundle size and memory usage
const HomePage = lazy(() => import('@/components/HomePage'));
const AdminPage = lazy(() => import('@/components/AdminPage'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App(): JSX.Element {
  const location = useLocation();

  return (
    <div id="app-container" className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="app-main" className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingFallback />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage adminAddresses={["Cgkg49NwM9S5vAowZEfnCHR6K3P4brE6brbzJM5eRX2q"]} />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      <Toaster />
    </div>
  );
}

export default App;

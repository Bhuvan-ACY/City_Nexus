import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { IncidentTicker } from '../../features/dashboard/IncidentTicker';
import { useCityNexusStore } from '../../stores/useCityNexusStore';

export const AppLayout: React.FC = () => {
  const { initializeBackendSync } = useCityNexusStore();

  React.useEffect(() => {
    initializeBackendSync();
  }, [initializeBackendSync]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0b0f17] text-[#222222] dark:text-[#f3f4f6] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fafafa] dark:bg-[#0b0f17] relative">
        <Topbar />
        <IncidentTicker />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-6 bg-[#fafafa] dark:bg-[#0b0f17]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

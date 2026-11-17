import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { IncidentTicker } from '../../features/dashboard/IncidentTicker';
import { useCityNexusStore } from '../../stores/useCityNexusStore';

export const AppLayout: React.FC = () => {
  const { initializeBackendSync } = useCityNexusStore();

  useEffect(() => {
    initializeBackendSync();
  }, [initializeBackendSync]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <IncidentTicker />
        <main className="flex-1 overflow-y-auto p-6 bg-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

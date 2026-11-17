import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { UserRole } from '../../types/domain.types';
import { Radio, CloudSun, User, Shield, Sun, Moon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { 
    weather, 
    isLiveStreaming, 
    toggleLiveStreaming, 
    currentUserRole, 
    setCurrentUserRole,
    isBackendConnected,
    theme,
    toggleTheme,
    toggleMobileSidebar
  } = useCityNexusStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUserRole(e.target.value as UserRole);
  };

  return (
    <header className="h-16 border-b border-[#cfd9de] dark:border-slate-800 bg-white dark:bg-[#111827] px-4 sm:px-6 flex items-center justify-between shrink-0 select-none transition-colors gap-3">
      {/* Left: Mobile Menu Toggle + Weather and Telemetry Capsule */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {/* Hamburger Menu Toggle on Mobile/Tablet */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg border border-[#cfd9de] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#222222] dark:text-slate-100 hover:bg-[#e8e8e8]/60 dark:hover:bg-slate-700 shrink-0 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Weather capsule */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 rounded-lg bg-[#e8e8e8]/70 dark:bg-slate-800/80 border border-[#cfd9de] dark:border-slate-700 text-xs sm:text-sm font-mono text-[#222222] dark:text-slate-100 shrink-0">
          <CloudSun className="w-4 h-4 text-[#444444] dark:text-slate-400 shrink-0" />
          <span className="hidden xs:inline">{weather.city}:</span>
          <span className="font-bold">{weather.temperature}°C</span>
          <span className="text-[#71767b] dark:text-slate-400 hidden md:inline">| {weather.condition}</span>
        </div>

        {/* Live Stream Pulse */}
        <button
          onClick={toggleLiveStreaming}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#cfd9de] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-700 text-xs sm:text-sm transition-colors shrink-0"
        >
          <Radio className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiveStreaming ? 'text-emerald-500 animate-pulse' : 'text-[#909090] dark:text-slate-500'}`} />
          <span className="text-xs font-semibold text-[#444444] dark:text-slate-200">
            {isLiveStreaming ? 'SCADA LIVE' : 'PAUSED'}
          </span>
        </button>

        {/* BaaS Sync Indicator */}
        <span className="hidden xl:inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono border border-[#cfd9de] dark:border-slate-700 bg-[#fafafa] dark:bg-slate-800/60 text-[#444444] dark:text-slate-300 shrink-0">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {isBackendConnected ? 'SUPABASE CLOUD' : 'LOCAL CACHE'}
        </span>
      </div>

      {/* Right: Theme Toggle, Role Switcher & Profile Link */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 rounded-lg border border-[#cfd9de] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#e8e8e8]/60 dark:hover:bg-slate-700 text-[#222222] dark:text-slate-100 text-xs font-semibold transition-all shadow-sm shrink-0"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden md:inline text-xs">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
              <span className="hidden md:inline text-xs">Dark</span>
            </>
          )}
        </button>

        {/* Role Selector Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#fafafa] dark:bg-slate-800/80 border border-[#cfd9de] dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1.5 shrink-0">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#444444] dark:text-slate-400 shrink-0" />
          <span className="text-xs text-[#71767b] dark:text-slate-400 font-semibold uppercase tracking-wider hidden lg:inline">Role:</span>
          <select
            value={currentUserRole}
            onChange={handleRoleChange}
            aria-label="Active Operator Role"
            className="bg-transparent text-xs sm:text-sm font-semibold text-[#222222] dark:text-slate-100 border-none outline-none cursor-pointer max-w-[110px] sm:max-w-none"
          >
            <option value="city_planner" className="dark:bg-slate-800 dark:text-slate-100">City Planner</option>
            <option value="traffic_controller" className="dark:bg-slate-800 dark:text-slate-100">Traffic Controller</option>
            <option value="grid_operator" className="dark:bg-slate-800 dark:text-slate-100">Grid Operator</option>
            <option value="utility_manager" className="dark:bg-slate-800 dark:text-slate-100">Utility Manager</option>
            <option value="admin" className="dark:bg-slate-800 dark:text-slate-100">System Admin</option>
          </select>
        </div>

        {/* User Profile Capsule */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 rounded-lg border border-[#cfd9de] dark:border-slate-700 hover:border-[#444444] dark:hover:border-slate-400 transition-colors shrink-0"
          title="View Operator Profile"
        >
          <div className="w-7 h-7 rounded-md bg-[#222222] dark:bg-slate-700 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-[#222222] dark:text-slate-100 pr-1 hidden lg:inline">Dr. Arjun Rao</span>
        </Link>
      </div>
    </header>
  );
};

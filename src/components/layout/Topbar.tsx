import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { UserRole } from '../../types/domain.types';
import { Radio, CloudSun, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { 
    weather, 
    isLiveStreaming, 
    toggleLiveStreaming, 
    currentUserRole, 
    setCurrentUserRole,
    isBackendConnected
  } = useCityNexusStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUserRole(e.target.value as UserRole);
  };

  return (
    <header className="h-14 border-b border-[#cfd9de] bg-white px-6 flex items-center justify-between shrink-0 select-none">
      {/* Left: Weather and Telemetry Capsule */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#e8e8e8]/70 border border-[#cfd9de] text-xs font-mono text-[#222222]">
          <CloudSun className="w-3.5 h-3.5 text-[#444444]" />
          <span>{weather.city}:</span>
          <span className="font-bold">{weather.temperature}°C</span>
          <span className="text-[#71767b]">| {weather.condition}</span>
        </div>

        {/* Live Stream Pulse */}
        <button
          onClick={toggleLiveStreaming}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#cfd9de] bg-white hover:bg-[#e8e8e8]/50 text-xs transition-colors"
        >
          <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-[#222222] animate-pulse' : 'text-[#909090]'}`} />
          <span className="text-[11px] font-medium text-[#444444]">
            {isLiveStreaming ? 'LIVE SCADA STREAM' : 'PAUSED'}
          </span>
        </button>

        {/* BaaS Sync Indicator */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border border-[#cfd9de] bg-[#fafafa] text-[#444444]">
          <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-[#222222]' : 'bg-[#71767b]'}`} />
          {isBackendConnected ? 'SUPABASE CLOUD' : 'LOCAL CACHE'}
        </span>
      </div>

      {/* Right: Role Switcher & Profile Link */}
      <div className="flex items-center gap-4">
        {/* Role Selector Pill */}
        <div className="flex items-center gap-2 bg-[#fafafa] border border-[#cfd9de] rounded-lg px-2.5 py-1">
          <Shield className="w-3.5 h-3.5 text-[#444444]" />
          <span className="text-[11px] text-[#71767b] font-medium uppercase tracking-wider">Role:</span>
          <select
            value={currentUserRole}
            onChange={handleRoleChange}
            aria-label="Active Operator Role"
            className="bg-transparent text-xs font-semibold text-[#222222] border-none outline-none cursor-pointer pr-1"
          >
            <option value="city_planner">City Planner</option>
            <option value="traffic_controller">Traffic Controller</option>
            <option value="grid_operator">Grid Operator</option>
            <option value="utility_manager">Utility Manager</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>

        {/* User Profile Capsule */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 rounded-lg border border-[#cfd9de] hover:border-[#444444] transition-colors"
          title="View Operator Profile"
        >
          <div className="w-6 h-6 rounded-md bg-[#222222] flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-[#222222] pr-1 hidden sm:inline">Dr. Arjun Rao</span>
        </Link>
      </div>
    </header>
  );
};

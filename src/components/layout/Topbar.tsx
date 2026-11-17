import React from 'react';
import { Cloud, Wind, Thermometer, Radio, Shield, LogOut } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { weather, isLiveStreaming, toggleLiveStreaming, currentUser, setUserRole } = useCityNexusStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-hairline bg-surface-1/90 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
      {/* City & Live Status */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <span>{weather.city}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-status-normal"></span>
          </h2>
          <p className="text-[11px] text-ink-muted">Metropolitan Sensor Array Live Feed</p>
        </div>

        {/* Live sync toggle button */}
        <button
          onClick={toggleLiveStreaming}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
            isLiveStreaming
              ? 'bg-status-normal/10 text-status-normal border-status-normal/30'
              : 'bg-surface-2 text-ink-muted border-hairline'
          }`}
          title="Toggle live telemetry streaming"
        >
          <Radio className={`w-3 h-3 ${isLiveStreaming ? 'animate-pulse' : ''}`} />
          <span>{isLiveStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}</span>
        </button>
      </div>

      {/* Weather telemetry & Role Selector */}
      <div className="flex items-center gap-6">
        {/* Weather capsule */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-ink-muted border-x border-hairline px-4">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-domain-electricityLight" />
            <span className="font-semibold text-ink">{weather.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-domain-utilitiesLight" />
            <span>{weather.condition}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-domain-trafficLight" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Role switcher for evaluation testing */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-ink-muted" />
          <select
            value={currentUser.role}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="bg-surface-2 border border-hairline text-xs font-medium text-ink rounded-md px-2 py-1 outline-none focus:border-domain-traffic"
            title="Switch User Role to evaluate RBAC"
          >
            <option value="operations_manager">Role: Operations Manager</option>
            <option value="urban_planner">Role: Urban Planner</option>
            <option value="emergency_coordinator">Role: Emergency Coordinator</option>
            <option value="admin">Role: System Administrator</option>
          </select>
        </div>

        {/* Exit / Logout */}
        <button
          onClick={() => navigate('/')}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-2 rounded-md transition-colors"
          title="Return to Public Landing Page"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

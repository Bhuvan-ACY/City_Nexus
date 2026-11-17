import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Share2, 
  Compass, 
  Sliders, 
  Bell, 
  Clock, 
  Settings, 
  Car,
  Zap,
  Droplet
} from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { alerts } = useCityNexusStore();
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const mainNav = [
    { name: 'Dashboard', to: '/dashboard', icon: Activity },
    { name: 'Traffic Detail', to: '/dashboard/traffic', icon: Car },
    { name: 'Electricity Detail', to: '/dashboard/electricity', icon: Zap },
    { name: 'Utilities Detail', to: '/dashboard/utilities', icon: Droplet },
    { name: 'Dependencies', to: '/dependencies', icon: Share2 },
    { name: 'Geospatial Map', to: '/map', icon: Compass },
    { name: 'Simulation', to: '/simulation', icon: Sliders },
    { 
      name: 'Alert Center', 
      to: '/alerts', 
      icon: Bell, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined 
    },
    { name: 'Historical', to: '/history', icon: Clock },
  ];

  const adminNav = [
    { name: 'User Management', to: '/admin/users', icon: Settings },
    { name: 'System Config', to: '/admin/config', icon: Sliders },
  ];

  return (
    <aside className="w-64 border-r border-[#cfd9de] bg-white flex flex-col h-screen select-none shrink-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#cfd9de] gap-3 py-3">
        <div className="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center font-bold text-white shrink-0">
          <Activity className="h-4 w-4 text-white stroke-[2.5]" />
        </div>
        <div>
          <span className="font-bold tracking-tight text-[#222222] text-base block leading-none font-sans">
            CityNexus
          </span>
          <span className="text-[11px] text-[#71767b] font-medium tracking-wide">Infrastructure Intelligence</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-semibold tracking-wider text-[#71767b] uppercase mb-2">Command Center</p>
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group',
                    isActive
                      ? 'bg-[#222222] text-white shadow-sm'
                      : 'text-[#444444] hover:bg-[#e8e8e8]/60 hover:text-[#222222]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <item.icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-white' : 'text-[#71767b] group-hover:text-[#222222]'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold leading-none',
                          isActive ? 'bg-white text-[#222222]' : 'bg-[#e8e8e8] text-[#222222]'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Administration Section */}
        <div>
          <p className="px-3 text-[10px] font-semibold tracking-wider text-[#71767b] uppercase mb-2">Governance</p>
          <div className="space-y-1">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group',
                    isActive
                      ? 'bg-[#222222] text-white shadow-sm'
                      : 'text-[#444444] hover:bg-[#e8e8e8]/60 hover:text-[#222222]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-white' : 'text-[#71767b] group-hover:text-[#222222]'
                      )}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#cfd9de] text-xs text-[#71767b] flex items-center justify-between">
        <span className="font-mono text-[10px]">v1.0 • System Ready</span>
        <span className="h-2 w-2 rounded-full bg-[#222222]" />
      </div>
    </aside>
  );
};

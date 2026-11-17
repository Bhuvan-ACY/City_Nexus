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
  const { alerts, currentUser } = useCityNexusStore();
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
    <aside className="w-64 border-r border-hairline bg-surface-1 flex flex-col h-screen select-none shrink-0">
      {/* Brand Logo */}
      <div className="h-18 flex items-center px-6 border-b border-hairline gap-3.5 py-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25 shrink-0">
          <Activity className="h-6 w-6 text-white stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold tracking-tight text-white text-xl block leading-none font-sans">
            City<span className="text-blue-500">Nexus</span>
          </span>
          <span className="text-[11px] text-neutral-400 font-medium tracking-wide">Infrastructure Intelligence</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-ink-muted uppercase mb-2">Command Center</p>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-surface-2 text-ink border border-hairline shadow-sm'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-2/50'
                  )
                }
              >
                <item.icon className="w-4 h-4 text-ink-muted group-hover:text-ink transition-colors" />
                <span className="flex-1">{item.name}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-status-critical/20 text-status-critical border border-status-critical/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Admin Navigation */}
        {currentUser.role === 'admin' && (
          <div>
            <p className="px-3 text-[11px] font-semibold tracking-wider text-ink-muted uppercase mb-2">Administration</p>
            <nav className="space-y-1">
              {adminNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-surface-2 text-ink border border-hairline'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-2/50'
                    )
                  }
                >
                  <item.icon className="w-4 h-4 text-ink-muted group-hover:text-ink transition-colors" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User Badge */}
      <div className="p-4 border-t border-hairline bg-surface-1/80">
        <NavLink to="/profile" className="flex items-center gap-3 hover:bg-surface-2 p-2 rounded-lg transition-colors">
          <div className="w-9 h-9 rounded-full bg-surface-3 border border-hairline flex items-center justify-center font-bold text-xs text-domain-trafficLight">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink truncate">{currentUser.name}</p>
            <p className="text-[10px] text-ink-muted capitalize truncate">{currentUser.role.replace('_', ' ')}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

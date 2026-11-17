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
  Droplet,
  X
} from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { alerts, isMobileSidebarOpen, setMobileSidebarOpen } = useCityNexusStore();
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const handleNavClick = () => {
    if (isMobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

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
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#111827] border-r border-[#cfd9de] dark:border-slate-800 flex flex-col h-full select-none shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto shadow-2xl lg:shadow-none",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Logo Header - Spacious and perfectly vertically aligned */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#cfd9de] dark:border-slate-800 gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#222222] dark:bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 border border-transparent dark:border-slate-700 shadow-sm">
              <Activity className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="font-bold tracking-tight text-[#222222] dark:text-slate-100 text-lg block leading-snug font-sans truncate">
                CityNexus
              </span>
              <span className="text-xs text-[#71767b] dark:text-slate-400 font-medium tracking-normal block truncate">
                Infrastructure Intelligence
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg border border-[#cfd9de] dark:border-slate-700 text-[#444444] dark:text-slate-300 hover:bg-[#e8e8e8]/60 dark:hover:bg-slate-800 lg:hidden shrink-0 transition-colors"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          <div>
            <p className="px-3 text-xs font-semibold tracking-wider text-[#71767b] dark:text-slate-400 uppercase mb-2">
              Command Center
            </p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-[#222222] dark:bg-slate-800 text-white shadow-sm'
                        : 'text-[#444444] dark:text-slate-300 hover:bg-[#e8e8e8]/60 dark:hover:bg-slate-800/60 hover:text-[#222222] dark:hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            'w-4.5 h-4.5 transition-colors shrink-0',
                            isActive ? 'text-white' : 'text-[#71767b] dark:text-slate-400 group-hover:text-[#222222] dark:group-hover:text-white'
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-xs font-mono font-bold leading-none shrink-0',
                            isActive 
                              ? 'bg-white dark:bg-slate-900 text-[#222222] dark:text-slate-100' 
                              : 'bg-[#e8e8e8] dark:bg-slate-800 text-[#222222] dark:text-slate-200'
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
            <p className="px-3 text-xs font-semibold tracking-wider text-[#71767b] dark:text-slate-400 uppercase mb-2">
              Governance
            </p>
            <div className="space-y-1">
              {adminNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-[#222222] dark:bg-slate-800 text-white shadow-sm'
                        : 'text-[#444444] dark:text-slate-300 hover:bg-[#e8e8e8]/60 dark:hover:bg-slate-800/60 hover:text-[#222222] dark:hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'w-4.5 h-4.5 transition-colors shrink-0',
                          isActive ? 'text-white' : 'text-[#71767b] dark:text-slate-400 group-hover:text-[#222222] dark:group-hover:text-white'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#cfd9de] dark:border-slate-800 text-xs text-[#71767b] dark:text-slate-400 flex items-center justify-between shrink-0">
          <span className="font-mono text-xs">v1.0 • System Ready</span>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
      </aside>
    </>
  );
};

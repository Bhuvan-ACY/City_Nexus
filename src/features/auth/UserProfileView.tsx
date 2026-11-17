import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { User, Shield, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfileView: React.FC = () => {
  const { currentUserRole, theme, toggleTheme } = useCityNexusStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
          <User className="h-7 w-7 text-[#222222] dark:text-slate-200" />
          Officer Profile & Session Credentials
        </h1>
        <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
          Review active permissions, departmental identity, and security tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-xl bg-[#222222] dark:bg-slate-800 flex items-center justify-center text-white border border-transparent dark:border-slate-700">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#222222] dark:text-slate-100">Dr. Arjun Rao</h3>
            <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 font-mono">arjun.rao@citynexus.gov</p>
          </div>
          <div className="w-full pt-3 border-t border-[#e8e8e8] dark:border-slate-800 flex flex-col gap-2.5 font-mono text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-[#71767b] dark:text-slate-400">Department</span>
              <span className="text-[#222222] dark:text-slate-100 font-semibold">Urban Mobility</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71767b] dark:text-slate-400">Clearance</span>
              <span className="text-[#222222] dark:text-slate-100 font-bold">Level 4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71767b] dark:text-slate-400">Active Role</span>
              <span className="text-[#222222] dark:text-slate-100 font-bold uppercase">{currentUserRole.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-[#e8e8e8] dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#fafafa] dark:bg-slate-800 hover:bg-[#e8e8e8]/70 dark:hover:bg-slate-700 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm font-semibold rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              <span>Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-700 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm font-semibold rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Switch Officer Session</span>
            </Link>
          </div>
        </div>

        {/* Security & Access Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#222222] dark:text-slate-200" />
              Role-Based Access Control (RBAC) Entitlements
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3.5 bg-[#fafafa] dark:bg-[#161f30] rounded-lg border border-[#cfd9de] dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#222222] dark:text-slate-100 text-sm">Cross-Domain What-If Sandbox</div>
                  <div className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400">Ability to perturb parameters and calculate cascading deltas</div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#e8e8e8] dark:bg-slate-800 text-[#222222] dark:text-slate-200 border border-[#cfd9de] dark:border-slate-700">
                  GRANTED
                </span>
              </div>

              <div className="p-3.5 bg-[#fafafa] dark:bg-[#161f30] rounded-lg border border-[#cfd9de] dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#222222] dark:text-slate-100 text-sm">Alert Dispatch & Acknowledgment</div>
                  <div className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400">Assign response teams and update incident states</div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#e8e8e8] dark:bg-slate-800 text-[#222222] dark:text-slate-200 border border-[#cfd9de] dark:border-slate-700">
                  GRANTED
                </span>
              </div>

              <div className="p-3.5 bg-[#fafafa] dark:bg-[#161f30] rounded-lg border border-[#cfd9de] dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#222222] dark:text-slate-100 text-sm">Physical SCADA Actuation</div>
                  <div className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400">Direct remote circuit breaker trip or pump motor shutdown</div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-600 text-white">
                  DENIED (By Architecture Rule 4.1)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#222222] dark:text-slate-200" />
              Critical Escalation Notifications
            </h3>
            <div className="space-y-3 text-sm text-[#444444] dark:text-slate-300">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-blue-500 focus:ring-0 accent-[#222222] dark:accent-blue-500" />
                Notify on 2nd Order Cascading Threats (&gt;3 affected nodes)
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-blue-500 focus:ring-0 accent-[#222222] dark:accent-blue-500" />
                Notify on Transformer Core Overheating (&gt;65°C)
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-blue-500 focus:ring-0 accent-[#222222] dark:accent-blue-500" />
                Notify on Municipal Hydrostatic Pressure Drop (&lt;2.8 Bar)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

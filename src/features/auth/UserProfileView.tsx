import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { User, Shield, Bell, Key, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfileView: React.FC = () => {
  const { currentUserRole, setCurrentUserRole } = useCityNexusStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="h-6 w-6 text-neutral-400" />
          Officer Profile & Session Credentials
        </h1>
        <p className="text-sm text-neutral-400">
          Review active permissions, departmental identity, and security tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-blue-600/20 border-2 border-blue-500/40 flex items-center justify-center text-blue-400">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Dr. Arjun Rao</h3>
            <p className="text-xs text-neutral-400 font-mono">arjun.rao@citynexus.gov</p>
          </div>
          <div className="w-full pt-2 border-t border-neutral-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Department</span>
              <span className="text-neutral-300 font-medium">Urban Mobility</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Security Clearance</span>
              <span className="text-emerald-400 font-medium">Level 4 (Cross-Domain)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Active Role</span>
              <span className="text-blue-400 font-bold uppercase">{currentUserRole.replace('_', ' ')}</span>
            </div>
          </div>

          <Link
            to="/login"
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Switch Officer Session
          </Link>
        </div>

        {/* Security & Access Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Role-Based Access Control (RBAC) Entitlements
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Cross-Domain What-If Sandbox</div>
                  <div className="text-neutral-400">Ability to perturb parameters and trigger forward-propagation cascades</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  GRANTED
                </span>
              </div>

              <div className="p-3 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Alert Dispatch & Acknowledgment</div>
                  <div className="text-neutral-400">Assign response teams and update incident states to In-Progress / Resolved</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  GRANTED
                </span>
              </div>

              <div className="p-3 bg-neutral-800/40 rounded-lg border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Physical SCADA Actuation</div>
                  <div className="text-neutral-400">Direct remote circuit breaker trip or pump motor shutdown</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/30">
                  DENIED (By Architecture Rule 4.1)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" />
              Critical Escalation Notifications
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded bg-neutral-800 border-neutral-700 text-blue-600 focus:ring-0" />
                Notify on 2nd Order Cascading Threats (&gt;3 affected nodes)
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded bg-neutral-800 border-neutral-700 text-blue-600 focus:ring-0" />
                Notify on Transformer Core Overheating (&gt;65°C)
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded bg-neutral-800 border-neutral-700 text-blue-600 focus:ring-0" />
                Notify on Municipal Hydrostatic Pressure Drop (&lt;2.8 Bar)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

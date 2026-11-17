import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { User, Shield, Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfileView: React.FC = () => {
  const { currentUserRole } = useCityNexusStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-2 border-b border-[#cfd9de]">
        <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
          <User className="h-6 w-6 text-[#222222]" />
          Officer Profile & Session Credentials
        </h1>
        <p className="text-xs text-[#71767b] mt-0.5">
          Review active permissions, departmental identity, and security tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-[#cfd9de] rounded-lg p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-lg bg-[#222222] flex items-center justify-center text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#222222]">Dr. Arjun Rao</h3>
            <p className="text-xs text-[#71767b] font-mono">arjun.rao@citynexus.gov</p>
          </div>
          <div className="w-full pt-3 border-t border-[#e8e8e8] flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#71767b]">Department</span>
              <span className="text-[#222222] font-semibold">Urban Mobility</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71767b]">Clearance</span>
              <span className="text-[#222222] font-bold">Level 4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71767b]">Active Role</span>
              <span className="text-[#222222] font-bold uppercase">{currentUserRole.replace('_', ' ')}</span>
            </div>
          </div>

          <Link
            to="/login"
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#e8e8e8]/50 border border-[#cfd9de] text-[#222222] text-xs font-semibold rounded-lg transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Switch Officer Session</span>
          </Link>
        </div>

        {/* Security & Access Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#cfd9de] rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#222222] flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#222222]" />
              Role-Based Access Control (RBAC) Entitlements
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#fafafa] rounded-lg border border-[#cfd9de] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#222222]">Cross-Domain What-If Sandbox</div>
                  <div className="text-[#71767b]">Ability to perturb parameters and calculate cascading deltas</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e8e8e8] text-[#222222] border border-[#cfd9de]">
                  GRANTED
                </span>
              </div>

              <div className="p-3 bg-[#fafafa] rounded-lg border border-[#cfd9de] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#222222]">Alert Dispatch & Acknowledgment</div>
                  <div className="text-[#71767b]">Assign response teams and update incident states</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e8e8e8] text-[#222222] border border-[#cfd9de]">
                  GRANTED
                </span>
              </div>

              <div className="p-3 bg-[#fafafa] rounded-lg border border-[#cfd9de] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#222222]">Physical SCADA Actuation</div>
                  <div className="text-[#71767b]">Direct remote circuit breaker trip or pump motor shutdown</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#222222] text-white">
                  DENIED (By Architecture Rule 4.1)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#cfd9de] rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#222222] flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#222222]" />
              Critical Escalation Notifications
            </h3>
            <div className="space-y-2.5 text-xs text-[#444444]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#cfd9de] text-[#222222] focus:ring-0 accent-[#222222]" />
                Notify on 2nd Order Cascading Threats (&gt;3 affected nodes)
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#cfd9de] text-[#222222] focus:ring-0 accent-[#222222]" />
                Notify on Transformer Core Overheating (&gt;65°C)
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#cfd9de] text-[#222222] focus:ring-0 accent-[#222222]" />
                Notify on Municipal Hydrostatic Pressure Drop (&lt;2.8 Bar)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

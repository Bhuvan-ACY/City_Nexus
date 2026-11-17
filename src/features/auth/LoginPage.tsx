import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { UserRole } from '../../types/domain.types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUserRole } = useCityNexusStore();
  const [email, setEmail] = useState('arjun.rao@citynexus.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('city_planner');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 items-center justify-center text-blue-500 mb-2">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            City<span className="text-blue-500">Nexus</span> Command Access
          </h2>
          <p className="text-xs text-neutral-400">
            Sign in with authorized municipal single sign-on or credential token
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-neutral-300 font-medium">Departmental Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                placeholder="officer@agency.gov"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-300 font-medium">Password / Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-300 font-medium">Select Operational Role (Simulated SSO)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="city_planner">City Planner (Cross-Domain Access)</option>
              <option value="traffic_controller">Traffic Controller (Mobility Domain)</option>
              <option value="grid_operator">Grid Operator (Power Grid Domain)</option>
              <option value="utility_manager">Utility Manager (Public Water Domain)</option>
              <option value="admin">System Administrator (Full Governance)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
          >
            Authenticate Session
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-between">
          <Link to="/register" className="hover:text-white transition-colors">
            Request Officer Access
          </Link>
          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> 256-bit TLS Protected
          </span>
        </div>
      </div>
    </div>
  );
};

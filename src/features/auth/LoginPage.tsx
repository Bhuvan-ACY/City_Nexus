import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, Sun, Moon } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { UserRole } from '../../types/domain.types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUserRole, theme, toggleTheme } = useCityNexusStore();
  const [email, setEmail] = useState('arjun.rao@citynexus.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('city_planner');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f17] flex flex-col justify-center items-center px-4 selection:bg-[#222222] selection:text-white transition-colors relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#cfd9de] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#222222] dark:text-slate-100 text-sm font-semibold transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-[#222222] dark:bg-slate-800 items-center justify-center text-white mb-2 border border-transparent dark:border-slate-700">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#222222] dark:text-slate-100 font-sans">
            CityNexus Command Access
          </h2>
          <p className="text-sm text-[#71767b] dark:text-slate-400">
            Sign in with authorized municipal single sign-on credentials
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Departmental Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#71767b] dark:text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 placeholder-[#909090] dark:placeholder-slate-500 focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
                placeholder="officer@agency.gov"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Password / Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#71767b] dark:text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 placeholder-[#909090] dark:placeholder-slate-500 focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Operational Persona (Simulated SSO)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 font-semibold focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
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
            className="w-full mt-3 bg-[#222222] dark:bg-blue-600 hover:bg-[#0a0a0a] dark:hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#e8e8e8] dark:border-slate-800 text-center text-xs sm:text-sm text-[#71767b] dark:text-slate-400 flex items-center justify-between">
          <Link to="/register" className="hover:text-[#222222] dark:hover:text-slate-100 transition-colors font-medium">
            Request Officer Clearance
          </Link>
          <span className="font-mono text-xs text-[#909090] dark:text-slate-500">
            256-bit TLS Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

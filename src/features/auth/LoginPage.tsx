import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 selection:bg-[#222222] selection:text-white">
      <div className="w-full max-w-md bg-white border border-[#cfd9de] rounded-lg p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 rounded-lg bg-[#222222] items-center justify-center text-white mb-2">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#222222] font-sans">
            CityNexus Command Access
          </h2>
          <p className="text-xs text-[#71767b]">
            Sign in with authorized municipal single sign-on credentials
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[#222222] font-bold">Departmental Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#71767b]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#cfd9de] rounded-lg pl-9 pr-3 py-2 text-xs text-[#222222] placeholder-[#909090] focus:outline-none focus:border-[#222222]"
                placeholder="officer@agency.gov"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#222222] font-bold">Password / Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#71767b]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#cfd9de] rounded-lg pl-9 pr-3 py-2 text-xs text-[#222222] placeholder-[#909090] focus:outline-none focus:border-[#222222]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#222222] font-bold">Operational Persona (Simulated SSO)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-2 text-xs text-[#222222] font-semibold focus:outline-none focus:border-[#222222]"
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
            className="w-full mt-2 bg-[#222222] hover:bg-[#0a0a0a] text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#e8e8e8] text-center text-xs text-[#71767b] flex items-center justify-between">
          <Link to="/register" className="hover:text-[#222222] transition-colors font-medium">
            Request Officer Clearance
          </Link>
          <span className="font-mono text-[10px] text-[#909090]">
            256-bit TLS Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

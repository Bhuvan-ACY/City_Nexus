import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, ArrowRight, Sun, Moon } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useCityNexusStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agency, setAgency] = useState('');
  const [requestedRole, setRequestedRole] = useState('traffic_controller');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/login');
    }, 2500);
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
            <Building className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#222222] dark:text-slate-100 font-sans">
            Officer Registration
          </h2>
          <p className="text-sm text-[#71767b] dark:text-slate-400">
            Submit credentials for clearance by the Metropolitan IT authority
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#fafafa] dark:bg-[#161f30] border border-[#cfd9de] dark:border-slate-800 text-[#222222] dark:text-slate-100 rounded-lg text-center space-y-2">
            <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Provisioning Request Submitted</h4>
            <p className="text-sm text-[#444444] dark:text-slate-300">
              Credentials are awaiting administrative sign-off. Redirecting to login portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Full Name & Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ananya Sen"
                className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 placeholder-[#909090] dark:placeholder-slate-500 focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Government Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya.sen@transport.gov"
                className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 placeholder-[#909090] dark:placeholder-slate-500 focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Department / Agency</label>
              <input
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="Metropolitan Transport Corporation"
                className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 placeholder-[#909090] dark:placeholder-slate-500 focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm text-[#222222] dark:text-slate-200 font-bold">Requested Authority Role</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-[#222222] dark:text-slate-100 font-semibold focus:outline-none focus:border-[#222222] dark:focus:border-slate-400"
              >
                <option value="traffic_controller">Traffic Controller (Mobility)</option>
                <option value="grid_operator">Grid Operator (Electrical)</option>
                <option value="utility_manager">Utility Manager (Water)</option>
                <option value="city_planner">City Planner (Cross-Domain)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-[#222222] dark:bg-blue-600 hover:bg-[#0a0a0a] dark:hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Submit for Clearance</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#e8e8e8] dark:border-slate-800 text-center text-sm text-[#71767b] dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-[#006be6] dark:text-blue-400 hover:underline font-semibold">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

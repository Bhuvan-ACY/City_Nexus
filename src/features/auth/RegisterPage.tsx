import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Shield, Mail, ArrowRight, Building } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#090909] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 items-center justify-center text-blue-500 mb-2">
            <Building className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Officer Registration
          </h2>
          <p className="text-xs text-neutral-400">
            Submit your municipal credentials for verification by the Metropolitan IT authority
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-center space-y-2">
            <h4 className="font-semibold text-sm">Provisioning Request Submitted</h4>
            <p className="text-xs text-neutral-300">
              Your credentials are awaiting administrative sign-off. Redirecting to login portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-neutral-300 font-medium">Full Name & Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ananya Sen"
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 font-medium">Official Government Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya.sen@transport.gov"
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 font-medium">Department / Agency</label>
              <input
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="Metropolitan Transport Corporation"
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 font-medium">Requested Authority Role</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="traffic_controller">Traffic Controller (Mobility)</option>
                <option value="grid_operator">Grid Operator (Electrical)</option>
                <option value="utility_manager">Utility Manager (Water)</option>
                <option value="city_planner">City Planner (Cross-Domain)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
            >
              Submit for Clearance
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
          Already registered?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

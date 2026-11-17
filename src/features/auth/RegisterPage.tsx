import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 selection:bg-[#222222] selection:text-white">
      <div className="w-full max-w-md bg-white border border-[#cfd9de] rounded-lg p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 rounded-lg bg-[#222222] items-center justify-center text-white mb-2">
            <Building className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#222222] font-sans">
            Officer Registration
          </h2>
          <p className="text-xs text-[#71767b]">
            Submit credentials for clearance by the Metropolitan IT authority
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#fafafa] border border-[#cfd9de] text-[#222222] rounded-lg text-center space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider">Provisioning Request Submitted</h4>
            <p className="text-xs text-[#444444]">
              Credentials are awaiting administrative sign-off. Redirecting to login portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-[#222222] font-bold">Full Name & Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ananya Sen"
                className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-2 text-xs text-[#222222] placeholder-[#909090] focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#222222] font-bold">Government Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya.sen@transport.gov"
                className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-2 text-xs text-[#222222] placeholder-[#909090] focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#222222] font-bold">Department / Agency</label>
              <input
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="Metropolitan Transport Corporation"
                className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-2 text-xs text-[#222222] placeholder-[#909090] focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#222222] font-bold">Requested Authority Role</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="w-full bg-white border border-[#cfd9de] rounded-lg px-3 py-2 text-xs text-[#222222] font-semibold focus:outline-none focus:border-[#222222]"
              >
                <option value="traffic_controller">Traffic Controller (Mobility)</option>
                <option value="grid_operator">Grid Operator (Electrical)</option>
                <option value="utility_manager">Utility Manager (Water)</option>
                <option value="city_planner">City Planner (Cross-Domain)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#222222] hover:bg-[#0a0a0a] text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Submit for Clearance</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#e8e8e8] text-center text-xs text-[#71767b]">
          Already registered?{' '}
          <Link to="/login" className="text-[#006be6] hover:underline font-semibold">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

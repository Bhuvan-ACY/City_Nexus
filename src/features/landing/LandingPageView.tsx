import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export const LandingPageView: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col selection:bg-[#222222] selection:text-white">
      {/* Top Nav */}
      <nav className="border-b border-[#cfd9de] bg-white sticky top-0 z-50">
        <div className="w-full px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#222222] flex items-center justify-center text-white shrink-0">
              <Activity className="h-4 w-4 text-white stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#222222] font-sans">
              CityNexus
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-[#444444] hover:text-[#222222] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-semibold bg-[#222222] hover:bg-[#0a0a0a] text-white px-4 py-2 rounded-lg transition-all"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Animated drizzle emoji representation */}
        <div className="flex items-center gap-2 mb-6 text-2xl select-none">
          <span className="animate-bounce delay-100">💧</span>
          <span className="animate-bounce delay-200">⚡</span>
          <span className="animate-bounce delay-300">🚦</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#e8e8e8] text-[#222222] text-xs font-mono font-medium mb-6 border border-[#cfd9de]">
          <span>Cross-Sector Cascade Prevention Digital Twin</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#222222] max-w-4xl leading-tight font-sans">
          Understand urban ripple effects before problems escalate.
        </h1>

        <p className="mt-6 text-base text-[#444444] max-w-2xl leading-relaxed">
          Modern cities struggle with interconnected infrastructure. A surge in traffic queues overloads electrical power substations, tripping municipal water booster pumps. CityNexus models these cascades in real time.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#222222] text-white font-semibold text-xs px-5 py-3 rounded-lg transition-all"
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/simulation"
            className="flex items-center gap-2 bg-white hover:bg-[#e8e8e8]/50 border border-[#cfd9de] text-[#222222] font-semibold text-xs px-5 py-3 rounded-lg transition-all"
          >
            <span>Explore What-If Sandbox</span>
          </Link>
        </div>

        {/* 3 Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full text-left">
          <div className="p-5 rounded-lg bg-white border border-[#cfd9de] hover:border-[#444444] transition-colors">
            <span className="text-[10px] font-mono font-bold uppercase text-[#71767b] block mb-2">01 / MOBILITY</span>
            <h3 className="text-sm font-bold text-[#222222] mb-1.5">Traffic Congestion</h3>
            <p className="text-xs text-[#444444] leading-relaxed">
              Arterial bottle-neck velocity tracking, queue lengths, and adaptive signal timing to prevent EV charging overload surges.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[#cfd9de] hover:border-[#444444] transition-colors">
            <span className="text-[10px] font-mono font-bold uppercase text-[#71767b] block mb-2">02 / POWER GRID</span>
            <h3 className="text-sm font-bold text-[#222222] mb-1.5">Substation Telemetry</h3>
            <p className="text-xs text-[#444444] leading-relaxed">
              Real-time MW transmission loads, diurnal demand curves, and transformer core thermal alarms (&gt;65°C) to prevent voltage trips.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[#cfd9de] hover:border-[#444444] transition-colors">
            <span className="text-[10px] font-mono font-bold uppercase text-[#71767b] block mb-2">03 / UTILITIES</span>
            <h3 className="text-sm font-bold text-[#222222] mb-1.5">Hydraulic Mains</h3>
            <p className="text-xs text-[#444444] leading-relaxed">
              Hydrostatic line pressure (Bar), municipal reservoir levels, and booster pump health monitoring to eliminate dry-tap risks.
            </p>
          </div>
        </div>
      </section>

      {/* Benchmark / Feature Strip */}
      <section className="border-t border-[#cfd9de] py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-left mb-8">
          <h2 className="text-xl font-bold text-[#222222]">Interconnected Intelligence System</h2>
          <p className="text-xs text-[#71767b] mt-1">Cross-sector architecture designed for municipal resilience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-[#cfd9de] rounded-lg">
            <div className="text-xs font-mono font-bold text-[#222222] mb-1">
              FORWARD CASCADE ENGINE
            </div>
            <p className="text-xs text-[#444444] leading-relaxed">
              Multi-parameter perturbation sandbox modeling downstream 1st and 2nd order ripple effects with deterministic physics transfer factors.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#cfd9de] rounded-lg">
            <div className="text-xs font-mono font-bold text-[#222222] mb-1">
              DIRECTED TOPOLOGY GRAPH
            </div>
            <p className="text-xs text-[#444444] leading-relaxed">
              Node-link asset mapping tracing power feeder lines, water conduits, and arterial corridors with blast-radius vulnerability calculation.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#cfd9de] rounded-lg">
            <div className="text-xs font-mono font-bold text-[#222222] mb-1">
              LEAFLET GIS GEOSPATIAL MAP
            </div>
            <p className="text-xs text-[#444444] leading-relaxed">
              Geographic polygon boundary visualization highlighting metropolitan zone health scores and real-time asset telemetry sheets.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#cfd9de] rounded-lg">
            <div className="text-xs font-mono font-bold text-[#222222] mb-1">
              MULTI-AGENCY ALERT TRIAGE
            </div>
            <p className="text-xs text-[#444444] leading-relaxed">
              Role-Based Access Control enabling City Planners, Traffic Controllers, Grid Operators, and Water Managers to coordinate unified responses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#cfd9de] py-8 px-6 text-center text-xs text-[#71767b]">
        <p>CityNexus Platform © 2026 • Achromatic Urban Infrastructure Intelligence</p>
        <p className="mt-1 font-mono text-[10px] text-[#909090]">Safe, Observational Decision-Support Architecture</p>
      </footer>
    </div>
  );
};

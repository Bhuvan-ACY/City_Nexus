import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Sun, Moon } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';

export const LandingPageView: React.FC = () => {
  const { theme, toggleTheme } = useCityNexusStore();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f17] text-[#222222] dark:text-[#f3f4f6] flex flex-col selection:bg-[#222222] selection:text-white transition-colors">
      {/* Top Nav */}
      <nav className="border-b border-[#cfd9de] dark:border-slate-800 bg-white dark:bg-[#111827] sticky top-0 z-50 transition-colors">
        <div className="w-full px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#222222] dark:bg-slate-800 flex items-center justify-center text-white shrink-0 border border-transparent dark:border-slate-700">
              <Activity className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#222222] dark:text-slate-100 font-sans">
              CityNexus
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#cfd9de] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#222222] dark:text-slate-100 text-sm font-semibold hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <Link
              to="/login"
              className="text-sm font-semibold text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-semibold bg-[#222222] dark:bg-blue-600 hover:bg-[#0a0a0a] dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#e8e8e8] dark:bg-slate-800 text-[#222222] dark:text-slate-200 text-sm font-mono font-medium mb-6 border border-[#cfd9de] dark:border-slate-700">
          <span>Cross-Sector Cascade Prevention Digital Twin</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#222222] dark:text-slate-100 max-w-4xl leading-tight font-sans">
          Understand urban ripple effects before problems escalate.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#444444] dark:text-slate-300 max-w-2xl leading-relaxed">
          Modern cities struggle with interconnected infrastructure. A surge in traffic queues overloads electrical power substations, tripping municipal water booster pumps. CityNexus models these cascades in real time.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-[#0a0a0a] dark:bg-blue-600 hover:bg-[#222222] dark:hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3.5 rounded-lg transition-all shadow-sm"
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/simulation"
            className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-700 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 font-semibold text-sm px-6 py-3.5 rounded-lg transition-all"
          >
            <span>Explore What-If Sandbox</span>
          </Link>
        </div>

        {/* 3 Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 w-full text-left">
          <div className="p-6 rounded-lg bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 hover:border-[#444444] dark:hover:border-slate-600 transition-colors">
            <span className="text-xs font-mono font-bold uppercase text-[#71767b] dark:text-slate-400 block mb-2">01 / MOBILITY</span>
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-2">Traffic Congestion</h3>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Arterial bottle-neck velocity tracking, queue lengths, and adaptive signal timing to prevent EV charging overload surges.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 hover:border-[#444444] dark:hover:border-slate-600 transition-colors">
            <span className="text-xs font-mono font-bold uppercase text-[#71767b] dark:text-slate-400 block mb-2">02 / POWER GRID</span>
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-2">Substation Telemetry</h3>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Real-time MW transmission loads, diurnal demand curves, and transformer core thermal alarms (&gt;65°C) to prevent voltage trips.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 hover:border-[#444444] dark:hover:border-slate-600 transition-colors">
            <span className="text-xs font-mono font-bold uppercase text-[#71767b] dark:text-slate-400 block mb-2">03 / UTILITIES</span>
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-2">Hydraulic Mains</h3>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Hydrostatic line pressure (Bar), municipal reservoir levels, and booster pump health monitoring to eliminate dry-tap risks.
            </p>
          </div>
        </div>
      </section>

      {/* Benchmark / Feature Strip */}
      <section className="border-t border-[#cfd9de] dark:border-slate-800 py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-[#222222] dark:text-slate-100">Interconnected Intelligence System</h2>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">Cross-sector architecture designed for municipal resilience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg">
            <div className="text-sm font-mono font-bold text-[#222222] dark:text-slate-100 mb-1.5">
              FORWARD CASCADE ENGINE
            </div>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Multi-parameter perturbation sandbox modeling downstream 1st and 2nd order ripple effects with deterministic physics transfer factors.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg">
            <div className="text-sm font-mono font-bold text-[#222222] dark:text-slate-100 mb-1.5">
              DIRECTED TOPOLOGY GRAPH
            </div>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Node-link asset mapping tracing power feeder lines, water conduits, and arterial corridors with blast-radius vulnerability calculation.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg">
            <div className="text-sm font-mono font-bold text-[#222222] dark:text-slate-100 mb-1.5">
              LEAFLET GIS GEOSPATIAL MAP
            </div>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Geographic polygon boundary visualization highlighting metropolitan zone health scores and real-time asset telemetry sheets.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg">
            <div className="text-sm font-mono font-bold text-[#222222] dark:text-slate-100 mb-1.5">
              MULTI-AGENCY ALERT TRIAGE
            </div>
            <p className="text-sm text-[#444444] dark:text-slate-300 leading-relaxed">
              Role-Based Access Control enabling City Planners, Traffic Controllers, Grid Operators, and Water Managers to coordinate unified responses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#cfd9de] dark:border-slate-800 py-8 px-6 text-center text-sm text-[#71767b] dark:text-slate-400">
        <p>CityNexus Platform © 2026 • Achromatic Urban Infrastructure Intelligence</p>
        <p className="mt-1 font-mono text-xs text-[#909090] dark:text-slate-500">Safe, Observational Decision-Support Architecture</p>
      </footer>
    </div>
  );
};

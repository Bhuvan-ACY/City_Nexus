import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu, ArrowRight, Layers, Zap, Droplet, Car, CheckCircle2 } from 'lucide-react';

export const LandingPageView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090909] text-neutral-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-800 bg-[#090909]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full px-6 lg:px-10 h-18 flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105 shrink-0">
              <Activity className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans flex items-center">
              City<span className="text-blue-500">Nexus</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-600/20"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-8">
          <ShieldAlert className="h-3.5 w-3.5" />
          Cross-Sector Cascade Prevention Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight">
          Understand Urban Ripple Effects <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-cyan-400">
            Before Problems Escalate.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
          Modern cities operate on fragile interdependencies. CityNexus synchronizes traffic flows, power grid telemetry, and hydraulic networks into a real-time predictive digital twin—transforming reactive crisis response into proactive municipal intelligence.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all w-full sm:w-auto justify-center"
          >
            Open Live Command Center
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/simulation"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all w-full sm:w-auto justify-center"
          >
            Explore What-If Sandbox
          </Link>
        </div>

        {/* 3 Domain Capsules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-blue-500/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Car className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Urban Mobility & Traffic</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Real-time congestion indexing, signal cycle adjustments, and corridor rerouting prevent arterial gridlock from triggering downstream electrical spikes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Power Transmission Grid</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Substation telemetry and transformer thermal stress monitoring ensure EV charging surges do not cause bus trips that shut down municipal water pumps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-cyan-500/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Droplet className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Public Water Networks</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Hydraulic pressure tracking and pump station resilience monitoring protect drinking supplies and isolate pipe rupture hazards before street flooding begins.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="border-t border-neutral-800/60 py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered for Interconnected Municipal Operations
          </h2>
          <p className="text-sm text-neutral-400 mt-3">
            Every feature is purpose-built to break down departmental silos between traffic police, electricity utilities, and water boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-blue-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Multi-Domain Ticker
            </div>
            <p className="text-xs text-neutral-400">
              Global live ticker broadcasting cascade risks, severity levels, and blast radius directly across all department consoles.
            </p>
          </div>
          <div className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> What-If Simulation
            </div>
            <p className="text-xs text-neutral-400">
              Interactive perturbation sliders compute 1st and 2nd order downstream effects in real-time using deterministic physics transfer models.
            </p>
          </div>
          <div className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Dependency Graph
            </div>
            <p className="text-xs text-neutral-400">
              Directed node-link graph tracking critical asset linkages, transmission lines, feeder cables, and water main interconnections.
            </p>
          </div>
          <div className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-purple-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> GIS Geospatial Maps
            </div>
            <p className="text-xs text-neutral-400">
              Interactive Leaflet GIS mapping with zone polygon health rings, asset inspection sheets, and active alert overlays.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 py-8 px-6 text-center text-xs text-neutral-500">
        <p>CityNexus Platform © 2026. Built for Metropolitan Urban Infrastructure Resilience.</p>
        <p className="mt-1 font-mono text-[11px] text-neutral-600">Decision-Support Architecture — Safe, Non-Actuating Intelligence</p>
      </footer>
    </div>
  );
};

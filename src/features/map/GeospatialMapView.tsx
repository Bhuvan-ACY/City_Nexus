import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Compass } from 'lucide-react';

export const GeospatialMapView: React.FC = () => {
  const { zones, nodes } = useCityNexusStore();

  const [activeDomain, setActiveDomain] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const filteredNodes = activeDomain === 'all'
    ? nodes
    : nodes.filter((n) => n.domain === activeDomain);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <Compass className="h-7 w-7 text-[#222222] dark:text-emerald-400" />
            GIS Geospatial Infrastructure Matrix
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Geographic boundary polygon monitoring and live asset telemetry readouts.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg overflow-x-auto max-w-full shrink-0">
          {(['all', 'traffic', 'electricity', 'utilities'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md capitalize transition-all ${
                activeDomain === d
                  ? 'bg-[#222222] dark:bg-slate-700 text-white'
                  : 'text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic Zones & Assets Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#222222] dark:text-slate-100">Metropolitan Geographic Sectors</h3>
              <span className="text-xs sm:text-sm font-mono text-[#71767b] dark:text-slate-400">6 Administrative Zones</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
              {zones.map((zone) => (
                <div key={zone.id} className="p-4 border border-[#cfd9de] dark:border-slate-800 rounded-lg bg-[#fafafa] dark:bg-[#161f30] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#222222] dark:text-slate-100">{zone.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-200">
                      {zone.healthScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-[#71767b] dark:text-slate-400 pt-1.5 border-t border-[#e8e8e8] dark:border-slate-800">
                    <span>Traffic: {zone.metrics.trafficCongestion}%</span>
                    <span>Grid: {zone.metrics.gridLoad}%</span>
                    <span>Water: {zone.metrics.waterPressure} PSI</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-3">Asset Telemetry Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-[#222222] dark:border-blue-500 ring-2 ring-[#222222] dark:ring-blue-500 shadow-sm'
                        : 'bg-white dark:bg-[#161f30] border-[#cfd9de] dark:border-slate-800 hover:border-[#808080] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold uppercase text-[#71767b] dark:text-slate-400">{node.domain}</span>
                      <span className="text-xs font-mono text-[#444444] dark:text-slate-200 font-bold">{node.currentValue} {node.unit}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#222222] dark:text-slate-100">{node.name}</h4>
                    <p className="text-xs font-mono text-[#71767b] dark:text-slate-400 mt-1">Lat: {node.lat}, Lng: {node.lng}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Asset Inspection Sheet */}
        <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100">Asset Inspection Sheet</h3>
            <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mt-0.5">Physical telemetry & operating specifications</p>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#fafafa] dark:bg-slate-800/60 border border-[#cfd9de] dark:border-slate-700 rounded-lg space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase text-[#71767b] dark:text-slate-400">{selectedNode.domain} Asset</span>
                <h4 className="text-base font-bold text-[#222222] dark:text-slate-100">{selectedNode.name}</h4>
                <p className="text-xs sm:text-sm text-[#444444] dark:text-slate-300 mt-1 leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono">
                <div className="flex justify-between py-2 border-b border-[#e8e8e8] dark:border-slate-800">
                  <span className="text-[#71767b] dark:text-slate-400">Current Reading</span>
                  <span className="font-bold text-[#222222] dark:text-slate-100">{selectedNode.currentValue} {selectedNode.unit}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#e8e8e8] dark:border-slate-800">
                  <span className="text-[#71767b] dark:text-slate-400">Rated Capacity</span>
                  <span className="font-bold text-[#222222] dark:text-slate-100">{selectedNode.capacity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#e8e8e8] dark:border-slate-800">
                  <span className="text-[#71767b] dark:text-slate-400">Zone ID</span>
                  <span className="font-bold text-[#222222] dark:text-slate-100">{selectedNode.zoneId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#e8e8e8] dark:border-slate-800">
                  <span className="text-[#71767b] dark:text-slate-400">Operating State</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                    selectedNode.status === 'CRITICAL' 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-[#e8e8e8] dark:bg-slate-800 text-[#444444] dark:text-slate-300'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs sm:text-sm text-[#71767b] dark:text-slate-400 bg-[#fafafa] dark:bg-slate-800/40 border border-[#cfd9de] dark:border-slate-800 rounded-lg leading-relaxed">
              Click any infrastructure node to view live SCADA telemetry readouts and geographic coordinates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

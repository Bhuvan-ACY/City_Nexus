import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Compass, Layers, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Zone, InfrastructureNode } from '../../types/domain.types';

export const GeospatialMapView: React.FC = () => {
  const { zones, nodes, alerts } = useCityNexusStore();

  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    electricity: true,
    utilities: true,
  });

  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[1] || zones[0]);
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const visibleNodes = nodes.filter((n) => activeLayers[n.domain]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
            <Compass className="w-6 h-6 text-domain-utilitiesLight" />
            <span>Geospatial Infrastructure GIS Digital Twin</span>
          </h1>
          <p className="text-sm text-ink-muted">
            High-fidelity 2D spatial canvas mapping municipal zones, feeder lines, and active sensor clusters.
          </p>
        </div>

        {/* GIS Layer Controls */}
        <div className="flex items-center gap-3 bg-surface-1 border border-hairline px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span className="text-ink-muted flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Overlays:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-ink">
            <input
              type="checkbox"
              checked={activeLayers.traffic}
              onChange={() => toggleLayer('traffic')}
              className="accent-domain-traffic cursor-pointer"
            />
            <span>Traffic Corridors</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-ink">
            <input
              type="checkbox"
              checked={activeLayers.electricity}
              onChange={() => toggleLayer('electricity')}
              className="accent-domain-electricity cursor-pointer"
            />
            <span>Power Grid</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-ink">
            <input
              type="checkbox"
              checked={activeLayers.utilities}
              onChange={() => toggleLayer('utilities')}
              className="accent-domain-utilities cursor-pointer"
            />
            <span>Water Mains</span>
          </label>
        </div>
      </div>

      {/* Main Map Canvas & Sector Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Spatial Map Viewport Card */}
        <div className="lg:col-span-8 bg-surface-1 border border-hairline rounded-xl p-6 shadow-sm overflow-hidden flex flex-col justify-between relative">
          {/* Simulated High-Tech Metropolitan Map Grid */}
          <div className="w-full flex-1 rounded-xl bg-canvas border border-hairline/60 relative overflow-hidden flex flex-col items-center justify-center p-6 select-none">
            {/* Ambient Background Blueprint Grid */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#262626 1px, transparent 1px), linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
                backgroundSize: '20px 20px, 40px 40px, 40px 40px'
              }}
            />

            {/* Simulated Geographic Sector Polygons */}
            <div className="w-full max-w-lg grid grid-cols-2 md:grid-cols-3 gap-4 z-10">
              {zones.map((z) => {
                const isSelected = selectedZone?.id === z.id;
                const statusColor = 
                  z.healthScore >= 80 ? 'border-status-normal/40 bg-status-normal/5 hover:bg-status-normal/10' :
                  z.healthScore >= 60 ? 'border-status-warning/40 bg-status-warning/5 hover:bg-status-warning/10' :
                  'border-status-critical/60 bg-status-critical/10 hover:bg-status-critical/15 animate-pulse';

                return (
                  <div
                    key={z.id}
                    onClick={() => { setSelectedZone(z); setSelectedNode(null); }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer backdrop-blur-sm ${statusColor} ${
                      isSelected ? 'ring-2 ring-domain-traffic shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink font-mono">{z.code}</span>
                      <span className={`text-[10px] font-bold px-1.5 rounded ${
                        z.healthScore >= 80 ? 'text-status-normal' : z.healthScore >= 60 ? 'text-status-warning' : 'text-status-critical'
                      }`}>
                        {z.healthScore}%
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-ink truncate">{z.name}</h5>
                    <div className="mt-2 text-[10px] text-ink-muted space-y-0.5">
                      <div className="flex justify-between"><span>Traffic:</span> <span className="font-semibold text-ink">{z.metrics.trafficCongestion}%</span></div>
                      <div className="flex justify-between"><span>Grid:</span> <span className="font-semibold text-ink">{z.metrics.gridLoad}%</span></div>
                      <div className="flex justify-between"><span>Water:</span> <span className="font-semibold text-ink">{z.metrics.waterPressure} PSI</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Asset Overlay Pins */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center z-10">
              {visibleNodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    selectedNode?.id === n.id
                      ? 'bg-domain-traffic text-white border-domain-traffic shadow-md'
                      : 'bg-surface-2 text-ink border-hairline hover:bg-surface-3'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-domain-trafficLight" />
                  <span>{n.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-ink-muted mt-4 flex items-center justify-between">
            <span>Click any municipal zone polygon or asset node pin to inspect live telemetry and active alerts.</span>
            <span className="font-mono text-[10px]">Projection: WGS84 EPSG:4326</span>
          </div>
        </div>

        {/* Selected Zone / Asset Inspection Sheet */}
        <div className="lg:col-span-4 bg-surface-1 border border-hairline rounded-xl p-6 shadow-sm overflow-y-auto flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted block mb-1">
                  INFRASTRUCTURE TELEMETRY PIN
                </span>
                <h3 className="text-base font-bold text-ink">{selectedNode.name}</h3>
                <p className="text-xs text-ink-muted mt-1">{selectedNode.description}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-2 border border-hairline space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Asset Sector:</span>
                  <span className="font-bold text-ink uppercase text-[10px]">{selectedNode.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Zone ID:</span>
                  <span className="font-semibold text-ink">{selectedNode.zoneId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Rated Capacity:</span>
                  <span className="font-semibold text-ink">{selectedNode.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Live Output:</span>
                  <span className="font-extrabold text-ink">{selectedNode.currentValue} {selectedNode.unit}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-full py-2 bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-ink border border-hairline rounded-lg transition-colors"
              >
                Back to Sector Summary
              </button>
            </div>
          ) : selectedZone ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                    MUNICIPAL SECTOR PROFILE
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    selectedZone.healthScore >= 80 ? 'bg-status-normal/10 text-status-normal' :
                    selectedZone.healthScore >= 60 ? 'bg-status-warning/10 text-status-warning' :
                    'bg-status-critical/10 text-status-critical'
                  }`}>
                    Health: {selectedZone.healthScore}/100
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink">{selectedZone.name}</h3>
                <p className="text-xs text-ink-muted mt-1 font-mono">Code: {selectedZone.code}</p>
              </div>

              {/* Realtime Sector Telemetry */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted font-medium">Traffic Congestion Index:</span>
                    <span className="font-bold text-ink">{selectedZone.metrics.trafficCongestion}%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden">
                    <div className="bg-domain-traffic h-full rounded-full" style={{ width: `${selectedZone.metrics.trafficCongestion}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted font-medium">Grid Substation Load:</span>
                    <span className="font-bold text-ink">{selectedZone.metrics.gridLoad}%</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden">
                    <div className="bg-domain-electricity h-full rounded-full" style={{ width: `${selectedZone.metrics.gridLoad}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted font-medium">Main Water Discharge:</span>
                    <span className="font-bold text-ink">{selectedZone.metrics.waterPressure} PSI</span>
                  </div>
                  <div className="w-full bg-surface-1 h-2 rounded-full overflow-hidden">
                    <div className="bg-domain-utilities h-full rounded-full" style={{ width: `${Math.min(100, (selectedZone.metrics.waterPressure / 80) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Zone Assets count */}
              <div className="text-xs text-ink-muted pt-2 border-t border-hairline">
                <span>Total Assets Mapped in Sector: </span>
                <span className="font-bold text-ink">{nodes.filter((n) => n.zoneId === selectedZone.id).length} units</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-ink-muted text-xs">
              Select a municipal zone polygon on the map viewport.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

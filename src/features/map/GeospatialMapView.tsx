import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Compass, MapPin, Layers } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Compass className="h-6 w-6 text-[#222222]" />
            GIS Geospatial Infrastructure Matrix
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Geographic boundary polygon monitoring and live asset telemetry readouts.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#cfd9de] rounded-lg">
          {(['all', 'traffic', 'electricity', 'utilities'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                activeDomain === d
                  ? 'bg-[#222222] text-white'
                  : 'text-[#444444] hover:text-[#222222]'
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
          <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#222222]">Metropolitan Geographic Sectors</h3>
              <span className="text-xs font-mono text-[#71767b]">6 Administrative Zones</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {zones.map((zone) => (
                <div key={zone.id} className="p-3.5 border border-[#cfd9de] rounded-lg bg-[#fafafa]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#222222]">{zone.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-[#cfd9de]">
                      {zone.healthScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#71767b] pt-1">
                    <span>Traffic: {zone.metrics.trafficCongestion}%</span>
                    <span>Grid: {zone.metrics.gridLoad}%</span>
                    <span>Water: {zone.metrics.waterPressure} PSI</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-[#222222] mb-3">Asset Telemetry Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#222222] ring-1 ring-[#222222]'
                        : 'bg-white border-[#cfd9de] hover:border-[#808080]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#71767b]">{node.domain}</span>
                      <span className="text-[10px] font-mono text-[#444444] font-bold">{node.currentValue} {node.unit}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#222222]">{node.name}</h4>
                    <p className="text-[10px] font-mono text-[#71767b] mt-1">Lat: {node.lat}, Lng: {node.lng}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Asset Inspection Sheet */}
        <div className="bg-white border border-[#cfd9de] rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#222222]">Asset Inspection Sheet</h3>
            <p className="text-xs text-[#71767b] mt-0.5">Physical telemetry & operating specifications</p>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-3 bg-[#fafafa] border border-[#cfd9de] rounded-lg space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#71767b]">{selectedNode.domain} Asset</span>
                <h4 className="text-sm font-bold text-[#222222]">{selectedNode.name}</h4>
                <p className="text-xs text-[#444444] mt-1">{selectedNode.description}</p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-[#e8e8e8]">
                  <span className="text-[#71767b]">Current Reading</span>
                  <span className="font-bold text-[#222222]">{selectedNode.currentValue} {selectedNode.unit}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e8e8]">
                  <span className="text-[#71767b]">Rated Capacity</span>
                  <span className="font-bold text-[#222222]">{selectedNode.capacity}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e8e8]">
                  <span className="text-[#71767b]">Zone ID</span>
                  <span className="font-bold text-[#222222]">{selectedNode.zoneId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e8e8]">
                  <span className="text-[#71767b]">Operating State</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedNode.status === 'CRITICAL' ? 'bg-[#222222] text-white' : 'bg-[#e8e8e8] text-[#444444]'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#71767b] bg-[#fafafa] border border-[#cfd9de] rounded-lg">
              Click any infrastructure node to view live SCADA telemetry readouts and geographic coordinates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

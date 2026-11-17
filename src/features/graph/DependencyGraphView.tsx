import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Share2, Zap, Car, Droplet, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { InfrastructureNode } from '../../types/domain.types';

export const DependencyGraphView: React.FC = () => {
  const { nodes, edges } = useCityNexusStore();

  const [selectedDomain, setSelectedDomain] = useState<'all' | 'traffic' | 'electricity' | 'utilities'>('all');
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(nodes[0] || null);

  const filteredNodes = nodes.filter((n) => selectedDomain === 'all' || n.domain === selectedDomain);

  // Trace downstream blast radius
  const downstreamEdges = selectedNode ? edges.filter((e) => e.source === selectedNode.id) : [];
  const downstreamNodeIds = new Set(downstreamEdges.map((e) => e.target));

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
            <Share2 className="w-6 h-6 text-domain-trafficLight" />
            <span>Topological Infrastructure Dependency Graph</span>
          </h1>
          <p className="text-sm text-ink-muted">
            Directed property graph visualizing structural and operational couplings across municipal sectors.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 bg-surface-1 border border-hairline p-1 rounded-lg">
          {(['all', 'traffic', 'electricity', 'utilities'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                selectedDomain === d
                  ? 'bg-surface-2 text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Interactive Visual Graph Canvas */}
        <div className="lg:col-span-8 bg-surface-1 border border-hairline rounded-xl p-6 shadow-sm overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Active Infrastructure Nodes ({filteredNodes.length})
              </span>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-domain-trafficLight">
                  <span className="w-2.5 h-2.5 rounded-full bg-domain-traffic" /> Traffic
                </span>
                <span className="flex items-center gap-1.5 text-domain-electricityLight">
                  <span className="w-2.5 h-2.5 rounded-full bg-domain-electricity" /> Power Grid
                </span>
                <span className="flex items-center gap-1.5 text-domain-utilitiesLight">
                  <span className="w-2.5 h-2.5 rounded-full bg-domain-utilities" /> Water Mains
                </span>
              </div>
            </div>

            {/* Grid of Topological Component Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                const isDownstream = downstreamNodeIds.has(n.id);

                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-domain-traffic bg-surface-2 shadow-lg ring-1 ring-domain-traffic'
                        : isDownstream
                        ? 'border-status-critical/60 bg-status-critical/5'
                        : 'border-hairline bg-surface-1 hover:bg-surface-2/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        n.domain === 'traffic'
                          ? 'bg-domain-traffic/20 text-domain-trafficLight'
                          : n.domain === 'electricity'
                          ? 'bg-domain-electricity/20 text-domain-electricityLight'
                          : 'bg-domain-utilities/20 text-domain-utilitiesLight'
                      }`}>
                        {n.domain}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        n.status === 'CRITICAL'
                          ? 'bg-status-critical animate-ping'
                          : n.status === 'WARNING'
                          ? 'bg-status-warning'
                          : 'bg-status-normal'
                      }`} />
                    </div>

                    <h4 className="text-xs font-bold text-ink truncate mb-1">{n.name}</h4>
                    <p className="text-[11px] text-ink-muted truncate mb-3">{n.capacity}</p>

                    <div className="flex items-center justify-between text-[10px] text-ink-muted border-t border-hairline/40 pt-2">
                      <span>Zone: {n.zoneId}</span>
                      {isDownstream && (
                        <span className="text-status-critical font-bold">Cascades From Selected</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-ink-muted mt-6 pt-3 border-t border-hairline flex items-center justify-between">
            <span>Click any asset to trace direct upstream dependencies and calculate downstream blast radius.</span>
            <span className="font-semibold text-ink">Total Edges Active: {edges.length}</span>
          </div>
        </div>

        {/* Selected Node Blast Radius Detail Drawer */}
        <div className="lg:col-span-4 bg-surface-1 border border-hairline rounded-xl p-6 shadow-sm overflow-y-auto flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-ink-muted">
                    NODE SPECIFICATION
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    selectedNode.status === 'CRITICAL'
                      ? 'bg-status-critical/10 text-status-critical'
                      : 'bg-status-normal/10 text-status-normal'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink">{selectedNode.name}</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">{selectedNode.description}</p>
              </div>

              {/* Telemetry specs */}
              <div className="p-3 rounded-lg bg-surface-2 border border-hairline space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Operational Capacity:</span>
                  <span className="font-semibold text-ink">{selectedNode.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Current Output:</span>
                  <span className="font-bold text-ink">{selectedNode.currentValue} {selectedNode.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Geographic Coordinates:</span>
                  <span className="font-mono text-ink-muted text-[10px]">{selectedNode.lat}, {selectedNode.lng}</span>
                </div>
              </div>

              {/* Downstream Blast Radius List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 flex items-center justify-between">
                  <span>Downstream Blast Radius</span>
                  <span className="text-status-critical font-extrabold">{downstreamEdges.length} Assets</span>
                </h4>

                {downstreamEdges.length === 0 ? (
                  <p className="text-xs text-ink-muted italic py-3">Zero outgoing dependency edges mapped for this asset.</p>
                ) : (
                  <div className="space-y-2">
                    {downstreamEdges.map((e) => {
                      const target = nodes.find((n) => n.id === e.target);
                      return (
                        <div key={e.id} className="p-2.5 rounded-lg bg-surface-2 border border-status-critical/30 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold text-ink block">{target?.name || e.target}</span>
                            <span className="text-[10px] text-ink-muted capitalize">Coupling: {e.dependencyType} (wt: {e.weight})</span>
                          </div>
                          <span className="text-xs font-extrabold text-status-critical">
                            -{Math.round(e.propagationFactor * 100)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-ink-muted text-xs">
              Select an asset on the canvas to inspect its dependency relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Share2, ArrowRight } from 'lucide-react';
import { DomainType } from '../../types/domain.types';

export const DependencyGraphView: React.FC = () => {
  const { nodes, edges } = useCityNexusStore();

  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const filteredNodes = selectedDomain === 'all'
    ? nodes
    : nodes.filter((n) => n.domain === selectedDomain);

  // Compute blast radius for active node
  const blastRadiusNodes = activeNodeId
    ? edges.filter((e) => e.source === activeNodeId).map((e) => e.target)
    : [];

  const blastRadiusAssets = nodes.filter((n) => blastRadiusNodes.includes(n.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Share2 className="h-6 w-6 text-[#222222]" />
            Cross-Infrastructure Dependency Topology
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Directed node-link graph mapping couplings between Traffic, Power Grid, and Water utilities.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#cfd9de] rounded-lg">
          {(['all', 'traffic', 'electricity', 'utilities'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                selectedDomain === d
                  ? 'bg-[#222222] text-white'
                  : 'text-[#444444] hover:text-[#222222]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Nodes & Blast Radius Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#222222]">Infrastructure Asset Topology Nodes</h3>
              <span className="text-xs text-[#71767b]">Click a node to calculate downstream blast radius</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredNodes.map((node) => {
                const isSelected = activeNodeId === node.id;
                const isTarget = blastRadiusNodes.includes(node.id);

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNodeId(node.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#222222] ring-1 ring-[#222222] shadow-sm'
                        : isTarget
                        ? 'bg-[#fafafa] border-[#222222]'
                        : 'bg-white border-[#cfd9de] hover:border-[#808080]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#71767b]">
                        {node.domain}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        node.status === 'CRITICAL' ? 'bg-[#222222] text-white' : 'bg-[#e8e8e8] text-[#444444]'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#222222]">{node.name}</h4>
                    <p className="text-[11px] text-[#444444] mt-1 line-clamp-1">{node.description}</p>
                    <div className="mt-2 pt-2 border-t border-[#e8e8e8] flex items-center justify-between text-[10px] font-mono text-[#71767b]">
                      <span>Zone: {node.zoneId}</span>
                      <span>Cap: {node.capacity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Blast Radius Inspector */}
        <div className="bg-white border border-[#cfd9de] rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#222222]">Downstream Blast Radius Inspector</h3>
            <p className="text-xs text-[#71767b] mt-0.5">Assets coupled to selected infrastructure node</p>
          </div>

          {activeNodeId ? (
            <div className="space-y-3">
              <div className="p-3 bg-[#fafafa] border border-[#cfd9de] rounded-lg text-xs font-mono">
                <span className="text-[#71767b] block text-[10px] uppercase">Selected Root Node</span>
                <span className="font-bold text-[#222222] text-xs">
                  {nodes.find((n) => n.id === activeNodeId)?.name}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#71767b] uppercase tracking-wider block">
                  Coupled Outgoing Assets ({blastRadiusAssets.length})
                </span>
                {blastRadiusAssets.length === 0 ? (
                  <p className="text-xs text-[#71767b] italic">No direct outgoing dependent assets mapped.</p>
                ) : (
                  blastRadiusAssets.map((asset) => {
                    const edge = edges.find((e) => e.source === activeNodeId && e.target === asset.id);
                    return (
                      <div key={asset.id} className="p-3 border border-[#cfd9de] rounded-lg bg-white space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#222222]">{asset.name}</span>
                          <span className="capitalize font-mono text-[10px] text-[#71767b]">
                            {edge?.dependencyType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#444444]">
                          <span>Domain: {asset.domain}</span>
                          <span>Transfer: {((edge?.propagationFactor ?? 0.3) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#71767b] bg-[#fafafa] border border-[#cfd9de] rounded-lg">
              Select any infrastructure node to inspect outgoing dependency chains and propagation factors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

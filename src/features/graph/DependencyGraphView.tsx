import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Share2 } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <Share2 className="h-7 w-7 text-[#222222] dark:text-indigo-400" />
            Cross-Infrastructure Dependency Topology
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Directed node-link graph mapping couplings between Traffic, Power Grid, and Water utilities.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg overflow-x-auto max-w-full shrink-0">
          {(['all', 'traffic', 'electricity', 'utilities'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md capitalize transition-all ${
                selectedDomain === d
                  ? 'bg-[#222222] dark:bg-slate-700 text-white'
                  : 'text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-800'
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
          <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#222222] dark:text-slate-100">Infrastructure Asset Topology Nodes</h3>
              <span className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400">Click a node to calculate downstream blast radius</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredNodes.map((node) => {
                const isSelected = activeNodeId === node.id;
                const isTarget = blastRadiusNodes.includes(node.id);

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNodeId(node.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-[#222222] dark:border-blue-500 ring-2 ring-[#222222] dark:ring-blue-500 shadow-sm'
                        : isTarget
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 dark:border-amber-600'
                        : 'bg-white dark:bg-[#161f30] border-[#cfd9de] dark:border-slate-800 hover:border-[#808080] dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold uppercase text-[#71767b] dark:text-slate-400">
                        {node.domain}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                        node.status === 'CRITICAL' 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-[#e8e8e8] dark:bg-slate-800 text-[#444444] dark:text-slate-300'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#222222] dark:text-slate-100">{node.name}</h4>
                    <p className="text-xs sm:text-sm text-[#444444] dark:text-slate-300 mt-1 line-clamp-1">{node.description}</p>
                    <div className="mt-3 pt-2.5 border-t border-[#e8e8e8] dark:border-slate-800 flex items-center justify-between text-xs font-mono text-[#71767b] dark:text-slate-400">
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
        <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100">Downstream Blast Radius Inspector</h3>
            <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mt-0.5">Assets coupled to selected infrastructure node</p>
          </div>

          {activeNodeId ? (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-[#fafafa] dark:bg-slate-800/60 border border-[#cfd9de] dark:border-slate-700 rounded-lg text-sm font-mono">
                <span className="text-[#71767b] dark:text-slate-400 block text-xs uppercase">Selected Root Node</span>
                <span className="font-bold text-[#222222] dark:text-slate-100 text-sm">
                  {nodes.find((n) => n.id === activeNodeId)?.name}
                </span>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#71767b] dark:text-slate-400 uppercase tracking-wider block">
                  Coupled Outgoing Assets ({blastRadiusAssets.length})
                </span>
                {blastRadiusAssets.length === 0 ? (
                  <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 italic">No direct outgoing dependent assets mapped.</p>
                ) : (
                  blastRadiusAssets.map((asset) => {
                    const edge = edges.find((e) => e.source === activeNodeId && e.target === asset.id);
                    return (
                      <div key={asset.id} className="p-3.5 border border-[#cfd9de] dark:border-slate-800 rounded-lg bg-white dark:bg-[#161f30] space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-[#222222] dark:text-slate-100">{asset.name}</span>
                          <span className="capitalize font-mono text-xs text-[#71767b] dark:text-slate-400">
                            {edge?.dependencyType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-[#444444] dark:text-slate-300">
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
            <div className="p-8 text-center text-xs sm:text-sm text-[#71767b] dark:text-slate-400 bg-[#fafafa] dark:bg-slate-800/40 border border-[#cfd9de] dark:border-slate-800 rounded-lg leading-relaxed">
              Select any infrastructure node to inspect outgoing dependency chains and propagation factors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

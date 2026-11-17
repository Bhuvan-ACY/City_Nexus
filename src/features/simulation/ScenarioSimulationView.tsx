import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Sliders, Play, RotateCcw, AlertTriangle, ArrowRight, Zap, Car, Droplet } from 'lucide-react';
import { SimulationResult } from '../../types/domain.types';

export const ScenarioSimulationView: React.FC = () => {
  const { zones, runSimulation, simulationHistory } = useCityNexusStore();

  const [domain, setDomain] = useState<'traffic' | 'electricity' | 'utilities'>('traffic');
  const [zoneId, setZoneId] = useState<string>('ZONE_2');
  const [perturbation, setPerturbation] = useState<number>(30);
  const [activeResult, setActiveResult] = useState<SimulationResult | null>(
    simulationHistory.length > 0 ? simulationHistory[0] : null
  );

  const handleRun = () => {
    const res = runSimulation({
      targetDomain: domain,
      targetZone: zoneId,
      perturbationPct: perturbation,
    });
    setActiveResult(res);
  };

  const handleReset = () => {
    setPerturbation(0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
          <Sliders className="w-6 h-6 text-domain-electricityLight" />
          <span>Cascading Scenario Simulation Sandbox</span>
        </h1>
        <p className="text-sm text-ink-muted">
          Model non-linear perturbations across municipal networks to project downstream secondary and tertiary points of failure.
        </p>
      </div>

      {/* Control Configuration Panel */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">
          Simulation Input Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target Sector */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Target Municipal Sector</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDomain('traffic')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  domain === 'traffic'
                    ? 'bg-domain-traffic text-white border-domain-traffic shadow-md'
                    : 'bg-surface-2 text-ink-muted border-hairline hover:text-ink'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Traffic</span>
              </button>
              <button
                type="button"
                onClick={() => setDomain('electricity')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  domain === 'electricity'
                    ? 'bg-domain-electricity text-white border-domain-electricity shadow-md'
                    : 'bg-surface-2 text-ink-muted border-hairline hover:text-ink'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Power</span>
              </button>
              <button
                type="button"
                onClick={() => setDomain('utilities')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  domain === 'utilities'
                    ? 'bg-domain-utilities text-white border-domain-utilities shadow-md'
                    : 'bg-surface-2 text-ink-muted border-hairline hover:text-ink'
                }`}
              >
                <Droplet className="w-4 h-4" />
                <span>Water</span>
              </button>
            </div>
          </div>

          {/* Target Geographic Zone */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Target Geographic Sector</label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full bg-surface-2 border border-hairline rounded-lg px-3 py-2.5 text-xs text-ink font-semibold outline-none focus:border-domain-traffic"
            >
              <option value="ALL">All Metropolitan Zones (Global Event)</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.code})
                </option>
              ))}
            </select>
          </div>

          {/* Perturbation Magnitude */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-ink">Injected Perturbation Delta</label>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                perturbation > 0 ? 'bg-status-critical/10 text-status-critical' : 'bg-status-normal/10 text-status-normal'
              }`}>
                {perturbation > 0 ? `+${perturbation}%` : `${perturbation}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={perturbation}
              onChange={(e) => setPerturbation(Number(e.target.value))}
              className="w-full accent-domain-traffic cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-muted mt-1">
              <span>-50% (Shed/Closure)</span>
              <span>Baseline (0%)</span>
              <span>+100% (Surge Shock)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={handleRun}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-domain-traffic hover:bg-blue-600 text-white shadow-lg shadow-domain-traffic/25 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Compute Cascading Impact</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {activeResult && (
        <div className="space-y-6">
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-surface-1 border border-hairline p-5 rounded-xl">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
                Simulation Run ID
              </span>
              <span className="text-xl font-extrabold text-ink font-mono">{activeResult.runId}</span>
              <span className="text-[10px] text-ink-muted block mt-1">Executed: {new Date(activeResult.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="bg-surface-1 border border-hairline p-5 rounded-xl border-l-4 border-l-status-warning">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
                Affected Interconnected Assets
              </span>
              <span className="text-2xl font-extrabold text-status-warning">{activeResult.affectedAssetsCount} Components</span>
              <span className="text-[10px] text-ink-muted block mt-1">Spans power substations, traffic queues & pumps</span>
            </div>

            <div className="bg-surface-1 border border-hairline p-5 rounded-xl border-l-4 border-l-status-critical">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
                High Failure Risk Assets
              </span>
              <span className="text-2xl font-extrabold text-status-critical">{activeResult.criticalRiskCount} Critical</span>
              <span className="text-[10px] text-ink-muted block mt-1">Projected to breach emergency thresholds</span>
            </div>
          </div>

          {/* Baseline vs Projected Comparison Table */}
          <div className="bg-surface-1 border border-hairline rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink mb-1">Projected Sector Impacts</h3>
            <p className="text-xs text-ink-muted mb-4">Calculated baseline vs post-perturbation performance delta</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-hairline text-ink-muted uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Zone</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Baseline</th>
                    <th className="py-2.5 px-3">Projected Value</th>
                    <th className="py-2.5 px-3 text-right">Variance Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {activeResult.zoneDeltas.map((d, i) => (
                    <tr key={i} className="hover:bg-surface-2 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-ink">{d.zoneName}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-ink-muted">{d.domain}</td>
                      <td className="py-2.5 px-3">{d.baseline} {d.unit}</td>
                      <td className="py-2.5 px-3 font-bold text-ink">{d.projected} {d.unit}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-xs ${
                          d.deltaPct > 20
                            ? 'bg-status-critical/10 text-status-critical'
                            : d.deltaPct > 0
                            ? 'bg-status-warning/10 text-status-warning'
                            : 'bg-status-normal/10 text-status-normal'
                        }`}>
                          {d.deltaPct > 0 ? `+${d.deltaPct}%` : `${d.deltaPct}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cascading Chain Visual Breakdown */}
          {activeResult.cascadingChain.length > 0 && (
            <div className="bg-surface-1 border border-hairline rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-ink mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
                <span>Simulated Cascading Chain Propagation</span>
              </h3>
              <p className="text-xs text-ink-muted mb-4">Inter-system propagation paths identified by topological traversal</p>

              <div className="space-y-2">
                {activeResult.cascadingChain.map((chain, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-surface-2 border border-hairline text-xs">
                    <span className="font-bold text-ink">{chain.sourceName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    <span className="font-bold text-domain-trafficLight">{chain.targetName}</span>
                    <span className="text-[10px] text-ink-muted capitalize">({chain.domain})</span>
                    <span className="ml-auto font-extrabold text-status-critical text-xs">
                      +{chain.impact}% Propagated Load
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

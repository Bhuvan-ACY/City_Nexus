import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Sliders, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { DomainType } from '../../types/domain.types';

export const ScenarioSimulationView: React.FC = () => {
  const { zones, runSimulation, simulationHistory, resetSimulation } = useCityNexusStore();

  const [targetDomain, setTargetDomain] = useState<DomainType>('traffic');
  const [targetZone, setTargetZone] = useState<string>('ALL');
  const [perturbationPct, setPerturbationPct] = useState<number>(35);

  const activeResult = simulationHistory[0] || null;

  const handleRun = () => {
    runSimulation({
      targetDomain,
      targetZone,
      perturbationPct,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Sliders className="h-6 w-6 text-[#222222]" />
            Cross-Sector What-If Scenario Sandbox
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Test localized disruptions and calculate deterministic 1st and 2nd order cascading effects across connected infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {simulationHistory.length > 0 && (
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#e8e8e8]/50 border border-[#cfd9de] text-[#444444] text-xs font-semibold rounded-lg transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Simulation
            </button>
          )}
        </div>
      </div>

      {/* Control Panel: Perturbation Sliders */}
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h2 className="text-sm font-bold text-[#222222] mb-4">Simulation Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target Domain Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#71767b] uppercase tracking-wider block mb-2">
              Primary Perturbation Domain
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['traffic', 'electricity', 'utilities'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetDomain(d)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border capitalize transition-all ${
                    targetDomain === d
                      ? 'bg-[#222222] text-white border-[#0a0a0a]'
                      : 'bg-white text-[#444444] border-[#cfd9de] hover:border-[#808080]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Target Zone Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#71767b] uppercase tracking-wider block mb-2">
              Geographic Focus Zone
            </label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              aria-label="Geographic Focus Zone"
              className="w-full bg-white border border-[#cfd9de] text-xs font-semibold text-[#222222] rounded-lg p-2.5 focus:border-[#222222] focus:outline-none"
            >
              <option value="ALL">All Metropolitan Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Perturbation Percentage Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-[#71767b] uppercase tracking-wider">
                Perturbation Magnitude
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#e8e8e8] text-[#222222] border border-[#cfd9de]">
                {perturbationPct > 0 ? `+${perturbationPct}%` : `${perturbationPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={perturbationPct}
              onChange={(e) => setPerturbationPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e8e8e8] rounded-lg appearance-none cursor-pointer accent-[#222222]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#71767b] mt-1">
              <span>-50% (Capacity drop)</span>
              <span>+100% (Critical surge)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#222222] hover:bg-[#0a0a0a] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <span>Run Forward Cascade Model</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Simulation Results Section */}
      {activeResult && (
        <div className="space-y-6">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="At-Risk Assets Impacted"
              value={activeResult.affectedAssetsCount}
              deltaText="Calculated via network propagation"
              status={activeResult.affectedAssetsCount > 4 ? 'CRITICAL' : 'WARNING'}
              icon={AlertTriangle}
            />
            <KPICard
              title="High Risk Cascades"
              value={activeResult.criticalRiskCount}
              deltaText="Exceeding safe operating bounds"
              status={activeResult.criticalRiskCount > 0 ? 'CRITICAL' : 'NORMAL'}
              icon={AlertTriangle}
            />
            <KPICard
              title="Tested Perturbation"
              value={`${activeResult.parameters.perturbationPct > 0 ? '+' : ''}${activeResult.parameters.perturbationPct}%`}
              unit={activeResult.parameters.targetDomain.toUpperCase()}
              deltaText={`Target: ${activeResult.parameters.targetZone}`}
              status="NORMAL"
              icon={Sliders}
            />
          </div>

          {/* Before vs After Projected Impact Table */}
          <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[#222222] mb-3">Zone Projected Impact Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#222222]">
                <thead className="text-[11px] text-[#71767b] bg-[#fafafa] uppercase border-b border-[#cfd9de]">
                  <tr>
                    <th className="py-2.5 px-3">Metropolitan Zone</th>
                    <th className="py-2.5 px-3">Primary Domain</th>
                    <th className="py-2.5 px-3">Baseline</th>
                    <th className="py-2.5 px-3">Projected State</th>
                    <th className="py-2.5 px-3">Net Delta</th>
                    <th className="py-2.5 px-3">Risk Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e8e8] font-mono">
                  {activeResult.zoneDeltas.map((zd) => {
                    const isSevere = Math.abs(zd.deltaPct) > 25;
                    return (
                      <tr key={zd.zoneId} className="hover:bg-[#fafafa]">
                        <td className="py-2.5 px-3 font-medium font-sans text-[#222222]">{zd.zoneName}</td>
                        <td className="py-2.5 px-3 capitalize font-sans text-[#444444]">{zd.domain}</td>
                        <td className="py-2.5 px-3 text-[#71767b]">{zd.baseline} {zd.unit}</td>
                        <td className="py-2.5 px-3 font-bold text-[#222222]">{zd.projected} {zd.unit}</td>
                        <td className="py-2.5 px-3">
                          <span className={zd.deltaPct > 0 ? 'text-[#0a0a0a] font-bold' : 'text-[#444444]'}>
                            {zd.deltaPct > 0 ? `+${zd.deltaPct}%` : `${zd.deltaPct}%`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isSevere 
                              ? 'bg-[#222222] text-white' 
                              : 'bg-[#e8e8e8] text-[#444444]'
                          }`}>
                            {isSevere ? 'Severe Risk' : 'Manageable'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cascading Chain Visualization */}
          <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[#222222] mb-3">Modeled Downstream Ripple Sequence</h3>
            <div className="space-y-2">
              {activeResult.cascadingChain.map((chain, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-[#cfd9de] bg-[#fafafa] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e8e8e8] text-[#444444] font-bold">
                      Order {idx + 1}
                    </span>
                    <span className="font-semibold text-[#222222]">{chain.sourceName}</span>
                    <ArrowRight className="h-3 w-3 text-[#71767b]" />
                    <span className="font-semibold text-[#222222]">{chain.targetName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="capitalize font-mono text-[11px] text-[#71767b]">[{chain.domain}]</span>
                    <span className="font-mono font-bold text-[#222222]">+{chain.impact}% Stress</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

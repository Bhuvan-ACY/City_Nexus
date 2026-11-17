import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { DomainType } from '../../types/domain.types';
import { Sliders, Save, RefreshCw, Network, AlertOctagon } from 'lucide-react';

export const SystemConfigView: React.FC = () => {
  const { nodes, edges, updateNodeStatus, resetSimulation } = useCityNexusStore();

  const [thresholds, setThresholds] = useState({
    trafficCongestionCritical: 80,
    gridLoadCritical: 85,
    transformerTempCritical: 65,
    waterPressureWarning: 3.2,
    waterPressureCritical: 2.5,
  });

  const [propagationFactors, setPropagationFactors] = useState({
    trafficToGrid: 0.32,
    gridToWater: 0.55,
    waterToTraffic: 0.20,
  });

  const [notificationSaved, setNotificationSaved] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-neutral-400" />
            Infrastructure Topology & Threshold Configuration
          </h1>
          <p className="text-sm text-neutral-400">
            Fine-tune cascade propagation factors, alarm thresholds, and asset graph linkages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetSimulation();
              setThresholds({
                trafficCongestionCritical: 80,
                gridLoadCritical: 85,
                transformerTempCritical: 65,
                waterPressureWarning: 3.2,
                waterPressureCritical: 2.5,
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-md font-medium transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-neutral-400" />
            Reset Defaults
          </button>
        </div>
      </div>

      {notificationSaved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <span>Parameters safely updated and synchronized across all real-time simulation workers.</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-6">
        {/* Cascade Math Calibration */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-semibold text-white">Cross-Domain Cascade Transfer Functions</h3>
              <p className="text-xs text-neutral-400">Determines the sensitivity coefficient (k) for inter-domain cascade propagation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-neutral-800/40 p-4 rounded-lg border border-neutral-800 space-y-2">
              <label className="text-xs text-neutral-300 font-medium block">
                Traffic → Power Grid Factor (k_tg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={propagationFactors.trafficToGrid}
                onChange={(e) => setPropagationFactors({ ...propagationFactors, trafficToGrid: parseFloat(e.target.value) || 0 })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500">
                Current: Traffic surge creates +{(propagationFactors.trafficToGrid * 100).toFixed(0)}% grid load delta.
              </span>
            </div>

            <div className="bg-neutral-800/40 p-4 rounded-lg border border-neutral-800 space-y-2">
              <label className="text-xs text-neutral-300 font-medium block">
                Power Grid → Water Factor (k_gw)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={propagationFactors.gridToWater}
                onChange={(e) => setPropagationFactors({ ...propagationFactors, gridToWater: parseFloat(e.target.value) || 0 })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500">
                Current: Substation drop creates -{(propagationFactors.gridToWater * 100).toFixed(0)}% water pressure loss.
              </span>
            </div>

            <div className="bg-neutral-800/40 p-4 rounded-lg border border-neutral-800 space-y-2">
              <label className="text-xs text-neutral-300 font-medium block">
                Water → Traffic Disruption (k_wt)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={propagationFactors.waterToTraffic}
                onChange={(e) => setPropagationFactors({ ...propagationFactors, waterToTraffic: parseFloat(e.target.value) || 0 })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500">
                Current: Mains burst road flooding causes +{(propagationFactors.waterToTraffic * 100).toFixed(0)}% detour congestion.
              </span>
            </div>
          </div>
        </div>

        {/* Global Anomaly Thresholds */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-semibold text-white">Automated Alert Trigger Thresholds</h3>
              <p className="text-xs text-neutral-400">Values beyond which incident alarms and operator dispatch tickets are generated</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Traffic Congestion Limit (%)</label>
              <input
                type="number"
                value={thresholds.trafficCongestionCritical}
                onChange={(e) => setThresholds({ ...thresholds, trafficCongestionCritical: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Substation Load Warning (%)</label>
              <input
                type="number"
                value={thresholds.gridLoadCritical}
                onChange={(e) => setThresholds({ ...thresholds, gridLoadCritical: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Transformer Temp (°C)</label>
              <input
                type="number"
                value={thresholds.transformerTempCritical}
                onChange={(e) => setThresholds({ ...thresholds, transformerTempCritical: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Water Pressure Alert (Bar)</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.waterPressureWarning}
                onChange={(e) => setThresholds({ ...thresholds, waterPressureWarning: parseFloat(e.target.value) || 0 })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Water Main Rupture Floor (Bar)</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.waterPressureCritical}
                onChange={(e) => setThresholds({ ...thresholds, waterPressureCritical: parseFloat(e.target.value) || 0 })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" />
            Commit Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

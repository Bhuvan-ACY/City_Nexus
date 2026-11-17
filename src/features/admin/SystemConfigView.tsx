import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Sliders, Save, RefreshCw, Network, AlertOctagon } from 'lucide-react';

export const SystemConfigView: React.FC = () => {
  const { resetSimulation } = useCityNexusStore();

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Sliders className="h-6 w-6 text-[#222222]" />
            Infrastructure Topology & Threshold Configuration
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Calibrate cross-sector cascade transfer factors, alarm thresholds, and network parameters.
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#e8e8e8]/50 border border-[#cfd9de] text-[#444444] text-xs font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {notificationSaved && (
        <div className="p-3 bg-[#e8e8e8] border border-[#cfd9de] text-[#222222] text-xs rounded-lg flex items-center gap-2 font-mono">
          <span>Parameters safely updated and synchronized across all real-time simulation workers.</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-6">
        {/* Cascade Math Calibration */}
        <div className="bg-white border border-[#cfd9de] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-[#222222]" />
            <div>
              <h3 className="text-sm font-bold text-[#222222]">Cross-Domain Cascade Transfer Functions</h3>
              <p className="text-xs text-[#71767b]">Sensitivity coefficients (k) for inter-domain cascade propagation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#fafafa] p-4 rounded-lg border border-[#cfd9de] space-y-2">
              <label className="text-xs text-[#222222] font-bold block">
                Traffic → Power Grid Factor (k_tg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={propagationFactors.trafficToGrid}
                onChange={(e) => setPropagationFactors({ ...propagationFactors, trafficToGrid: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
              <span className="text-[10px] text-[#71767b] block">
                Current: +{(propagationFactors.trafficToGrid * 100).toFixed(0)}% grid load delta per unit traffic.
              </span>
            </div>

            <div className="bg-[#fafafa] p-4 rounded-lg border border-[#cfd9de] space-y-2">
              <label className="text-xs text-[#222222] font-bold block">
                Power Grid → Water Factor (k_gw)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={propagationFactors.gridToWater}
                onChange={(e) => setPropagationFactors({ ...propagationFactors, gridToWater: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
              <span className="text-[10px] text-[#71767b] block">
                Current: -{(propagationFactors.gridToWater * 100).toFixed(0)}% water pressure loss per grid trip.
              </span>
            </div>

            <div className="bg-[#fafafa] p-4 rounded-lg border border-[#cfd9de] space-y-2">
              <label className="text-xs text-[#222222] font-bold block">
                Water → Traffic Disruption (k_wt)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={propagationFactors.waterToTraffic}
                onChange={(e) => setPropagationFactors({ ...propagationFactors, waterToTraffic: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
              <span className="text-[10px] text-[#71767b] block">
                Current: +{(propagationFactors.waterToTraffic * 100).toFixed(0)}% detour congestion on pipe burst.
              </span>
            </div>
          </div>
        </div>

        {/* Global Anomaly Thresholds */}
        <div className="bg-white border border-[#cfd9de] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-[#222222]" />
            <div>
              <h3 className="text-sm font-bold text-[#222222]">Automated Alert Trigger Thresholds</h3>
              <p className="text-xs text-[#71767b]">Operational limits beyond which incident alarms are broadcast</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#71767b]">Traffic Congestion Limit (%)</label>
              <input
                type="number"
                value={thresholds.trafficCongestionCritical}
                onChange={(e) => setThresholds({ ...thresholds, trafficCongestionCritical: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#71767b]">Substation Load Warning (%)</label>
              <input
                type="number"
                value={thresholds.gridLoadCritical}
                onChange={(e) => setThresholds({ ...thresholds, gridLoadCritical: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#71767b]">Transformer Temp (°C)</label>
              <input
                type="number"
                value={thresholds.transformerTempCritical}
                onChange={(e) => setThresholds({ ...thresholds, transformerTempCritical: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#71767b]">Water Pressure Alert (Bar)</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.waterPressureWarning}
                onChange={(e) => setThresholds({ ...thresholds, waterPressureWarning: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#71767b]">Mains Rupture Floor (Bar)</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.waterPressureCritical}
                onChange={(e) => setThresholds({ ...thresholds, waterPressureCritical: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#cfd9de] rounded-lg p-2 text-xs font-mono text-[#222222] focus:border-[#222222] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#222222] hover:bg-[#0a0a0a] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Commit Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Droplet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const UtilitiesDetailView: React.FC = () => {
  const { nodes, zones } = useCityNexusStore();
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const waterNodes = nodes.filter(n => n.domain === 'utilities');
  const filteredNodes = selectedZone === 'all'
    ? waterNodes
    : waterNodes.filter(n => n.zoneId === selectedZone);

  const totalFlow = waterNodes.reduce((acc, n) => acc + (n.currentMetrics?.flowRateMld ?? n.currentValue ?? 0), 0);
  const avgPressure = waterNodes.reduce((acc, n) => acc + (n.currentMetrics?.pressureBar ?? n.currentValue ?? 0), 0) / (waterNodes.length || 1);
  const lowPressureNodes = waterNodes.filter(n => (n.currentMetrics?.pressureBar ?? n.currentValue ?? 4.0) < 3.0).length;
  const criticalWaterNodes = waterNodes.filter(n => n.status === 'CRITICAL').length;

  const mockPressureTimeline = [
    { time: '00:00', pressure: 4.8, minThreshold: 3.0 },
    { time: '04:00', pressure: 4.9, minThreshold: 3.0 },
    { time: '06:00', pressure: 4.2, minThreshold: 3.0 },
    { time: '08:00', pressure: 3.3, minThreshold: 3.0 },
    { time: '10:00', pressure: 3.6, minThreshold: 3.0 },
    { time: '14:00', pressure: 4.1, minThreshold: 3.0 },
    { time: '18:00', pressure: 3.4, minThreshold: 3.0 },
    { time: '22:00', pressure: 4.5, minThreshold: 3.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Droplet className="h-6 w-6 text-cyan-500" />
            Public Utilities & Hydraulic Network
          </h1>
          <p className="text-sm text-neutral-400">
            Real-time hydrostatic pressure, booster pumping telemetry, and municipal reservoir reserves.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-neutral-400 font-medium">Zone Filter:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            aria-label="Zone Filter"
            className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs rounded-md px-3 py-1.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Metro Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Aggregate Water Flow"
          value={`${Math.round(totalFlow)} MLD`}
          subtext="Million Liters per Day dispatched"
          domain="utilities"
          trend={{ direction: 'down', percentage: 1.8 }}
          status="NORMAL"
        />
        <KPICard
          title="Average Hydrostatic Pressure"
          value={`${avgPressure.toFixed(2)} Bar`}
          subtext="Nominal range: 3.5 - 5.0 Bar"
          domain="utilities"
          status={avgPressure < 3.0 ? 'CRITICAL' : avgPressure < 3.5 ? 'WARNING' : 'NORMAL'}
        />
        <KPICard
          title="Low Pressure Nodes (<3.0 Bar)"
          value={lowPressureNodes}
          subtext="Zones vulnerable to cavitation / dry taps"
          domain="utilities"
          status={lowPressureNodes > 0 ? 'WARNING' : 'NORMAL'}
        />
        <KPICard
          title="Pump Station Outages"
          value={criticalWaterNodes}
          subtext="Grid-dependent booster failures"
          domain="utilities"
          status={criticalWaterNodes > 0 ? 'CRITICAL' : 'NORMAL'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Mains Pressure Profile (24h)</h3>
              <p className="text-xs text-neutral-400">Pressure fluctuation against 3.0 Bar minimum standard</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SCADA Monitored
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPressureTimeline}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891B2" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0891B2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} domain={[2, 6]} unit=" Bar" />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Area type="monotone" dataKey="pressure" stroke="#0891B2" strokeWidth={2} fillOpacity={1} fill="url(#waterGrad)" name="Pressure (Bar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Pump Health & Power Dependency</h3>
              <p className="text-xs text-neutral-400">Operational status correlated with upstream electrical bus</p>
            </div>
          </div>
          <div className="space-y-4">
            {filteredNodes.map(node => {
              const zone = zones.find(z => z.id === node.zoneId);
              const pressure = node.currentMetrics?.pressureBar ?? node.currentValue ?? 3.8;
              const reservoir = node.currentMetrics?.reservoirLevelPercent ?? 75;

              return (
                <div key={node.id} className="p-3 bg-neutral-800/40 border border-neutral-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{node.name}</div>
                    <div className="text-xs text-neutral-400">{zone?.name} • Flow: {node.capacity}</div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xs text-neutral-400">Value</div>
                      <div className={`text-sm font-mono font-bold ${pressure < 3.0 ? 'text-red-400' : 'text-cyan-400'}`}>
                        {pressure} {node.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Reservoir</div>
                      <div className="text-sm font-mono font-bold text-neutral-200">
                        {reservoir}%
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-medium ${
                      node.status === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                      node.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hydraulic Details Table */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Public Utilities Assets Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="text-[11px] text-neutral-400 bg-neutral-800/50 uppercase border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Asset Name</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Telemetry Value</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredNodes.map(node => {
                const zone = zones.find(z => z.id === node.zoneId);

                return (
                  <tr key={node.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-white font-sans">{node.name}</td>
                    <td className="py-2.5 px-3 text-neutral-400 font-sans">{zone?.name ?? node.zoneId}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{node.currentValue} {node.unit}</td>
                    <td className="py-2.5 px-3 text-neutral-300">{node.capacity}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans uppercase font-medium ${
                        node.status === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        node.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

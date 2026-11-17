import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Droplet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const UtilitiesDetailView: React.FC = () => {
  const { nodes, zones, theme } = useCityNexusStore();
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
    { time: '00:00', pressure: 4.8 },
    { time: '04:00', pressure: 4.9 },
    { time: '06:00', pressure: 4.2 },
    { time: '08:00', pressure: 3.3 },
    { time: '10:00', pressure: 3.6 },
    { time: '14:00', pressure: 4.1 },
    { time: '18:00', pressure: 3.4 },
    { time: '22:00', pressure: 4.5 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <Droplet className="h-7 w-7 text-[#222222] dark:text-sky-400" />
            Public Utilities & Hydraulic Network
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Real-time hydrostatic pressure, booster pumping telemetry, and municipal reservoir reserves.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#71767b] dark:text-slate-400 uppercase">Zone:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            aria-label="Zone Filter"
            className="bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-sm font-semibold text-[#222222] dark:text-slate-100 rounded-lg px-3 py-1.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none"
          >
            <option value="all">All Metropolitan Zones</option>
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
          trend={{ direction: 'down', percentage: 1.8 }}
          status="NORMAL"
          icon={Droplet}
        />
        <KPICard
          title="Average Hydrostatic Pressure"
          value={`${avgPressure.toFixed(2)} Bar`}
          subtext="Nominal range: 3.5 - 5.0 Bar"
          status={avgPressure < 3.0 ? 'CRITICAL' : avgPressure < 3.5 ? 'WARNING' : 'NORMAL'}
          icon={Droplet}
        />
        <KPICard
          title="Low Pressure Nodes (<3.0 Bar)"
          value={lowPressureNodes}
          subtext="Cavitation risk points"
          status={lowPressureNodes > 0 ? 'WARNING' : 'NORMAL'}
          icon={Droplet}
        />
        <KPICard
          title="Pump Outages"
          value={criticalWaterNodes}
          subtext="Booster failures"
          status={criticalWaterNodes > 0 ? 'CRITICAL' : 'NORMAL'}
          icon={Droplet}
        />
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
        <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-1">Mains Pressure Profile (24h)</h3>
        <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mb-4">Pressure fluctuation against 3.0 Bar minimum standard</p>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPressureTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e8e8e8'} />
              <XAxis dataKey="time" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} />
              <YAxis stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} domain={[2, 6]} unit=" Bar" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                  borderColor: isDark ? '#475569' : '#cfd9de', 
                  color: isDark ? '#f8fafc' : '#222222',
                  fontSize: '13px',
                  borderRadius: '8px',
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="pressure" 
                stroke={isDark ? '#38bdf8' : '#222222'} 
                strokeWidth={2} 
                fill={isDark ? '#0284c7' : '#e8e8e8'} 
                fillOpacity={isDark ? 0.3 : 0.6}
                name="Pressure (Bar)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assets Matrix */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
        <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-3">Public Utilities Assets Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] dark:bg-slate-800/80 text-[#71767b] dark:text-slate-400 text-xs uppercase border-b border-[#cfd9de] dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Asset Name</th>
                <th className="py-3 px-3.5">Zone</th>
                <th className="py-3 px-3.5">Telemetry Value</th>
                <th className="py-3 px-3.5">Capacity</th>
                <th className="py-3 px-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {filteredNodes.map(node => {
                const zone = zones.find(z => z.id === node.zoneId);

                return (
                  <tr key={node.id} className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3.5 font-sans font-medium text-[#222222] dark:text-slate-100">{node.name}</td>
                    <td className="py-3 px-3.5 font-sans text-[#71767b] dark:text-slate-400">{zone?.name ?? node.zoneId}</td>
                    <td className="py-3 px-3.5 font-bold text-[#222222] dark:text-slate-100">{node.currentValue} {node.unit}</td>
                    <td className="py-3 px-3.5 text-[#71767b] dark:text-slate-400">{node.capacity}</td>
                    <td className="py-3 px-3.5 font-sans">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        node.status === 'CRITICAL' 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-[#e8e8e8] dark:bg-slate-800 text-[#444444] dark:text-slate-300'
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

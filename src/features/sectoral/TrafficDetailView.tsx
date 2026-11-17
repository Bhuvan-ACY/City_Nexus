import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Car, Navigation, Gauge } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const TrafficDetailView: React.FC = () => {
  const { nodes, zones, theme } = useCityNexusStore();
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const trafficNodes = nodes.filter((n) => n.domain === 'traffic');
  const filteredNodes = selectedZone === 'all'
    ? trafficNodes
    : trafficNodes.filter((n) => n.zoneId === selectedZone);

  const avgCongestion = Math.round(
    trafficNodes.reduce((acc, n) => acc + (n.currentMetrics?.congestionIndex ?? n.currentValue), 0) / (trafficNodes.length || 1)
  );
  const avgSpeed = Math.round(
    trafficNodes.reduce((acc, n) => acc + (n.currentMetrics?.speedKmh ?? 24), 0) / (trafficNodes.length || 1)
  );

  const mockTimeline = [
    { time: '06:00', volume: 2200, congestion: 42 },
    { time: '08:00', volume: 5400, congestion: 88 },
    { time: '10:00', volume: 4600, congestion: 74 },
    { time: '12:00', volume: 3800, congestion: 58 },
    { time: '14:00', volume: 3900, congestion: 60 },
    { time: '17:00', volume: 5800, congestion: 92 },
    { time: '19:00', volume: 5200, congestion: 84 },
    { time: '21:00', volume: 3100, congestion: 48 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <Car className="h-7 w-7 text-[#222222] dark:text-slate-200" />
            Urban Mobility & Arterial Traffic Console
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Real-time congestion indexing, signal cycle monitoring, and EV charging queue stress analysis.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Average Congestion Index"
          value={`${avgCongestion}%`}
          deltaText="Peak arterial corridors"
          status={avgCongestion > 80 ? 'CRITICAL' : 'WARNING'}
          icon={Car}
        />
        <KPICard
          title="Average Traffic Velocity"
          value={`${avgSpeed} km/h`}
          deltaText="Nominal urban target: 35 km/h"
          status={avgSpeed < 20 ? 'CRITICAL' : 'NORMAL'}
          icon={Gauge}
        />
        <KPICard
          title="Monitored Corridors"
          value={filteredNodes.length}
          deltaText="Sensor arrays reporting"
          status="NORMAL"
          icon={Navigation}
        />
      </div>

      {/* 24-Hour Diurnal Chart */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
        <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-1">24-Hour Congestion & Flow Curve</h3>
        <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mb-4">Volume (Vehicles/Hour) correlated with Congestion Index (%)</p>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e8e8e8'} />
              <XAxis dataKey="time" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} />
              <YAxis stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} domain={[0, 100]} unit="%" />
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
                dataKey="congestion" 
                stroke={isDark ? '#38bdf8' : '#222222'} 
                strokeWidth={2} 
                fill={isDark ? '#0369a1' : '#e8e8e8'} 
                fillOpacity={isDark ? 0.3 : 0.6}
                name="Congestion %" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Corridor Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
        <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-3">Arterial Corridor Telemetry Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] dark:bg-slate-800/80 text-[#71767b] dark:text-slate-400 text-xs uppercase border-b border-[#cfd9de] dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Corridor Junction</th>
                <th className="py-3 px-3.5">Zone</th>
                <th className="py-3 px-3.5">Capacity</th>
                <th className="py-3 px-3.5">Congestion</th>
                <th className="py-3 px-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {filteredNodes.map((node) => (
                <tr key={node.id} className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3.5 font-sans font-medium text-[#222222] dark:text-slate-100">{node.name}</td>
                  <td className="py-3 px-3.5 font-sans text-[#71767b] dark:text-slate-400">{node.zoneId}</td>
                  <td className="py-3 px-3.5 text-[#444444] dark:text-slate-300">{node.capacity}</td>
                  <td className="py-3 px-3.5 font-bold text-[#222222] dark:text-slate-100">{node.currentValue}%</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

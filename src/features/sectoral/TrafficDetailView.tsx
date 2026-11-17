import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Car, Navigation, Gauge, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const TrafficDetailView: React.FC = () => {
  const { nodes, zones } = useCityNexusStore();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Car className="h-6 w-6 text-[#222222]" />
            Urban Mobility & Arterial Traffic Console
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Real-time congestion indexing, signal cycle monitoring, and EV charging queue stress analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-[#71767b] uppercase">Zone:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            aria-label="Zone Filter"
            className="bg-white border border-[#cfd9de] text-xs font-semibold text-[#222222] rounded-lg px-3 py-1.5 focus:border-[#222222] focus:outline-none"
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
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[#222222] mb-1">24-Hour Congestion & Flow Curve</h3>
        <p className="text-xs text-[#71767b] mb-4">Volume (Vehicles/Hour) correlated with Congestion Index (%)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey="time" stroke="#71767b" fontSize={11} />
              <YAxis stroke="#71767b" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cfd9de', fontSize: '12px' }} />
              <Area type="monotone" dataKey="congestion" stroke="#222222" strokeWidth={2} fill="#e8e8e8" name="Congestion %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Corridor Table */}
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[#222222] mb-3">Arterial Corridor Telemetry Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafafa] text-[#71767b] text-[10px] uppercase border-b border-[#cfd9de]">
              <tr>
                <th className="py-2.5 px-3">Corridor Junction</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Congestion</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] font-mono text-[11px]">
              {filteredNodes.map((node) => (
                <tr key={node.id} className="hover:bg-[#fafafa]">
                  <td className="py-2.5 px-3 font-sans font-medium text-[#222222]">{node.name}</td>
                  <td className="py-2.5 px-3 font-sans text-[#71767b]">{node.zoneId}</td>
                  <td className="py-2.5 px-3 text-[#444444]">{node.capacity}</td>
                  <td className="py-2.5 px-3 font-bold text-[#222222]">{node.currentValue}%</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      node.status === 'CRITICAL' ? 'bg-[#222222] text-white' : 'bg-[#e8e8e8] text-[#444444]'
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

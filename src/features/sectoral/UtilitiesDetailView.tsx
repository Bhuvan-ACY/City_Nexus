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
    { time: '00:00', pressure: 4.8 },
    { time: '04:00', pressure: 4.9 },
    { time: '06:00', pressure: 4.2 },
    { time: '08:00', pressure: 3.3 },
    { time: '10:00', pressure: 3.6 },
    { time: '14:00', pressure: 4.1 },
    { time: '18:00', pressure: 3.4 },
    { time: '22:00', pressure: 4.5 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Droplet className="h-6 w-6 text-[#222222]" />
            Public Utilities & Hydraulic Network
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Real-time hydrostatic pressure, booster pumping telemetry, and municipal reservoir reserves.
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
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[#222222] mb-1">Mains Pressure Profile (24h)</h3>
        <p className="text-xs text-[#71767b] mb-4">Pressure fluctuation against 3.0 Bar minimum standard</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPressureTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey="time" stroke="#71767b" fontSize={11} />
              <YAxis stroke="#71767b" fontSize={11} domain={[2, 6]} unit=" Bar" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cfd9de', fontSize: '12px' }} />
              <Area type="monotone" dataKey="pressure" stroke="#222222" strokeWidth={2} fill="#e8e8e8" name="Pressure (Bar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assets Matrix */}
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[#222222] mb-3">Public Utilities Assets Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafafa] text-[#71767b] text-[10px] uppercase border-b border-[#cfd9de]">
              <tr>
                <th className="py-2.5 px-3">Asset Name</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Telemetry Value</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] font-mono text-[11px]">
              {filteredNodes.map(node => {
                const zone = zones.find(z => z.id === node.zoneId);

                return (
                  <tr key={node.id} className="hover:bg-[#fafafa]">
                    <td className="py-2.5 px-3 font-sans font-medium text-[#222222]">{node.name}</td>
                    <td className="py-2.5 px-3 font-sans text-[#71767b]">{zone?.name ?? node.zoneId}</td>
                    <td className="py-2.5 px-3 font-bold text-[#222222]">{node.currentValue} {node.unit}</td>
                    <td className="py-2.5 px-3 text-[#71767b]">{node.capacity}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        node.status === 'CRITICAL' ? 'bg-[#222222] text-white' : 'bg-[#e8e8e8] text-[#444444]'
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

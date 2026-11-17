import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Zap, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export const ElectricityDetailView: React.FC = () => {
  const { nodes, zones } = useCityNexusStore();
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const electricNodes = nodes.filter(n => n.domain === 'electricity');
  const filteredNodes = selectedZone === 'all' 
    ? electricNodes 
    : electricNodes.filter(n => n.zoneId === selectedZone);

  const totalLoad = electricNodes.reduce((acc, n) => acc + (n.currentMetrics?.loadMw ?? n.currentValue ?? 0), 0);
  const totalCapacity = electricNodes.reduce((acc, n) => acc + (n.currentMetrics?.capacityMw ?? 100), 0);
  const avgLoadPercent = totalCapacity > 0 ? (totalLoad / totalCapacity) * 100 : 0;
  const criticalFeeders = electricNodes.filter(n => (n.currentMetrics?.loadPercentage ?? (n.currentValue / 100) * 100) > 85).length;
  const highTempFeeders = electricNodes.filter(n => (n.currentMetrics?.temperatureC ?? 45) > 65).length;

  const mockLoadTimeline = [
    { time: '00:00', load: 820 },
    { time: '04:00', load: 740 },
    { time: '08:00', load: 1040 },
    { time: '12:00', load: 1220 },
    { time: '14:00', load: 1290 },
    { time: '18:00', load: 1380 },
    { time: '20:00', load: 1250 },
    { time: '22:00', load: 980 },
  ];

  const zoneLoadComparison = zones.map(z => {
    const zNodes = electricNodes.filter(n => n.zoneId === z.id);
    const zLoad = zNodes.reduce((sum, n) => sum + (n.currentMetrics?.loadMw ?? n.currentValue ?? 0), 0);
    const zCap = zNodes.reduce((sum, n) => sum + (n.currentMetrics?.capacityMw ?? 100), 0);
    return {
      name: z.name.replace(' Corridor', '').replace(' District', ''),
      load: Math.round(zLoad),
      capacity: Math.round(zCap),
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#222222]" />
            Metropolitan Power Grid Telemetry
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Real-time thermal capacity, transmission bus loading, and EV substation stress analytics.
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

      {/* KPI Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Grid Aggregate Load"
          value={`${Math.round(totalLoad)} MW`}
          subtext={`of ${Math.round(totalCapacity)} MW Installed Capacity`}
          trend={{ direction: 'up', percentage: 4.8 }}
          status={avgLoadPercent > 80 ? 'CRITICAL' : avgLoadPercent > 65 ? 'WARNING' : 'NORMAL'}
          icon={Zap}
        />
        <KPICard
          title="Substation Utilization"
          value={`${avgLoadPercent.toFixed(1)}%`}
          subtext="Aggregate peak capacity"
          status={avgLoadPercent > 85 ? 'CRITICAL' : 'NORMAL'}
          icon={Zap}
        />
        <KPICard
          title="Critical Feeders"
          value={criticalFeeders}
          subtext="Exceeding 85% rated limits"
          status={criticalFeeders > 0 ? 'CRITICAL' : 'NORMAL'}
          icon={Zap}
        />
        <KPICard
          title="Thermal Hotspots (>65°C)"
          value={highTempFeeders}
          subtext="Transformer cooling alerts"
          status={highTempFeeders > 0 ? 'WARNING' : 'NORMAL'}
          icon={Flame}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
          <h3 className="text-sm font-bold text-[#222222] mb-1">24-Hour Diurnal Demand Curve</h3>
          <p className="text-xs text-[#71767b] mb-4">Metropolitan power draw (MW)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLoadTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="time" stroke="#71767b" fontSize={11} />
                <YAxis stroke="#71767b" fontSize={11} domain={[500, 1500]} unit=" MW" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cfd9de', fontSize: '12px' }} />
                <Area type="monotone" dataKey="load" stroke="#222222" strokeWidth={2} fill="#e8e8e8" name="Total MW" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
          <h3 className="text-sm font-bold text-[#222222] mb-1">Capacity Allocation by Zone</h3>
          <p className="text-xs text-[#71767b] mb-4">Current load compared to design limit</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneLoadComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="name" stroke="#71767b" fontSize={10} />
                <YAxis stroke="#71767b" fontSize={11} unit=" MW" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cfd9de', fontSize: '12px' }} />
                <Bar dataKey="load" fill="#222222" radius={[4, 4, 0, 0]} name="Load (MW)" />
                <Bar dataKey="capacity" fill="#cfd9de" radius={[4, 4, 0, 0]} name="Capacity (MW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Substation Table */}
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[#222222] mb-3">Substation & Feeder Telemetry Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafafa] text-[#71767b] text-[10px] uppercase border-b border-[#cfd9de]">
              <tr>
                <th className="py-2.5 px-3">Substation / Asset</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Load</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Temp</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] font-mono text-[11px]">
              {filteredNodes.map(node => {
                const temp = node.currentMetrics?.temperatureC ?? 45;
                const zone = zones.find(z => z.id === node.zoneId);

                return (
                  <tr key={node.id} className="hover:bg-[#fafafa]">
                    <td className="py-2.5 px-3 font-sans font-medium text-[#222222]">{node.name}</td>
                    <td className="py-2.5 px-3 font-sans text-[#71767b]">{zone?.name ?? node.zoneId}</td>
                    <td className="py-2.5 px-3 font-bold text-[#222222]">{node.currentValue} {node.unit}</td>
                    <td className="py-2.5 px-3 text-[#71767b]">{node.capacity}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 font-bold ${temp > 65 ? 'text-[#0a0a0a]' : 'text-[#444444]'}`}>
                        {temp}°C
                      </span>
                    </td>
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

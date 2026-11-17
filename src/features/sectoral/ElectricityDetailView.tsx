import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { Zap, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export const ElectricityDetailView: React.FC = () => {
  const { nodes, zones, theme } = useCityNexusStore();
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

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <Zap className="h-7 w-7 text-[#222222] dark:text-amber-400" />
            Metropolitan Power Grid Telemetry
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Real-time thermal capacity, transmission bus loading, and EV substation stress analytics.
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
        <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-1">24-Hour Diurnal Demand Curve</h3>
          <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mb-4">Metropolitan power draw (MW)</p>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLoadTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e8e8e8'} />
                <XAxis dataKey="time" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} />
                <YAxis stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} domain={[500, 1500]} unit=" MW" />
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
                  dataKey="load" 
                  stroke={isDark ? '#f59e0b' : '#222222'} 
                  strokeWidth={2} 
                  fill={isDark ? '#b45309' : '#e8e8e8'} 
                  fillOpacity={isDark ? 0.3 : 0.6}
                  name="Total MW" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-1">Capacity Allocation by Zone</h3>
          <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mb-4">Current load compared to design limit</p>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneLoadComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e8e8e8'} />
                <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={11} />
                <YAxis stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} unit=" MW" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                    borderColor: isDark ? '#475569' : '#cfd9de', 
                    color: isDark ? '#f8fafc' : '#222222',
                    fontSize: '13px',
                    borderRadius: '8px',
                  }} 
                />
                <Bar dataKey="load" fill={isDark ? '#38bdf8' : '#222222'} radius={[4, 4, 0, 0]} name="Load (MW)" />
                <Bar dataKey="capacity" fill={isDark ? '#334155' : '#cfd9de'} radius={[4, 4, 0, 0]} name="Capacity (MW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Substation Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5">
        <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-3">Substation & Feeder Telemetry Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] dark:bg-slate-800/80 text-[#71767b] dark:text-slate-400 text-xs uppercase border-b border-[#cfd9de] dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Substation / Asset</th>
                <th className="py-3 px-3.5">Zone</th>
                <th className="py-3 px-3.5">Load</th>
                <th className="py-3 px-3.5">Capacity</th>
                <th className="py-3 px-3.5">Temp</th>
                <th className="py-3 px-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {filteredNodes.map(node => {
                const temp = node.currentMetrics?.temperatureC ?? 45;
                const zone = zones.find(z => z.id === node.zoneId);

                return (
                  <tr key={node.id} className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3.5 font-sans font-medium text-[#222222] dark:text-slate-100">{node.name}</td>
                    <td className="py-3 px-3.5 font-sans text-[#71767b] dark:text-slate-400">{zone?.name ?? node.zoneId}</td>
                    <td className="py-3 px-3.5 font-bold text-[#222222] dark:text-slate-100">{node.currentValue} {node.unit}</td>
                    <td className="py-3 px-3.5 text-[#71767b] dark:text-slate-400">{node.capacity}</td>
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold ${temp > 65 ? 'text-rose-600 dark:text-rose-400' : 'text-[#444444] dark:text-slate-300'}`}>
                        {temp}°C
                      </span>
                    </td>
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

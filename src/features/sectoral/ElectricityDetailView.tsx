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
    { time: '00:00', load: 820, threshold: 1100 },
    { time: '04:00', load: 740, threshold: 1100 },
    { time: '08:00', load: 1040, threshold: 1100 },
    { time: '12:00', load: 1220, threshold: 1100 },
    { time: '14:00', load: 1290, threshold: 1100 },
    { time: '18:00', load: 1380, threshold: 1100 },
    { time: '20:00', load: 1250, threshold: 1100 },
    { time: '22:00', load: 980, threshold: 1100 },
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            Metropolitan Power Grid Telemetry
          </h1>
          <p className="text-sm text-neutral-400">
            Real-time thermal capacity, transmission bus loading, and EV substation stress analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-neutral-400 font-medium">Zone Filter:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            aria-label="Zone Filter"
            className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs rounded-md px-3 py-1.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Metro Zones</option>
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
          domain="electricity"
          trend={{ direction: 'up', percentage: 4.8 }}
          status={avgLoadPercent > 80 ? 'CRITICAL' : avgLoadPercent > 65 ? 'WARNING' : 'NORMAL'}
        />
        <KPICard
          title="Substation Utilization"
          value={`${avgLoadPercent.toFixed(1)}%`}
          subtext="Aggregate peak capacity"
          domain="electricity"
          status={avgLoadPercent > 85 ? 'CRITICAL' : 'NORMAL'}
        />
        <KPICard
          title="Critical Overloaded Feeders"
          value={criticalFeeders}
          subtext="Exceeding 85% rated limits"
          domain="electricity"
          status={criticalFeeders > 0 ? 'CRITICAL' : 'NORMAL'}
        />
        <KPICard
          title="Thermal Hotspots (>65°C)"
          value={highTempFeeders}
          subtext="Substation transformer cooling alerts"
          domain="electricity"
          status={highTempFeeders > 0 ? 'WARNING' : 'NORMAL'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Curve */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">24-Hour Diurnal Demand Curve</h3>
              <p className="text-xs text-neutral-400">Total metropolitan power draw vs safe dispatch line</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Live Feed
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLoadTimeline}>
                <defs>
                  <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} domain={[500, 1500]} unit=" MW" />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Area type="monotone" dataKey="load" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#elecGrad)" name="Total MW" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Load by Zone */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Capacity Allocation by Zone</h3>
              <p className="text-xs text-neutral-400">Current load compared to design limit</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneLoadComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="name" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={11} unit=" MW" />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Bar dataKey="load" fill="#D97706" radius={[4, 4, 0, 0]} name="Load (MW)" />
                <Bar dataKey="capacity" fill="#404040" radius={[4, 4, 0, 0]} name="Capacity (MW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Primary Substation Table */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Substation & Feeder Telemetry Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="text-[11px] text-neutral-400 bg-neutral-800/50 uppercase border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Substation / Asset</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Load</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Utilization</th>
                <th className="py-2.5 px-3">Transformer Temp</th>
                <th className="py-2.5 px-3">Operational State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredNodes.map(node => {
                const loadPct = node.currentMetrics?.loadPercentage ?? (node.currentValue / 100) * 100;
                const temp = node.currentMetrics?.temperatureC ?? 45;
                const zone = zones.find(z => z.id === node.zoneId);

                return (
                  <tr key={node.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-white font-sans">{node.name}</td>
                    <td className="py-2.5 px-3 text-neutral-400 font-sans">{zone?.name ?? node.zoneId}</td>
                    <td className="py-2.5 px-3 text-amber-400">{node.currentValue} {node.unit}</td>
                    <td className="py-2.5 px-3 text-neutral-400">{node.capacity}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${loadPct > 85 ? 'bg-red-500' : loadPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, loadPct)}%` }} 
                          />
                        </div>
                        <span className={loadPct > 85 ? 'text-red-400 font-bold' : 'text-neutral-300'}>
                          {loadPct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 ${temp > 65 ? 'text-red-400 font-bold' : 'text-neutral-300'}`}>
                        {temp > 65 && <Flame className="h-3 w-3 text-red-500" />}
                        {temp}°C
                      </span>
                    </td>
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

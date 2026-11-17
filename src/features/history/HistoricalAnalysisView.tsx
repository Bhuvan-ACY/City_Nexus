import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { History, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface HistoricalDataPoint {
  timestamp: string;
  trafficIndex: number;
  gridLoadMw: number;
  waterPressureBar: number;
  incidentCount: number;
}

const mockHistoricalData: HistoricalDataPoint[] = [
  { timestamp: '2026-11-10 08:00', trafficIndex: 68, gridLoadMw: 920, waterPressureBar: 4.5, incidentCount: 2 },
  { timestamp: '2026-11-11 08:00', trafficIndex: 72, gridLoadMw: 980, waterPressureBar: 4.4, incidentCount: 3 },
  { timestamp: '2026-11-12 08:00', trafficIndex: 85, gridLoadMw: 1150, waterPressureBar: 3.9, incidentCount: 5 },
  { timestamp: '2026-11-13 08:00', trafficIndex: 92, gridLoadMw: 1290, waterPressureBar: 3.2, incidentCount: 9 }, // Cascade day
  { timestamp: '2026-11-14 08:00', trafficIndex: 88, gridLoadMw: 1210, waterPressureBar: 3.6, incidentCount: 6 },
  { timestamp: '2026-11-15 08:00', trafficIndex: 64, gridLoadMw: 890, waterPressureBar: 4.6, incidentCount: 1 },
  { timestamp: '2026-11-16 08:00', trafficIndex: 76, gridLoadMw: 1040, waterPressureBar: 4.1, incidentCount: 4 },
];

export const HistoricalAnalysisView: React.FC = () => {
  const { theme } = useCityNexusStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedCorrelation, setSelectedCorrelation] = useState<'traffic-grid' | 'grid-water' | 'all'>('all');

  const handleExportCSV = () => {
    const headers = 'Timestamp,Traffic Congestion Index,Grid Load (MW),Water Pressure (Bar),Incidents\n';
    const rows = mockHistoricalData
      .map(d => `${d.timestamp},${d.trafficIndex},${d.gridLoadMw},${d.waterPressureBar},${d.incidentCount}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citynexus_historical_telemetry_${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <History className="h-7 w-7 text-[#222222] dark:text-cyan-400" />
            Historical Cross-Domain Telemetry & Post-Mortem
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Audit multi-domain telemetry trends, replay past cascade events, and export forensic analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all font-semibold ${
                  timeRange === r 
                    ? 'bg-[#222222] dark:bg-slate-700 text-white' 
                    : 'text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-700 border border-[#cfd9de] dark:border-slate-700 text-[#222222] dark:text-slate-100 text-sm rounded-lg font-semibold transition-colors"
          >
            <Download className="h-4 w-4 text-[#444444] dark:text-slate-300" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Correlation Chart */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#222222] dark:text-slate-100">Inter-Infrastructure Cross-Correlation Trends</h3>
            <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400">Traffic congestion peaks preceding electrical surges and water pressure dips</p>
          </div>
          <div className="flex gap-1.5 p-1 bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 rounded-lg text-xs sm:text-sm">
            {(['all', 'traffic-grid', 'grid-water'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCorrelation(c)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  selectedCorrelation === c 
                    ? 'bg-[#222222] dark:bg-slate-600 text-white' 
                    : 'text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white'
                }`}
              >
                {c === 'all' ? 'All Signals' : c === 'traffic-grid' ? 'Traffic & Grid' : 'Grid & Water'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e8e8e8'} />
              <XAxis dataKey="timestamp" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} tickFormatter={(val) => val.split(' ')[0]} />
              <YAxis yAxisId="left" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke={isDark ? '#94a3b8' : '#71767b'} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                  borderColor: isDark ? '#475569' : '#cfd9de', 
                  color: isDark ? '#f8fafc' : '#222222',
                  fontSize: '13px',
                  borderRadius: '8px',
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />

              {(selectedCorrelation === 'all' || selectedCorrelation === 'traffic-grid') && (
                <Line yAxisId="left" type="monotone" dataKey="trafficIndex" stroke={isDark ? '#38bdf8' : '#222222'} strokeWidth={2.5} name="Traffic Index" dot={{ r: 4 }} />
              )}
              {(selectedCorrelation === 'all' || selectedCorrelation === 'traffic-grid' || selectedCorrelation === 'grid-water') && (
                <Line yAxisId="left" type="monotone" dataKey="gridLoadMw" stroke={isDark ? '#f59e0b' : '#4b5563'} strokeWidth={2.5} name="Grid Load (MW)" dot={{ r: 4 }} />
              )}
              {(selectedCorrelation === 'all' || selectedCorrelation === 'grid-water') && (
                <Line yAxisId="right" type="monotone" dataKey="waterPressureBar" stroke={isDark ? '#34d399' : '#71767b'} strokeWidth={2.5} name="Water Pressure (Bar)" dot={{ r: 4 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Incidents Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-5 sm:p-6">
        <h3 className="text-base font-bold text-[#222222] dark:text-slate-100 mb-3">Historical Cascade Events Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] dark:bg-slate-800/80 text-[#71767b] dark:text-slate-400 text-xs uppercase border-b border-[#cfd9de] dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Date / Timestamp</th>
                <th className="py-3 px-3.5">Initial Trigger</th>
                <th className="py-3 px-3.5">Propagated Domains</th>
                <th className="py-3 px-3.5">Peak Blast Radius</th>
                <th className="py-3 px-3.5">Duration</th>
                <th className="py-3 px-3.5">Resolution Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] dark:divide-slate-800 font-mono text-xs sm:text-sm">
              <tr className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-3.5 text-[#71767b] dark:text-slate-400">2026-11-13 14:22</td>
                <td className="py-3 px-3.5 font-sans font-medium text-[#222222] dark:text-slate-100">Silk Board Junction Gridlock (Severity 0.92)</td>
                <td className="py-3 px-3.5 font-sans text-[#444444] dark:text-slate-300">Traffic → Electricity → Water</td>
                <td className="py-3 px-3.5 font-bold text-rose-600 dark:text-rose-400">4 Nodes / 2 Zones</td>
                <td className="py-3 px-3.5 text-[#71767b] dark:text-slate-400">42 mins</td>
                <td className="py-3 px-3.5 font-sans text-[#222222] dark:text-slate-200">Auto-signal pacing + Feeder load transfer</td>
              </tr>
              <tr className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-3.5 text-[#71767b] dark:text-slate-400">2026-11-09 17:45</td>
                <td className="py-3 px-3.5 font-sans font-medium text-[#222222] dark:text-slate-100">Whitefield Feeder Transformer Overheat</td>
                <td className="py-3 px-3.5 font-sans text-[#444444] dark:text-slate-300">Electricity → Traffic Signals</td>
                <td className="py-3 px-3.5 font-bold text-amber-600 dark:text-amber-400">2 Nodes / 1 Zone</td>
                <td className="py-3 px-3.5 text-[#71767b] dark:text-slate-400">28 mins</td>
                <td className="py-3 px-3.5 font-sans text-[#222222] dark:text-slate-200">Auxiliary diesel generator dispatch</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

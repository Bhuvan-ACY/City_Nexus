import React, { useState } from 'react';
import { History, Download, Calendar, Filter, ArrowDownRight, ArrowUpRight } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="h-6 w-6 text-purple-400" />
            Historical Cross-Domain Telemetry & Post-Mortem
          </h1>
          <p className="text-sm text-neutral-400">
            Audit multi-domain telemetry trends, replay past cascade events, and export forensic analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-md p-1">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-xs rounded transition-colors ${timeRange === '7d' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-xs rounded transition-colors ${timeRange === '30d' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 text-xs rounded transition-colors ${timeRange === '90d' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'}`}
            >
              90 Days
            </button>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-md font-medium transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-neutral-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Cross-Domain Correlation Analysis Banner */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Inter-Infrastructure Cross-Correlation Trends</h3>
            <p className="text-xs text-neutral-400">Observe how traffic peaks precede electrical surges and subsequent water pressure dips</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCorrelation('all')}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${selectedCorrelation === 'all' ? 'bg-neutral-800 text-white border-neutral-600' : 'border-neutral-800 text-neutral-400'}`}
            >
              All Signals
            </button>
            <button
              onClick={() => setSelectedCorrelation('traffic-grid')}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${selectedCorrelation === 'traffic-grid' ? 'bg-neutral-800 text-white border-neutral-600' : 'border-neutral-800 text-neutral-400'}`}
            >
              Traffic & Grid
            </button>
            <button
              onClick={() => setSelectedCorrelation('grid-water')}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${selectedCorrelation === 'grid-water' ? 'bg-neutral-800 text-white border-neutral-600' : 'border-neutral-800 text-neutral-400'}`}
            >
              Grid & Water
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="timestamp" stroke="#737373" fontSize={11} tickFormatter={(val) => val.split(' ')[0]} />
              <YAxis yAxisId="left" stroke="#737373" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#737373" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {(selectedCorrelation === 'all' || selectedCorrelation === 'traffic-grid') && (
                <Line yAxisId="left" type="monotone" dataKey="trafficIndex" stroke="#2563EB" name="Traffic Congestion Index" strokeWidth={2} dot={{ r: 3 }} />
              )}
              {(selectedCorrelation === 'all' || selectedCorrelation === 'traffic-grid' || selectedCorrelation === 'grid-water') && (
                <Line yAxisId="left" type="monotone" dataKey="gridLoadMw" stroke="#D97706" name="Grid Load (MW)" strokeWidth={2} dot={{ r: 3 }} />
              )}
              {(selectedCorrelation === 'all' || selectedCorrelation === 'grid-water') && (
                <Line yAxisId="right" type="monotone" dataKey="waterPressureBar" stroke="#0891B2" name="Water Pressure (Bar)" strokeWidth={2} dot={{ r: 3 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forensic Incident History Log */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Historical Cascade Events Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="text-[11px] text-neutral-400 bg-neutral-800/50 uppercase border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Date / Timestamp</th>
                <th className="py-2.5 px-3">Initial Trigger</th>
                <th className="py-2.5 px-3">Propagated Domains</th>
                <th className="py-2.5 px-3">Peak Blast Radius</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Resolution Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2.5 px-3 font-mono text-neutral-400">2026-11-13 14:22</td>
                <td className="py-2.5 px-3 font-medium text-white">Silk Board Junction Gridlock (Severity 0.92)</td>
                <td className="py-2.5 px-3">
                  <span className="text-blue-400">Traffic</span> → <span className="text-amber-400">Electricity (Koramangala Substation)</span> → <span className="text-cyan-400">Water (Pump Stn #4)</span>
                </td>
                <td className="py-2.5 px-3 text-red-400 font-bold">4 Nodes / 2 Zones</td>
                <td className="py-2.5 px-3 text-neutral-300">42 mins</td>
                <td className="py-2.5 px-3 text-emerald-400 font-medium">Auto-signal pacing + Feeder load transfer</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2.5 px-3 font-mono text-neutral-400">2026-11-09 17:45</td>
                <td className="py-2.5 px-3 font-medium text-white">Whitefield Feeder Transformer Overheat</td>
                <td className="py-2.5 px-3">
                  <span className="text-amber-400">Electricity</span> → <span className="text-blue-400">Traffic (Signal cycle freeze)</span>
                </td>
                <td className="py-2.5 px-3 text-amber-400 font-bold">2 Nodes / 1 Zone</td>
                <td className="py-2.5 px-3 text-neutral-300">28 mins</td>
                <td className="py-2.5 px-3 text-emerald-400 font-medium">Auxiliary diesel generator dispatch</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2.5 px-3 font-mono text-neutral-400">2026-11-04 09:12</td>
                <td className="py-2.5 px-3 font-medium text-white">Main Water Line Burst (Outer Ring Road)</td>
                <td className="py-2.5 px-3">
                  <span className="text-cyan-400">Water</span> → <span className="text-blue-400">Traffic (Flooding Lane closure)</span>
                </td>
                <td className="py-2.5 px-3 text-red-400 font-bold">3 Nodes / 1 Zone</td>
                <td className="py-2.5 px-3 text-neutral-300">110 mins</td>
                <td className="py-2.5 px-3 text-emerald-400 font-medium">Bypass valve reroute + Traffic detour</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

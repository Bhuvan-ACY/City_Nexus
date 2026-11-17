import React, { useState } from 'react';
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <History className="h-6 w-6 text-[#222222]" />
            Historical Cross-Domain Telemetry & Post-Mortem
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Audit multi-domain telemetry trends, replay past cascade events, and export forensic analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#cfd9de] rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs rounded-md transition-all font-semibold ${
                  timeRange === r ? 'bg-[#222222] text-white' : 'text-[#444444] hover:text-[#222222]'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#e8e8e8]/50 border border-[#cfd9de] text-[#222222] text-xs rounded-lg font-semibold transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#444444]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Correlation Chart */}
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#222222]">Inter-Infrastructure Cross-Correlation Trends</h3>
            <p className="text-xs text-[#71767b]">Traffic congestion peaks preceding electrical surges and water pressure dips</p>
          </div>
          <div className="flex gap-1.5 p-1 bg-white border border-[#cfd9de] rounded-lg text-xs">
            {(['all', 'traffic-grid', 'grid-water'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCorrelation(c)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedCorrelation === c ? 'bg-[#222222] text-white' : 'text-[#444444] hover:text-[#222222]'
                }`}
              >
                {c === 'all' ? 'All Signals' : c === 'traffic-grid' ? 'Traffic & Grid' : 'Grid & Water'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey="timestamp" stroke="#71767b" fontSize={11} tickFormatter={(val) => val.split(' ')[0]} />
              <YAxis yAxisId="left" stroke="#71767b" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#71767b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cfd9de', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {(selectedCorrelation === 'all' || selectedCorrelation === 'traffic-grid') && (
                <Line yAxisId="left" type="monotone" dataKey="trafficIndex" stroke="#222222" strokeWidth={2} name="Traffic Index" dot={{ r: 3 }} />
              )}
              {(selectedCorrelation === 'all' || selectedCorrelation === 'traffic-grid' || selectedCorrelation === 'grid-water') && (
                <Line yAxisId="left" type="monotone" dataKey="gridLoadMw" stroke="#4b5563" strokeWidth={2} name="Grid Load (MW)" dot={{ r: 3 }} />
              )}
              {(selectedCorrelation === 'all' || selectedCorrelation === 'grid-water') && (
                <Line yAxisId="right" type="monotone" dataKey="waterPressureBar" stroke="#71767b" strokeWidth={2} name="Water Pressure (Bar)" dot={{ r: 3 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Incidents Table */}
      <div className="bg-white border border-[#cfd9de] rounded-lg p-5">
        <h3 className="text-sm font-bold text-[#222222] mb-3">Historical Cascade Events Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafafa] text-[#71767b] text-[10px] uppercase border-b border-[#cfd9de]">
              <tr>
                <th className="py-2.5 px-3">Date / Timestamp</th>
                <th className="py-2.5 px-3">Initial Trigger</th>
                <th className="py-2.5 px-3">Propagated Domains</th>
                <th className="py-2.5 px-3">Peak Blast Radius</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Resolution Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] font-mono text-[11px]">
              <tr className="hover:bg-[#fafafa]">
                <td className="py-2.5 px-3 text-[#71767b]">2026-11-13 14:22</td>
                <td className="py-2.5 px-3 font-sans font-medium text-[#222222]">Silk Board Junction Gridlock (Severity 0.92)</td>
                <td className="py-2.5 px-3 font-sans text-[#444444]">Traffic → Electricity → Water</td>
                <td className="py-2.5 px-3 font-bold text-[#0a0a0a]">4 Nodes / 2 Zones</td>
                <td className="py-2.5 px-3 text-[#71767b]">42 mins</td>
                <td className="py-2.5 px-3 font-sans text-[#222222]">Auto-signal pacing + Feeder load transfer</td>
              </tr>
              <tr className="hover:bg-[#fafafa]">
                <td className="py-2.5 px-3 text-[#71767b]">2026-11-09 17:45</td>
                <td className="py-2.5 px-3 font-sans font-medium text-[#222222]">Whitefield Feeder Transformer Overheat</td>
                <td className="py-2.5 px-3 font-sans text-[#444444]">Electricity → Traffic Signals</td>
                <td className="py-2.5 px-3 font-bold text-[#0a0a0a]">2 Nodes / 1 Zone</td>
                <td className="py-2.5 px-3 text-[#71767b]">28 mins</td>
                <td className="py-2.5 px-3 font-sans text-[#222222]">Auxiliary diesel generator dispatch</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

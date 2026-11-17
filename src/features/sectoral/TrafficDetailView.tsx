import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Car, Navigation, Gauge, AlertCircle } from 'lucide-react';

export const TrafficDetailView: React.FC = () => {
  const { zones, nodes } = useCityNexusStore();
  const trafficNodes = nodes.filter((n) => n.domain === 'traffic');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
          <Car className="w-6 h-6 text-domain-trafficLight" />
          <span>Transportation & Traffic Network Operations</span>
        </h1>
        <p className="text-sm text-ink-muted">
          Real-time adaptive intersection queue telemetry, expressway throughput, and signal power dependencies.
        </p>
      </div>

      {/* Corridor Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface-1 border border-hairline p-5 rounded-xl">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Mean Congestion Index
          </span>
          <span className="text-3xl font-extrabold text-domain-trafficLight">
            {Math.round(zones.reduce((a, b) => a + b.metrics.trafficCongestion, 0) / zones.length)}%
          </span>
          <span className="text-xs text-status-critical block mt-1">+8.4% above nominal morning peak</span>
        </div>

        <div className="bg-surface-1 border border-hairline p-5 rounded-xl">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Active Monitored Signals
          </span>
          <span className="text-3xl font-extrabold text-ink">{trafficNodes.length * 12} Intersections</span>
          <span className="text-xs text-ink-muted block mt-1">100% connected to digital twin</span>
        </div>

        <div className="bg-surface-1 border border-hairline p-5 rounded-xl border-l-4 border-l-status-critical">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            Critical Bottleneck
          </span>
          <span className="text-lg font-bold text-ink truncate block">Marathahalli Corridor</span>
          <span className="text-xs text-status-critical block mt-1">91% density (EV charging surge spillover)</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-ink mb-4">Traffic Nodes Telemetry Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-hairline text-ink-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Node Asset</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Rated Throughput</th>
                <th className="py-2.5 px-3">Live Flow</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {trafficNodes.map((n) => (
                <tr key={n.id} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-3 font-bold text-ink">{n.name}</td>
                  <td className="py-3 px-3 text-ink-muted">{n.zoneId}</td>
                  <td className="py-3 px-3">{n.capacity}</td>
                  <td className="py-3 px-3 font-semibold text-ink">{n.currentValue} {n.unit}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      n.status === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical' : 'bg-status-normal/10 text-status-normal'
                    }`}>
                      {n.status}
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

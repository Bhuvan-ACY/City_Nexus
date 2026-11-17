import React from 'react';
import { KPICard } from '../../components/shared/KPICard';
import { Car, Zap, Droplet, ArrowRight, ShieldAlert, Activity } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { useNavigate } from 'react-router-dom';

export const MultiDomainDashboard: React.FC = () => {
  const { zones, alerts } = useCityNexusStore();
  const navigate = useNavigate();

  // Aggregate stats
  const avgTraffic = Math.round(zones.reduce((acc, z) => acc + z.metrics.trafficCongestion, 0) / zones.length);
  const avgGrid = Math.round(zones.reduce((acc, z) => acc + z.metrics.gridLoad, 0) / zones.length);
  const avgPressure = Math.round(zones.reduce((acc, z) => acc + z.metrics.waterPressure, 0) / zones.length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Filter ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Urban Infrastructure Command Console</h1>
          <p className="text-sm text-ink-muted">Unified multi-domain telemetry and real-time interdependency monitor</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/simulation')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-2 hover:bg-surface-3 border border-hairline text-ink transition-all shadow-sm"
          >
            <span>Simulate Stress Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-domain-traffic hover:bg-blue-600 text-white transition-all shadow-sm shadow-domain-traffic/20"
          >
            <span>Launch GIS Map</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          title="Transportation Network"
          value={avgTraffic}
          unit="Congestion %"
          deltaText="+8.4% vs 60m avg"
          isPositive={true}
          status={avgTraffic > 80 ? 'CRITICAL' : avgTraffic > 65 ? 'WARNING' : 'NORMAL'}
          icon={Car}
          domainColor="traffic"
          detailLink="/dashboard/traffic"
        />

        <KPICard
          title="Electrical Power Grid"
          value={avgGrid}
          unit="Load Capacity %"
          deltaText="+12.1% peak draw"
          isPositive={true}
          status={avgGrid > 85 ? 'CRITICAL' : avgGrid > 70 ? 'WARNING' : 'NORMAL'}
          icon={Zap}
          domainColor="electricity"
          detailLink="/dashboard/electricity"
        />

        <KPICard
          title="Water Distribution"
          value={avgPressure}
          unit="Mean PSI"
          deltaText="-4.2 PSI localized dip"
          isPositive={false}
          status={avgPressure < 35 ? 'CRITICAL' : avgPressure < 50 ? 'WARNING' : 'NORMAL'}
          icon={Droplet}
          domainColor="utilities"
          detailLink="/dashboard/utilities"
        />
      </div>

      {/* Zone Health Matrix & Incident Triage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone Health Table */}
        <div className="lg:col-span-2 bg-surface-1 border border-hairline rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-ink">Municipal Sector Health Matrix</h3>
              <p className="text-xs text-ink-muted">Cross-domain status across all 6 administrative zones</p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs text-domain-trafficLight hover:underline font-medium"
            >
              Inspect on Map →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-hairline text-ink-muted uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Zone Code & Name</th>
                  <th className="py-2.5 px-3">Traffic</th>
                  <th className="py-2.5 px-3">Grid Load</th>
                  <th className="py-2.5 px-3">Water</th>
                  <th className="py-2.5 px-3 text-right">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3 px-3 font-semibold text-ink">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.healthScore >= 80 ? '#10b981' : zone.healthScore >= 60 ? '#f59e0b' : '#ef4444' }} />
                        <span>{zone.name}</span>
                      </div>
                      <span className="text-[10px] text-ink-muted font-normal block">{zone.code}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-ink">{zone.metrics.trafficCongestion}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-ink">{zone.metrics.gridLoad}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-ink">{zone.metrics.waterPressure} PSI</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        zone.healthScore >= 80
                          ? 'bg-status-normal/10 text-status-normal border border-status-normal/30'
                          : zone.healthScore >= 60
                          ? 'bg-status-warning/10 text-status-warning border border-status-warning/30'
                          : 'bg-status-critical/10 text-status-critical border border-status-critical/30 animate-pulse'
                      }`}>
                        {zone.healthScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Cross-Domain Cascading Alerts Panel */}
        <div className="bg-surface-1 border border-hairline rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-status-critical" /> Active Cascade Threats
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-status-critical/20 text-status-critical">
                {alerts.filter((a) => a.status === 'ACTIVE').length} Active
              </span>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => navigate('/alerts')}
                  className="p-3 rounded-lg border border-hairline bg-surface-2 hover:border-hairline/80 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-ink truncate">{alt.nodeName}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      alt.severity === 'CRITICAL' ? 'bg-status-critical text-white' : 'bg-status-warning text-black'
                    }`}>
                      {alt.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted line-clamp-2 mb-2">{alt.description}</p>
                  <div className="text-[10px] text-domain-trafficLight font-semibold">
                    Cascading Risk: {alt.affectedSystems.length} interconnected systems at risk →
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/dependencies')}
            className="w-full mt-4 py-2 bg-surface-2 hover:bg-surface-3 border border-hairline text-xs font-semibold text-ink rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Open Graph Dependency Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

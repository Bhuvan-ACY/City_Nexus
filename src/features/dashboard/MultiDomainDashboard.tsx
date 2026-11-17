import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { KPICard } from '../../components/shared/KPICard';
import { 
  Car, 
  Zap, 
  Droplet, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const MultiDomainDashboard: React.FC = () => {
  const { zones, nodes, alerts, selectedDomain, setSelectedDomain } = useCityNexusStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'traffic' | 'electricity' | 'utilities'>(selectedDomain);

  // Compute Aggregates
  const totalNodes = nodes.length;
  const criticalNodes = nodes.filter((n) => n.status === 'CRITICAL').length;
  const warningNodes = nodes.filter((n) => n.status === 'WARNING').length;

  const avgTraffic = Math.round(
    zones.reduce((acc, z) => acc + z.metrics.trafficCongestion, 0) / (zones.length || 1)
  );
  const avgGrid = Math.round(
    zones.reduce((acc, z) => acc + z.metrics.gridLoad, 0) / (zones.length || 1)
  );
  const avgWater = Math.round(
    zones.reduce((acc, z) => acc + z.metrics.waterPressure, 0) / (zones.length || 1)
  );

  const filteredZones = activeTab === 'all'
    ? zones
    : zones.filter((z) => {
        if (activeTab === 'traffic') return z.metrics.trafficCongestion > 65;
        if (activeTab === 'electricity') return z.metrics.gridLoad > 75;
        if (activeTab === 'utilities') return z.metrics.waterPressure < 45;
        return true;
      });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222]">
            Municipal Cross-Domain Command Center
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Real-time urban telemetry across traffic flows, power grid substations, and water utility networks.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#cfd9de] rounded-lg">
          {(['all', 'traffic', 'electricity', 'utilities'] as const).map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setActiveTab(dom);
                setSelectedDomain(dom);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                activeTab === dom
                  ? 'bg-[#222222] text-white'
                  : 'text-[#444444] hover:text-[#222222] hover:bg-[#e8e8e8]/50'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Traffic Congestion"
          value={avgTraffic}
          unit="%"
          deltaText="Corridor peak volume"
          isPositive={avgTraffic > 75}
          status={avgTraffic > 80 ? 'CRITICAL' : avgTraffic > 65 ? 'WARNING' : 'NORMAL'}
          icon={Car}
          domain="traffic"
          detailLink="/dashboard/traffic"
        />

        <KPICard
          title="Grid Aggregate Load"
          value={avgGrid}
          unit="%"
          deltaText="Feeder capacity usage"
          isPositive={avgGrid > 80}
          status={avgGrid > 85 ? 'CRITICAL' : avgGrid > 70 ? 'WARNING' : 'NORMAL'}
          icon={Zap}
          domain="electricity"
          detailLink="/dashboard/electricity"
        />

        <KPICard
          title="Water Mains Pressure"
          value={avgWater}
          unit="PSI"
          deltaText="Nominal standard: 45 PSI"
          isPositive={avgWater < 35}
          status={avgWater < 30 ? 'CRITICAL' : avgWater < 40 ? 'WARNING' : 'NORMAL'}
          icon={Droplet}
          domain="utilities"
          detailLink="/dashboard/utilities"
        />

        <KPICard
          title="At-Risk Assets"
          value={`${criticalNodes + warningNodes}`}
          unit={`/ ${totalNodes}`}
          deltaText={`${criticalNodes} Critical, ${warningNodes} Warning`}
          isPositive={criticalNodes > 0}
          status={criticalNodes > 0 ? 'CRITICAL' : warningNodes > 0 ? 'WARNING' : 'NORMAL'}
          icon={AlertTriangle}
          domain="traffic"
          detailLink="/alerts"
        />
      </div>

      {/* Two Column Layout: Zone Health Matrix & Active Cascade Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Zone Health Matrix */}
        <div className="lg:col-span-2 bg-white border border-[#cfd9de] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#222222]">Metropolitan Zone Resilience Matrix</h2>
              <p className="text-xs text-[#71767b]">Real-time operational indices across municipal sectors</p>
            </div>
            <Link to="/map" className="text-xs font-semibold text-[#006be6] hover:underline flex items-center gap-1">
              <span>View GIS Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredZones.map((zone) => {
              const isLowHealth = zone.healthScore < 70;
              const isWarning = zone.healthScore >= 70 && zone.healthScore < 85;

              return (
                <div
                  key={zone.id}
                  onClick={() => navigate('/map')}
                  className="p-3.5 rounded-lg border border-[#cfd9de] hover:border-[#444444] bg-white cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#71767b]" />
                      <span className="font-bold text-xs text-[#222222]">{zone.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${
                        isLowHealth
                          ? 'bg-[#222222] text-white border-[#0a0a0a]'
                          : isWarning
                          ? 'bg-[#e8e8e8] text-[#222222] border-[#808080]'
                          : 'bg-[#e8e8e8] text-[#444444] border-[#cfd9de]'
                      }`}
                    >
                      {zone.healthScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e8e8e8] text-[11px] font-mono">
                    <div>
                      <span className="text-[#71767b] block text-[10px]">Traffic</span>
                      <span className={`font-bold ${zone.metrics.trafficCongestion > 80 ? 'text-[#0a0a0a]' : 'text-[#444444]'}`}>
                        {zone.metrics.trafficCongestion}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71767b] block text-[10px]">Grid</span>
                      <span className={`font-bold ${zone.metrics.gridLoad > 80 ? 'text-[#0a0a0a]' : 'text-[#444444]'}`}>
                        {zone.metrics.gridLoad}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71767b] block text-[10px]">Water</span>
                      <span className={`font-bold ${zone.metrics.waterPressure < 40 ? 'text-[#0a0a0a]' : 'text-[#444444]'}`}>
                        {zone.metrics.waterPressure} PSI
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Active Cascade Threats */}
        <div className="bg-white border border-[#cfd9de] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#222222]">Cross-Sector Threats</h2>
                <p className="text-xs text-[#71767b]">Identified multi-domain cascade chains</p>
              </div>
              <Link to="/alerts" className="text-xs font-semibold text-[#006be6] hover:underline">
                All Alarms →
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="p-3 rounded-lg border border-[#cfd9de] hover:border-[#444444] cursor-pointer transition-all bg-[#fafafa]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#222222] text-white">
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-[#71767b] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      12m ago
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#222222] line-clamp-1">{alert.title}</h3>
                  <p className="text-[11px] text-[#444444] line-clamp-2 mt-1">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e8e8e8]">
            <Link
              to="/simulation"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#222222] hover:bg-[#0a0a0a] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <span>Launch What-If Sandbox</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

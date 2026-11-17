import React from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IncidentTicker: React.FC = () => {
  const { alerts } = useCityNexusStore();
  const navigate = useNavigate();

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');

  if (activeAlerts.length === 0) return null;

  return (
    <div className="bg-[#222222] text-white px-4 py-2 flex items-center justify-between text-xs overflow-hidden shrink-0 border-b border-[#0a0a0a]">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-[10px] shrink-0 bg-white/10 px-2 py-0.5 rounded border border-white/20">
          <AlertTriangle className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>Active Cascade Alarms ({activeAlerts.length})</span>
        </div>

        {/* Ticker Items */}
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-[11px] text-neutral-200">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                {alert.severity}
              </span>
              <span className="text-white font-medium">{alert.title}</span>
              <span className="text-neutral-400">[{alert.nodeName}]</span>
              <span className="text-neutral-500">•</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/alerts')}
        className="flex items-center gap-1 text-[11px] font-bold text-white hover:underline shrink-0 pl-4 border-l border-white/20"
      >
        <span>Open Triage</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

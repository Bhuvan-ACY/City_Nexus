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
    <div className="bg-[#1e2533] dark:bg-[#070a12] text-white px-5 py-2.5 flex items-center justify-between text-sm overflow-hidden shrink-0 border-b border-slate-700 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 font-bold tracking-wider uppercase text-xs shrink-0 bg-white/10 px-2.5 py-1 rounded border border-white/20">
          <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Active Cascade Alarms ({activeAlerts.length})</span>
        </div>

        {/* Ticker Items */}
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-xs text-neutral-200">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-2 shrink-0">
              <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${
                alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
              }`}>
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
        className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-300 hover:underline shrink-0 pl-4 border-l border-white/20 transition-colors"
      >
        <span>Open Triage</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

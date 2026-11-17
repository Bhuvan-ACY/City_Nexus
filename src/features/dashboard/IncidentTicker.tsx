import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { useNavigate } from 'react-router-dom';

export const IncidentTicker: React.FC = () => {
  const { alerts } = useCityNexusStore();
  const navigate = useNavigate();
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');

  if (activeAlerts.length === 0) {
    return (
      <div className="h-8 bg-surface-1 border-b border-hairline px-6 flex items-center text-xs text-status-normal gap-2 font-medium">
        <span className="w-2 h-2 rounded-full bg-status-normal"></span>
        <span>ALL MUNICIPAL SYSTEMS NOMINAL — ZERO CRITICAL OUTAGES DETECTED</span>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate('/alerts')}
      className="h-9 bg-status-critical/10 border-b border-status-critical/30 px-6 flex items-center justify-between text-xs cursor-pointer hover:bg-status-critical/15 transition-colors select-none"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-critical text-white font-bold text-[10px] tracking-wider uppercase shrink-0">
          <AlertTriangle className="w-3 h-3" /> Live Incident
        </span>
        <div className="flex items-center gap-4 text-ink font-medium truncate">
          {activeAlerts.map((alt) => (
            <span key={alt.id} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-status-critical">[{alt.nodeName}]</span>: {alt.title}
            </span>
          ))}
        </div>
      </div>
      <span className="text-ink-muted text-[11px] underline shrink-0 font-medium ml-4">
        Open Alert Center →
      </span>
    </div>
  );
};

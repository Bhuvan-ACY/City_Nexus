import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { Bell, ShieldAlert, CheckCircle, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { Alert } from '../../types/domain.types';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useCityNexusStore();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(alerts.length > 0 ? alerts[0] : null);
  const [operatorNote, setOperatorNote] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  const handleAcknowledge = () => {
    if (!selectedAlert) return;
    acknowledgeAlert(selectedAlert.id, operatorNote || 'Operator reviewed and dispatched assessment crew.');
    setOperatorNote('');
  };

  const handleResolve = () => {
    if (!selectedAlert) return;
    resolveAlert(selectedAlert.id, operatorNote || 'Auxiliary grid restored; nominal pressure verified.');
    setOperatorNote('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-status-critical" />
          <span>Incident Triage & Alert Command Center</span>
        </h1>
        <p className="text-sm text-ink-muted">
          Active threshold breaches enriched with cross-domain cascading impact intelligence.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-hairline pb-3">
        {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === st
                ? 'bg-surface-2 text-ink border border-hairline shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-surface-2/40'
            }`}
          >
            {st} ({st === 'ALL' ? alerts.length : alerts.filter((a) => a.status === st).length})
          </button>
        ))}
      </div>

      {/* Split view: Alert List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alert List Table */}
        <div className="lg:col-span-7 bg-surface-1 border border-hairline rounded-xl p-5 shadow-sm space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-ink-muted text-xs">
              Zero alerts found matching filter criteria.
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                onClick={() => setSelectedAlert(alt)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAlert?.id === alt.id
                    ? 'border-domain-traffic bg-surface-2 shadow-md'
                    : 'border-hairline bg-surface-1 hover:bg-surface-2/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      alt.severity === 'CRITICAL' ? 'bg-status-critical text-white' : 'bg-status-warning text-black'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-xs font-bold text-ink">{alt.nodeName}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alt.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-ink-muted line-clamp-1 mb-2">{alt.title}</p>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-hairline/50">
                  <span className="text-domain-trafficLight font-semibold">
                    {alt.affectedSystems.length} Interdependent Systems at Risk
                  </span>
                  <span className={`font-bold capitalize ${
                    alt.status === 'ACTIVE'
                      ? 'text-status-critical'
                      : alt.status === 'ACKNOWLEDGED'
                      ? 'text-status-warning'
                      : 'text-status-normal'
                  }`}>
                    Status: {alt.status.toLowerCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Alert Detail Drawer */}
        <div className="lg:col-span-5 bg-surface-1 border border-hairline rounded-xl p-6 shadow-sm flex flex-col justify-between">
          {selectedAlert ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-ink-muted">
                    INCIDENT IDENTIFIER: {selectedAlert.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    selectedAlert.status === 'ACTIVE'
                      ? 'bg-status-critical/10 text-status-critical'
                      : 'bg-status-warning/10 text-status-warning'
                  }`}>
                    {selectedAlert.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink leading-tight">{selectedAlert.title}</h3>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{selectedAlert.description}</p>
              </div>

              {/* Affected Systems Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Cross-Domain Impacted Infrastructure
                </h4>
                <div className="space-y-2">
                  {selectedAlert.affectedSystems.map((aff, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-surface-2 border border-hairline text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-ink block">{aff.name}</span>
                        <span className="text-[10px] text-ink-muted capitalize">Sector: {aff.domain}</span>
                      </div>
                      <span className="font-extrabold text-status-critical text-xs">
                        Impact: {Math.round(aff.impactScore * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution / Operator Notes */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-2">Operator Action / Response Dispatch Note</label>
                <textarea
                  rows={3}
                  value={operatorNote}
                  onChange={(e) => setOperatorNote(e.target.value)}
                  placeholder="Enter dispatch unit orders or containment actions..."
                  className="w-full bg-surface-2 border border-hairline rounded-lg p-3 text-xs text-ink outline-none focus:border-domain-traffic resize-none"
                />
              </div>

              {/* Operational Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAcknowledge}
                  disabled={selectedAlert.status !== 'ACTIVE'}
                  className="flex-1 py-2 rounded-lg bg-surface-2 hover:bg-surface-3 disabled:opacity-40 border border-hairline text-xs font-bold text-ink transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
                <button
                  type="button"
                  onClick={handleResolve}
                  disabled={selectedAlert.status === 'RESOLVED'}
                  className="flex-1 py-2 rounded-lg bg-status-normal hover:bg-emerald-600 disabled:opacity-40 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-status-normal/20"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Resolve Incident</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-ink-muted text-xs">
              Select an alert from the incident stream to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { AlertStatus } from '../../types/domain.types';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, FileText, Send } from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, currentUserRole } = useCityNexusStore();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0] || null;

  const filteredAlerts = alerts.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  const handleAcknowledge = async (id: string) => {
    await acknowledgeAlert(id, resolutionNote || 'Acknowledged by operational coordinator');
    setResolutionNote('');
  };

  const handleResolve = async (id: string) => {
    await resolveAlert(id, resolutionNote || 'Incident mitigated and normal tolerances restored');
    setResolutionNote('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#cfd9de]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222] flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-[#222222]" />
            Multi-Agency Incident Triage Command
          </h1>
          <p className="text-xs text-[#71767b] mt-0.5">
            Coordinate inter-departmental responses across Traffic, Power Grid, and Water utilities.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#cfd9de] rounded-lg p-1 text-xs">
            <span className="text-[#71767b] px-2 text-[10px] font-bold uppercase">Status:</span>
            {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-[#222222] text-white'
                    : 'text-[#444444] hover:text-[#222222] hover:bg-[#e8e8e8]/50'
                }`}
              >
                {st.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-[#cfd9de] rounded-lg p-1 text-xs">
            <span className="text-[#71767b] px-2 text-[10px] font-bold uppercase">Severity:</span>
            {(['ALL', 'CRITICAL', 'WARNING'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] capitalize transition-all ${
                  filterSeverity === sev
                    ? 'bg-[#222222] text-white'
                    : 'text-[#444444] hover:text-[#222222] hover:bg-[#e8e8e8]/50'
                }`}
              >
                {sev.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Incidents */}
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#cfd9de] rounded-lg text-xs text-[#71767b]">
              No incident alerts matching selected criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#222222] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'bg-white border-[#cfd9de] hover:border-[#808080]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#222222] text-white">
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-[#71767b] font-mono">
                      {alert.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#222222] line-clamp-1">{alert.title}</h4>
                  <p className="text-[11px] text-[#444444] mt-1 line-clamp-2">{alert.description}</p>
                  <div className="mt-2 pt-2 border-t border-[#e8e8e8] flex items-center justify-between text-[10px] font-mono text-[#71767b]">
                    <span>Node: {alert.nodeName}</span>
                    <span className="capitalize">[{alert.domain}]</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail & Action Drawer */}
        <div className="lg:col-span-2">
          {selectedAlert ? (
            <div className="bg-white border border-[#cfd9de] rounded-lg p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#cfd9de]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#222222] text-white">
                      {selectedAlert.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#71767b]">
                      ID: {selectedAlert.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#cfd9de] bg-[#e8e8e8] text-[#222222]">
                      {selectedAlert.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#222222]">{selectedAlert.title}</h2>
                  <p className="text-xs text-[#71767b] mt-0.5 font-mono">
                    Origin Asset: {selectedAlert.nodeName} • Zone: {selectedAlert.zoneId} • Domain: {selectedAlert.domain}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#71767b] uppercase tracking-wider">
                  Incident Telemetry Assessment
                </h4>
                <p className="text-xs text-[#444444] leading-relaxed bg-[#fafafa] p-3.5 rounded-lg border border-[#cfd9de]">
                  {selectedAlert.description}
                </p>
              </div>

              {/* Affected Systems Table */}
              {selectedAlert.affectedSystems && selectedAlert.affectedSystems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#71767b] uppercase tracking-wider">
                    Downstream Cascade Threat Coupling
                  </h4>
                  <div className="border border-[#cfd9de] rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#fafafa] text-[#71767b] text-[10px] uppercase border-b border-[#cfd9de]">
                        <tr>
                          <th className="py-2 px-3">Impacted Asset</th>
                          <th className="py-2 px-3">Domain</th>
                          <th className="py-2 px-3">Vulnerability Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8e8e8] font-mono text-[11px]">
                        {selectedAlert.affectedSystems.map((aff, i) => (
                          <tr key={i} className="hover:bg-[#fafafa]">
                            <td className="py-2 px-3 font-sans font-medium text-[#222222]">{aff.name}</td>
                            <td className="py-2 px-3 capitalize font-sans text-[#444444]">{aff.domain}</td>
                            <td className="py-2 px-3 font-bold text-[#0a0a0a]">{aff.impactScore}% Threat</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Triage Action Box */}
              <div className="space-y-3 pt-4 border-t border-[#cfd9de]">
                <h4 className="text-xs font-bold text-[#71767b] uppercase tracking-wider">
                  Inter-Departmental Response Log
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter dispatch notes, signal adjustments, or feeder load transfers..."
                    className="flex-1 bg-white border border-[#cfd9de] text-xs text-[#222222] rounded-lg px-3 py-2.5 focus:border-[#222222] focus:outline-none"
                  />
                  {selectedAlert.status !== 'RESOLVED' && (
                    <>
                      {selectedAlert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleAcknowledge(selectedAlert.id)}
                          className="px-4 py-2.5 bg-[#e8e8e8] hover:bg-[#cfd9de] text-[#222222] font-semibold text-xs rounded-lg transition-colors border border-[#cfd9de]"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(selectedAlert.id)}
                        className="px-4 py-2.5 bg-[#222222] hover:bg-[#0a0a0a] text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        Resolve Incident
                      </button>
                    </>
                  )}
                </div>
                {selectedAlert.resolutionNote && (
                  <div className="p-3 bg-[#fafafa] border border-[#cfd9de] rounded-lg text-xs font-mono text-[#444444]">
                    <span className="font-bold text-[#222222]">Resolved By {selectedAlert.resolvedBy || 'Coordinator'}:</span> {selectedAlert.resolutionNote}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#cfd9de] rounded-lg text-xs text-[#71767b]">
              Select an incident from the list to view telemetry and execute response workflows.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

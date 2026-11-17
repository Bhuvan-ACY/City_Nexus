import React, { useState } from 'react';
import { useCityNexusStore } from '../../stores/useCityNexusStore';
import { ShieldAlert } from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useCityNexusStore();

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#cfd9de] dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] dark:text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="h-7 w-7 text-[#222222] dark:text-rose-400" />
            Multi-Agency Incident Triage Command
          </h1>
          <p className="text-sm text-[#71767b] dark:text-slate-400 mt-1">
            Coordinate inter-departmental responses across Traffic, Power Grid, and Water utilities.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-[#71767b] dark:text-slate-400 px-2 text-xs font-bold uppercase">Status:</span>
            {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1.5 rounded-md font-semibold text-xs capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-[#222222] dark:bg-slate-700 text-white'
                    : 'text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-800'
                }`}
              >
                {st.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-[#71767b] dark:text-slate-400 px-2 text-xs font-bold uppercase">Severity:</span>
            {(['ALL', 'CRITICAL', 'WARNING'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1.5 rounded-md font-semibold text-xs capitalize transition-all ${
                  filterSeverity === sev
                    ? 'bg-[#222222] dark:bg-slate-700 text-white'
                    : 'text-[#444444] dark:text-slate-300 hover:text-[#222222] dark:hover:text-white hover:bg-[#e8e8e8]/50 dark:hover:bg-slate-800'
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
        <div className="lg:col-span-1 space-y-3 max-h-72 sm:max-h-96 lg:max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg text-sm text-[#71767b] dark:text-slate-400">
              No incident alerts matching selected criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-[#222222] dark:border-blue-500 ring-2 ring-[#222222] dark:ring-blue-500 shadow-sm'
                      : 'bg-white dark:bg-[#161f30] border-[#cfd9de] dark:border-slate-800 hover:border-[#808080] dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-[#71767b] dark:text-slate-400 font-mono">
                      {alert.status}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#222222] dark:text-slate-100 line-clamp-1">{alert.title}</h4>
                  <p className="text-xs sm:text-sm text-[#444444] dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">{alert.description}</p>
                  <div className="mt-3 pt-2.5 border-t border-[#e8e8e8] dark:border-slate-800 flex items-center justify-between text-xs font-mono text-[#71767b] dark:text-slate-400">
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
            <div className="bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#cfd9de] dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                      selectedAlert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {selectedAlert.severity}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#71767b] dark:text-slate-400">
                      ID: {selectedAlert.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold border border-[#cfd9de] dark:border-slate-700 bg-[#e8e8e8] dark:bg-slate-800 text-[#222222] dark:text-slate-100">
                      {selectedAlert.status}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#222222] dark:text-slate-100">{selectedAlert.title}</h2>
                  <p className="text-xs sm:text-sm text-[#71767b] dark:text-slate-400 mt-1 font-mono">
                    Origin Asset: {selectedAlert.nodeName} • Zone: {selectedAlert.zoneId} • Domain: {selectedAlert.domain}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#71767b] dark:text-slate-400 uppercase tracking-wider">
                  Incident Telemetry Assessment
                </h4>
                <p className="text-sm text-[#444444] dark:text-slate-200 leading-relaxed bg-[#fafafa] dark:bg-[#161f30] p-4 rounded-lg border border-[#cfd9de] dark:border-slate-800">
                  {selectedAlert.description}
                </p>
              </div>

              {/* Affected Systems Table */}
              {selectedAlert.affectedSystems && selectedAlert.affectedSystems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#71767b] dark:text-slate-400 uppercase tracking-wider">
                    Downstream Cascade Threat Coupling
                  </h4>
                  <div className="border border-[#cfd9de] dark:border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#fafafa] dark:bg-slate-800/80 text-[#71767b] dark:text-slate-400 text-xs uppercase border-b border-[#cfd9de] dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3.5">Impacted Asset</th>
                          <th className="py-2.5 px-3.5">Domain</th>
                          <th className="py-2.5 px-3.5">Vulnerability Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8e8e8] dark:divide-slate-800 font-mono text-xs sm:text-sm">
                        {selectedAlert.affectedSystems.map((aff, i) => (
                          <tr key={i} className="hover:bg-[#fafafa] dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-2.5 px-3.5 font-sans font-medium text-[#222222] dark:text-slate-100">{aff.name}</td>
                            <td className="py-2.5 px-3.5 capitalize font-sans text-[#444444] dark:text-slate-300">{aff.domain}</td>
                            <td className="py-2.5 px-3.5 font-bold text-rose-600 dark:text-rose-400">{aff.impactScore}% Threat</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Triage Action Box */}
              <div className="space-y-3 pt-4 border-t border-[#cfd9de] dark:border-slate-800">
                <h4 className="text-xs font-bold text-[#71767b] dark:text-slate-400 uppercase tracking-wider">
                  Inter-Departmental Response Log
                </h4>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter dispatch notes, signal adjustments, or feeder load transfers..."
                    className="flex-1 bg-white dark:bg-slate-800 border border-[#cfd9de] dark:border-slate-700 text-sm text-[#222222] dark:text-slate-100 rounded-lg px-3.5 py-2.5 focus:border-[#222222] dark:focus:border-slate-500 focus:outline-none placeholder-[#909090] dark:placeholder-slate-500"
                  />
                  {selectedAlert.status !== 'RESOLVED' && (
                    <div className="flex gap-2">
                      {selectedAlert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleAcknowledge(selectedAlert.id)}
                          className="px-4 py-2.5 bg-[#e8e8e8] dark:bg-slate-800 hover:bg-[#cfd9de] dark:hover:bg-slate-700 text-[#222222] dark:text-slate-100 font-semibold text-sm rounded-lg transition-colors border border-[#cfd9de] dark:border-slate-700"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(selectedAlert.id)}
                        className="px-4 py-2.5 bg-[#222222] dark:bg-blue-600 hover:bg-[#0a0a0a] dark:hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors"
                      >
                        Resolve Incident
                      </button>
                    </div>
                  )}
                </div>
                {selectedAlert.resolutionNote && (
                  <div className="p-3.5 bg-[#fafafa] dark:bg-slate-800/60 border border-[#cfd9de] dark:border-slate-700 rounded-lg text-xs sm:text-sm font-mono text-[#444444] dark:text-slate-300">
                    <span className="font-bold text-[#222222] dark:text-slate-100">Resolved By {selectedAlert.resolvedBy || 'Coordinator'}:</span> {selectedAlert.resolutionNote}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 rounded-lg text-sm text-[#71767b] dark:text-slate-400">
              Select an incident from the list to view telemetry and execute response workflows.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

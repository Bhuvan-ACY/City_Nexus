import { create } from 'zustand';
import { 
  Zone, 
  InfrastructureNode, 
  InfrastructureEdge, 
  Alert, 
  WeatherData, 
  UserProfile, 
  SimulationParameters, 
  SimulationResult,
  UserRole
} from '../types/domain.types';
import { 
  INITIAL_ZONES, 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  INITIAL_ALERTS, 
  INITIAL_WEATHER, 
  INITIAL_USER 
} from '../data/mockData';
import { cityNexusBackend } from '../lib/supabase';

interface CityNexusState {
  // Auth & Session
  currentUser: UserProfile;
  currentUserRole: UserRole;
  setUserRole: (role: UserRole) => void;
  setCurrentUserRole: (role: UserRole) => void;

  // Realtime Telemetry & Data
  weather: WeatherData;
  zones: Zone[];
  nodes: InfrastructureNode[];
  edges: InfrastructureEdge[];
  alerts: Alert[];
  simulationHistory: SimulationResult[];
  isBackendConnected: boolean;

  // Active UI Controls
  selectedZoneId: string | null;
  selectedDomain: 'all' | 'traffic' | 'electricity' | 'utilities';
  selectedNodeId: string | null;
  activeDrawer: 'none' | 'node' | 'alert' | 'simulation';
  isLiveStreaming: boolean;

  // Init & Sync
  initializeBackendSync: () => Promise<void>;

  // Actions
  setSelectedZoneId: (id: string | null) => void;
  setSelectedDomain: (domain: 'all' | 'traffic' | 'electricity' | 'utilities') => void;
  setSelectedNodeId: (id: string | null) => void;
  setActiveDrawer: (drawer: 'none' | 'node' | 'alert' | 'simulation') => void;
  toggleLiveStreaming: () => void;
  
  // Alert Actions
  acknowledgeAlert: (alertId: string, note: string) => Promise<void>;
  resolveAlert: (alertId: string, note: string) => Promise<void>;

  // Topology CRUD (Admin)
  addNode: (node: Omit<InfrastructureNode, 'id'>) => void;
  updateNodeStatus: (nodeId: string, status: InfrastructureNode['status']) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Omit<InfrastructureEdge, 'id'>) => void;
  deleteEdge: (edgeId: string) => void;

  // Simulation Engine
  runSimulation: (params: SimulationParameters) => SimulationResult;
  resetSimulation: () => void;
}

export const useCityNexusStore = create<CityNexusState>((set, get) => ({
  currentUser: INITIAL_USER,
  currentUserRole: 'city_planner',
  setUserRole: (role) => set((s) => ({ currentUser: { ...s.currentUser, role }, currentUserRole: role })),
  setCurrentUserRole: (role) => set((s) => ({ currentUser: { ...s.currentUser, role }, currentUserRole: role })),

  weather: INITIAL_WEATHER,
  zones: INITIAL_ZONES,
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  alerts: INITIAL_ALERTS,
  simulationHistory: [],
  isBackendConnected: false,

  selectedZoneId: null,
  selectedDomain: 'all',
  selectedNodeId: null,
  activeDrawer: 'none',
  isLiveStreaming: true,

  initializeBackendSync: async () => {
    try {
      const [remoteZones, remoteNodes, remoteEdges, remoteAlerts] = await Promise.all([
        cityNexusBackend.fetchZones(),
        cityNexusBackend.fetchNodes(),
        cityNexusBackend.fetchEdges(),
        cityNexusBackend.fetchAlerts(),
      ]);

      const updates: Partial<CityNexusState> = { isBackendConnected: true };
      if (remoteZones && remoteZones.length > 0) updates.zones = remoteZones;
      if (remoteNodes && remoteNodes.length > 0) updates.nodes = remoteNodes;
      if (remoteEdges && remoteEdges.length > 0) updates.edges = remoteEdges;
      if (remoteAlerts && remoteAlerts.length > 0) updates.alerts = remoteAlerts;

      set(updates);

      // Setup Realtime Postgres Subscription for Alerts
      cityNexusBackend.subscribeToAlerts((updatedAlert) => {
        set((state) => {
          const exists = state.alerts.some((a) => a.id === updatedAlert.id);
          return {
            alerts: exists
              ? state.alerts.map((a) => (a.id === updatedAlert.id ? updatedAlert : a))
              : [updatedAlert, ...state.alerts],
          };
        });
      });
    } catch {
      // Graceful fallback to rich local state if Supabase table is waiting for migration
      set({ isBackendConnected: false });
    }
  },

  setSelectedZoneId: (id) => set({ selectedZoneId: id }),
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id, activeDrawer: id ? 'node' : 'none' }),
  setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
  toggleLiveStreaming: () => set((s) => ({ isLiveStreaming: !s.isLiveStreaming })),

  acknowledgeAlert: async (alertId, note) => {
    const { currentUser } = get();
    // Optimistic local state update
    set((state) => ({
      alerts: state.alerts.map((alt) => 
        alt.id === alertId 
          ? { ...alt, status: 'ACKNOWLEDGED', resolvedBy: currentUser.name, resolutionNote: note }
          : alt
      ),
    }));
    // Sync with Supabase BaaS
    await cityNexusBackend.updateAlertStatus(alertId, 'ACKNOWLEDGED', currentUser.name, note);
  },

  resolveAlert: async (alertId, note) => {
    const { currentUser } = get();
    // Optimistic local state update
    set((state) => ({
      alerts: state.alerts.map((alt) => 
        alt.id === alertId 
          ? { ...alt, status: 'RESOLVED', resolvedAt: new Date().toISOString(), resolvedBy: currentUser.name, resolutionNote: note }
          : alt
      ),
    }));
    // Sync with Supabase BaaS
    await cityNexusBackend.updateAlertStatus(alertId, 'RESOLVED', currentUser.name, note);
  },

  addNode: (nodeData) => {
    const newNode: InfrastructureNode = {
      ...nodeData,
      id: `NODE-${Date.now().toString().slice(-4)}`,
    };
    set((s) => ({ nodes: [...s.nodes, newNode] }));
  },

  updateNodeStatus: (nodeId, status) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === nodeId ? { ...n, status } : n)
  })),

  deleteNode: (nodeId) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== nodeId),
    edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
  })),

  addEdge: (edgeData) => {
    const newEdge: InfrastructureEdge = {
      ...edgeData,
      id: `EDGE-${Date.now().toString().slice(-4)}`,
    };
    set((s) => ({ edges: [...s.edges, newEdge] }));
  },

  deleteEdge: (edgeId) => set((s) => ({
    edges: s.edges.filter((e) => e.id !== edgeId),
  })),

  resetSimulation: () => set({ simulationHistory: [] }),

  runSimulation: (params) => {
    const state = get();
    const runId = `SIM-${Date.now().toString().slice(-5)}`;
    
    // Find nodes in target zone & domain
    const rootNodes = state.nodes.filter(
      (n) => (params.targetZone === 'ALL' || n.zoneId === params.targetZone) && n.domain === params.targetDomain
    );

    const affectedSet = new Set<string>();
    const cascadingChain: Array<{ sourceName: string; targetName: string; domain: any; impact: number }> = [];

    rootNodes.forEach((rn) => {
      affectedSet.add(rn.id);
      // find outgoing edges
      const outgoing = state.edges.filter((e) => e.source === rn.id);
      outgoing.forEach((e) => {
        const targetNode = state.nodes.find((n) => n.id === e.target);
        if (targetNode) {
          affectedSet.add(targetNode.id);
          const computedImpact = (params.perturbationPct / 100) * e.propagationFactor;
          cascadingChain.push({
            sourceName: rn.name,
            targetName: targetNode.name,
            domain: targetNode.domain,
            impact: Math.round(computedImpact * 100),
          });
        }
      });
    });

    // Compute zone deltas
    const zoneDeltas = state.zones.map((zone) => {
      const isTarget = params.targetZone === 'ALL' || zone.id === params.targetZone;
      const factor = isTarget ? params.perturbationPct / 100 : (params.perturbationPct / 100) * 0.35;
      
      const baselineTraffic = zone.metrics.trafficCongestion;
      const baselineGrid = zone.metrics.gridLoad;
      const baselinePressure = zone.metrics.waterPressure;

      let projTraffic = baselineTraffic;
      let projGrid = baselineGrid;
      let projPressure = baselinePressure;

      if (params.targetDomain === 'traffic') {
        projTraffic = Math.min(100, Math.max(10, baselineTraffic * (1 + factor)));
        // Cascades into grid via EV & signals
        projGrid = Math.min(100, Math.max(15, baselineGrid * (1 + factor * 0.32)));
        // Cascades slightly into water
        projPressure = Math.max(15, baselinePressure * (1 - factor * 0.12));
      } else if (params.targetDomain === 'electricity') {
        projGrid = Math.min(100, Math.max(10, baselineGrid * (1 + factor)));
        // Grid outages cascade immediately into signals
        projTraffic = Math.min(100, Math.max(10, baselineTraffic * (1 + factor * 0.45)));
        // Grid outages stop booster pumps
        projPressure = Math.max(10, baselinePressure * (1 - factor * 0.55));
      } else {
        projPressure = Math.max(10, baselinePressure * (1 + factor));
        projTraffic = Math.min(100, Math.max(10, baselineTraffic * (1 + Math.abs(factor) * 0.2)));
      }

      return {
        zoneId: zone.id,
        zoneName: zone.name,
        domain: params.targetDomain,
        baseline: params.targetDomain === 'traffic' ? baselineTraffic : params.targetDomain === 'electricity' ? baselineGrid : baselinePressure,
        projected: Math.round(params.targetDomain === 'traffic' ? projTraffic : params.targetDomain === 'electricity' ? projGrid : projPressure),
        deltaPct: Math.round(((projTraffic - baselineTraffic) / baselineTraffic) * 100),
        unit: params.targetDomain === 'utilities' ? 'PSI' : '%',
      };
    });

    const result: SimulationResult = {
      runId,
      timestamp: new Date().toISOString(),
      parameters: params,
      affectedAssetsCount: affectedSet.size,
      criticalRiskCount: Math.ceil(affectedSet.size * 0.3),
      zoneDeltas,
      cascadingChain,
    };

    set((s) => ({ simulationHistory: [result, ...s.simulationHistory] }));
    
    // Asynchronously log to Supabase
    cityNexusBackend.saveSimulationRun(result);
    return result;
  },
}));

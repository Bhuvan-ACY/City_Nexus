import { createClient } from '@supabase/supabase-js';
import { Zone, InfrastructureNode, InfrastructureEdge, Alert, SimulationResult, UserProfile, UserRole } from '../types/domain.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fbaghcstqrnzdezldqfb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYWdoY3N0cXJuemRlemxkcWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4ODk4ODcsImV4cCI6MjExMDQ2NTg4N30.TD3kQn2BwVfBIeFtSs36x71BlxYKzrTAawL7GyuQass';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * CityNexus Supabase BaaS Service Layer
 * Provides live querying, real-time subscriptions, and persistent state mutations.
 */
export const cityNexusBackend = {
  // 1. ZONES
  async fetchZones(): Promise<Zone[] | null> {
    try {
      const { data, error } = await supabase.from('zones').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((z: any) => ({
        id: z.id,
        name: z.name,
        code: z.code,
        coordinates: typeof z.coordinates === 'string' ? JSON.parse(z.coordinates) : z.coordinates,
        center: typeof z.center === 'string' ? JSON.parse(z.center) : z.center,
        healthScore: Number(z.health_score),
        metrics: typeof z.metrics === 'string' ? JSON.parse(z.metrics) : z.metrics,
      }));
    } catch {
      return null;
    }
  },

  // 2. INFRASTRUCTURE NODES
  async fetchNodes(): Promise<InfrastructureNode[] | null> {
    try {
      const { data, error } = await supabase.from('infrastructure_nodes').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((n: any) => ({
        id: n.id,
        name: n.name,
        domain: n.domain,
        zoneId: n.zone_id,
        lat: Number(n.lat),
        lng: Number(n.lng),
        status: n.status,
        capacity: n.capacity,
        currentValue: Number(n.current_value),
        unit: n.unit,
        description: n.description || '',
        currentMetrics: typeof n.current_metrics === 'string' ? JSON.parse(n.current_metrics) : n.current_metrics,
      }));
    } catch {
      return null;
    }
  },

  // 3. INFRASTRUCTURE EDGES
  async fetchEdges(): Promise<InfrastructureEdge[] | null> {
    try {
      const { data, error } = await supabase.from('infrastructure_edges').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        dependencyType: e.dependency_type,
        weight: Number(e.weight),
        propagationFactor: Number(e.propagation_factor),
      }));
    } catch {
      return null;
    }
  },

  // 4. ALERTS
  async fetchAlerts(): Promise<Alert[] | null> {
    try {
      const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return null;
      return data.map((a: any) => ({
        id: a.id,
        nodeId: a.node_id,
        nodeName: a.node_name,
        domain: a.domain,
        zoneId: a.zone_id,
        severity: a.severity,
        title: a.title,
        description: a.description || '',
        affectedSystems: typeof a.affected_systems === 'string' ? JSON.parse(a.affected_systems) : a.affected_systems || [],
        status: a.status,
        createdAt: a.created_at,
        resolvedAt: a.resolved_at,
        resolvedBy: a.resolved_by,
        resolutionNote: a.resolution_note,
      }));
    } catch {
      return null;
    }
  },

  async updateAlertStatus(alertId: string, status: 'ACKNOWLEDGED' | 'RESOLVED', resolvedBy: string, note: string) {
    try {
      const updatePayload: Record<string, any> = {
        status,
        resolved_by: resolvedBy,
        resolution_note: note,
      };
      if (status === 'RESOLVED') {
        updatePayload.resolved_at = new Date().toISOString();
      }
      const { error } = await supabase.from('alerts').update(updatePayload).eq('id', alertId);
      return !error;
    } catch {
      return false;
    }
  },

  // 5. SIMULATION PERSISTENCE
  async saveSimulationRun(sim: SimulationResult) {
    try {
      const { error } = await supabase.from('simulation_runs').insert({
        id: sim.runId,
        parameters: sim.parameters,
        affected_assets_count: sim.affectedAssetsCount,
        critical_risk_count: sim.criticalRiskCount,
        zone_deltas: sim.zoneDeltas,
        cascading_chain: sim.cascadingChain,
      });
      return !error;
    } catch {
      return false;
    }
  },

  // 6. REAL-TIME EVENT SUBSCRIPTION
  subscribeToAlerts(onInsertOrUpdate: (alert: Alert) => void) {
    return supabase
      .channel('realtime:alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
        const row: any = payload.new;
        if (row && row.id) {
          onInsertOrUpdate({
            id: row.id,
            nodeId: row.node_id,
            nodeName: row.node_name,
            domain: row.domain,
            zoneId: row.zone_id,
            severity: row.severity,
            title: row.title,
            description: row.description || '',
            affectedSystems: typeof row.affected_systems === 'string' ? JSON.parse(row.affected_systems) : row.affected_systems || [],
            status: row.status,
            createdAt: row.created_at,
            resolvedAt: row.resolved_at,
            resolvedBy: row.resolved_by,
            resolutionNote: row.resolution_note,
          });
        }
      })
      .subscribe();
  },

  // 7. USER AUTHENTICATION
  async signInWithEmail(email: string, role: UserRole): Promise<UserProfile> {
    return {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role,
      department: role === 'traffic_controller' 
        ? 'Traffic Management Authority' 
        : role === 'grid_operator' 
        ? 'Metropolitan Electricity Supply' 
        : role === 'utility_manager' 
        ? 'Water Supply and Sewerage Board' 
        : 'Urban Planning Commission',
    };
  },
};

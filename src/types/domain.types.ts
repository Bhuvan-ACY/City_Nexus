export type DomainType = 'traffic' | 'electricity' | 'utilities';
export type HealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type AlertSeverity = 'INFORMATIONAL' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
export type UserRole = 
  | 'city_planner' 
  | 'traffic_controller' 
  | 'grid_operator' 
  | 'utility_manager' 
  | 'admin'
  | 'public' 
  | 'operations_manager' 
  | 'emergency_coordinator';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number][]; // Lat, Lng
  center: [number, number];
  healthScore: number; // 0 - 100
  metrics: {
    trafficCongestion: number; // %
    gridLoad: number; // %
    waterPressure: number; // PSI
  };
}

export interface NodeMetrics {
  loadMw?: number;
  capacityMw?: number;
  loadPercentage?: number;
  temperatureC?: number;
  congestionIndex?: number;
  speedKmh?: number;
  flowVehiclesPerHour?: number;
  flowRateMld?: number;
  pressureBar?: number;
  reservoirLevelPercent?: number;
}

export interface InfrastructureNode {
  id: string;
  name: string;
  domain: DomainType;
  zoneId: string;
  lat: number;
  lng: number;
  status: HealthStatus;
  capacity: string;
  currentValue: number;
  unit: string;
  description: string;
  currentMetrics?: NodeMetrics;
}

export interface InfrastructureEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  dependencyType: 'powers' | 'feeds' | 'controls' | 'protects';
  weight: number; // 0.01 - 1.0
  propagationFactor: number; // 0.01 - 1.0
}

export interface MetricRecord {
  id: string;
  nodeId: string;
  domain: DomainType;
  zoneId: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  nodeId: string;
  nodeName: string;
  domain: DomainType;
  zoneId: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedSystems: Array<{
    nodeId: string;
    name: string;
    domain: DomainType;
    zoneId: string;
    impactScore: number;
  }>;
  status: AlertStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface SimulationParameters {
  targetDomain: DomainType;
  targetZone: string;
  perturbationPct: number; // e.g. +30%
}

export interface SimulationResult {
  runId: string;
  timestamp: string;
  parameters: SimulationParameters;
  affectedAssetsCount: number;
  criticalRiskCount: number;
  zoneDeltas: Array<{
    zoneId: string;
    zoneName: string;
    domain: DomainType;
    baseline: number;
    projected: number;
    deltaPct: number;
    unit: string;
  }>;
  cascadingChain: Array<{
    sourceName: string;
    targetName: string;
    domain: DomainType;
    impact: number;
  }>;
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  precipitation: number;
  lastUpdated: string;
}

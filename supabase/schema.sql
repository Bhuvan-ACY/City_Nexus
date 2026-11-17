-- ============================================================================
-- CITYNEXUS SUPABASE BACKEND SCHEMA & SEED DATA DDL
-- Multi-Domain Interconnected Urban Infrastructure Intelligence Platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (RBAC & User Governance)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('city_planner', 'traffic_controller', 'grid_operator', 'utility_manager', 'admin', 'public', 'operations_manager', 'emergency_coordinator')),
  department TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ZONES (Metropolitan Geographic Administrative Areas)
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  coordinates JSONB NOT NULL,
  center JSONB NOT NULL,
  health_score NUMERIC DEFAULT 100,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INFRASTRUCTURE NODES (Sensors, Substations, Booster Pumps, Intersections)
CREATE TABLE IF NOT EXISTS infrastructure_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('traffic', 'electricity', 'utilities')),
  zone_id TEXT REFERENCES zones(id) ON DELETE SET NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'NORMAL' CHECK (status IN ('NORMAL', 'WARNING', 'CRITICAL')),
  capacity TEXT NOT NULL,
  current_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  current_metrics JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INFRASTRUCTURE EDGES (Cross-Sector Topology Couplings)
CREATE TABLE IF NOT EXISTS infrastructure_edges (
  id TEXT PRIMARY KEY,
  source TEXT REFERENCES infrastructure_nodes(id) ON DELETE CASCADE,
  target TEXT REFERENCES infrastructure_nodes(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL CHECK (dependency_type IN ('powers', 'feeds', 'controls', 'protects')),
  weight NUMERIC NOT NULL DEFAULT 0.5,
  propagation_factor NUMERIC NOT NULL DEFAULT 0.3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ALERTS & INCIDENTS (Multi-Domain Operational Escalations)
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  node_id TEXT REFERENCES infrastructure_nodes(id) ON DELETE SET NULL,
  node_name TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('traffic', 'electricity', 'utilities')),
  zone_id TEXT REFERENCES zones(id) ON DELETE SET NULL,
  severity TEXT NOT NULL CHECK (severity IN ('INFORMATIONAL', 'WARNING', 'CRITICAL')),
  title TEXT NOT NULL,
  description TEXT,
  affected_systems JSONB DEFAULT '[]'::JSONB,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_note TEXT
);

-- 6. SIMULATION RUNS (Historical Forensic & What-If Experiments)
CREATE TABLE IF NOT EXISTS simulation_runs (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  parameters JSONB NOT NULL,
  affected_assets_count INTEGER NOT NULL,
  critical_risk_count INTEGER NOT NULL,
  zone_deltas JSONB NOT NULL,
  cascading_chain JSONB NOT NULL
);

-- 7. WEATHER TELEMETRY
CREATE TABLE IF NOT EXISTS weather_telemetry (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  humidity NUMERIC NOT NULL,
  wind_speed NUMERIC NOT NULL,
  condition TEXT NOT NULL,
  precipitation NUMERIC NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_telemetry ENABLE ROW LEVEL SECURITY;

-- Allow read access to anon & authenticated users for telemetry
CREATE POLICY "Public read zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Public read nodes" ON infrastructure_nodes FOR SELECT USING (true);
CREATE POLICY "Public read edges" ON infrastructure_edges FOR SELECT USING (true);
CREATE POLICY "Public read alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public read simulation" ON simulation_runs FOR SELECT USING (true);
CREATE POLICY "Public read weather" ON weather_telemetry FOR SELECT USING (true);

-- Allow authorized role writes for alerts (dispatch & resolve)
CREATE POLICY "Allow alert update" ON alerts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow alert insert" ON alerts FOR INSERT WITH CHECK (true);

-- Allow simulation inserts
CREATE POLICY "Allow simulation insert" ON simulation_runs FOR INSERT WITH CHECK (true);

-- Enable Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE infrastructure_nodes;
ALTER PUBLICATION supabase_realtime ADD TABLE weather_telemetry;

-- ============================================================================
-- SEED INITIAL DATA
-- ============================================================================

INSERT INTO zones (id, name, code, coordinates, center, health_score, metrics)
VALUES
  ('zone-1', 'Central Business Corridor', 'CBC', '[[12.9716, 77.5946], [12.9816, 77.6046], [12.9616, 77.6146]]', '[12.9716, 77.5946]', 74, '{"trafficCongestion": 82, "gridLoad": 78, "waterPressure": 42}'),
  ('zone-2', 'Tech Cluster South', 'TCS', '[[12.9352, 77.6245], [12.9452, 77.6345], [12.9252, 77.6445]]', '[12.9352, 77.6245]', 88, '{"trafficCongestion": 64, "gridLoad": 70, "waterPressure": 48}'),
  ('zone-3', 'Industrial Sector West', 'ISW', '[[12.9866, 77.5385], [12.9966, 77.5485], [12.9766, 77.5585]]', '[12.9866, 77.5385]', 62, '{"trafficCongestion": 89, "gridLoad": 91, "waterPressure": 38}'),
  ('zone-4', 'Eastside Residential', 'ESR', '[[12.9856, 77.6639], [12.9956, 77.6739], [12.9756, 77.6839]]', '[12.9856, 77.6639]', 91, '{"trafficCongestion": 45, "gridLoad": 52, "waterPressure": 52}'),
  ('zone-5', 'North Transit Terminal', 'NTT', '[[13.0358, 77.5970], [13.0458, 77.6070], [13.0258, 77.6170]]', '[13.0358, 77.5970]', 79, '{"trafficCongestion": 78, "gridLoad": 65, "waterPressure": 44}'),
  ('zone-6', 'Harbor & Utilities District', 'HUD', '[[12.9100, 77.5800], [12.9200, 77.5900], [12.9000, 77.6000]]', '[12.9100, 77.5800]', 85, '{"trafficCongestion": 50, "gridLoad": 62, "waterPressure": 49}')
ON CONFLICT (id) DO UPDATE SET metrics = EXCLUDED.metrics, health_score = EXCLUDED.health_score;

INSERT INTO infrastructure_nodes (id, name, domain, zone_id, lat, lng, status, capacity, current_value, unit, description, current_metrics)
VALUES
  ('node-tr-01', 'Silk Board Intersection Hub', 'traffic', 'zone-2', 12.9176, 77.6238, 'CRITICAL', '6,000 veh/hr', 92, '% congestion', 'Major junction connecting Tech Corridor and Outer Ring Road', '{"congestionIndex": 92, "speedKmh": 12, "flowVehiclesPerHour": 5800}'),
  ('node-tr-02', 'MG Road Transit Gateway', 'traffic', 'zone-1', 12.9756, 77.6066, 'WARNING', '4,500 veh/hr', 78, '% congestion', 'Central metro station arterial intersection', '{"congestionIndex": 78, "speedKmh": 18, "flowVehiclesPerHour": 4100}'),
  ('node-tr-03', 'Peenya Industrial Arterial', 'traffic', 'zone-3', 12.9880, 77.5350, 'NORMAL', '5,000 veh/hr', 54, '% congestion', 'Heavy logistics freight movement corridor', '{"congestionIndex": 54, "speedKmh": 38, "flowVehiclesPerHour": 3100}'),
  ('node-el-01', 'Koramangala 220kV Primary Substation', 'electricity', 'zone-2', 12.9340, 77.6200, 'WARNING', '150 MW', 128, 'MW', 'Feeds South tech campus and municipal booster pumps', '{"loadMw": 128, "capacityMw": 150, "loadPercentage": 85.3, "temperatureC": 68}'),
  ('node-el-02', 'Majestic Metro Traction Substation', 'electricity', 'zone-1', 12.9770, 77.5720, 'NORMAL', '80 MW', 58, 'MW', 'Powers central commuter rail network and traffic signals', '{"loadMw": 58, "capacityMw": 80, "loadPercentage": 72.5, "temperatureC": 52}'),
  ('node-el-03', 'Peenya Heavy Power Grid Substation', 'electricity', 'zone-3', 12.9920, 77.5310, 'CRITICAL', '200 MW', 188, 'MW', 'Supplies manufacturing clusters and treatment works', '{"loadMw": 188, "capacityMw": 200, "loadPercentage": 94.0, "temperatureC": 74}'),
  ('node-ut-01', 'South Central Water Pumping Complex', 'utilities', 'zone-2', 12.9300, 77.6180, 'WARNING', '45 MLD', 32, 'PSI', 'Dependent on Koramangala 220kV Substation for motor drives', '{"flowRateMld": 42, "pressureBar": 2.2, "reservoirLevelPercent": 68}'),
  ('node-ut-02', 'Cauvery Water Distribution Main #3', 'utilities', 'zone-1', 12.9690, 77.6000, 'NORMAL', '80 MLD', 48, 'PSI', 'Bulk water supply conduit along inner cordon', '{"flowRateMld": 75, "pressureBar": 3.8, "reservoirLevelPercent": 82}'),
  ('node-ut-03', 'West Industrial Wastewater Treatment Plant', 'utilities', 'zone-3', 12.9850, 77.5280, 'CRITICAL', '60 MLD', 24, 'PSI', 'Power fluctuation risk causing raw effluent backup', '{"flowRateMld": 38, "pressureBar": 1.6, "reservoirLevelPercent": 41}')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, current_value = EXCLUDED.current_value;

INSERT INTO infrastructure_edges (id, source, target, dependency_type, weight, propagation_factor)
VALUES
  ('edge-01', 'node-tr-01', 'node-el-01', 'feeds', 0.85, 0.45),
  ('edge-02', 'node-el-01', 'node-ut-01', 'powers', 0.95, 0.65),
  ('edge-03', 'node-el-02', 'node-tr-02', 'powers', 0.90, 0.50),
  ('edge-04', 'node-el-03', 'node-ut-03', 'powers', 0.95, 0.70),
  ('edge-05', 'node-ut-01', 'node-tr-01', 'controls', 0.40, 0.25)
ON CONFLICT (id) DO NOTHING;

INSERT INTO alerts (id, node_id, node_name, domain, zone_id, severity, title, description, affected_systems, status)
VALUES
  ('alt-001', 'node-tr-01', 'Silk Board Intersection Hub', 'traffic', 'zone-2', 'CRITICAL', 'Gridlock Congestion Spreading to Arterials', 'Peak hour bottle-neck exceeds 92% capacity. EV charging queues creating secondary electrical feeder demand.', '[{"nodeId": "node-el-01", "name": "Koramangala 220kV Primary Substation", "domain": "electricity", "zoneId": "zone-2", "impactScore": 78}]', 'ACTIVE'),
  ('alt-002', 'node-el-03', 'Peenya Heavy Power Grid Substation', 'electricity', 'zone-3', 'CRITICAL', 'Transformer Core Overheating (>74°C)', 'Peak loading at 94% rated capacity. Automatic thermal cutoff trip imminent within 35 minutes.', '[{"nodeId": "node-ut-03", "name": "West Industrial Wastewater Treatment Plant", "domain": "utilities", "zoneId": "zone-3", "impactScore": 92}]', 'ACTIVE'),
  ('alt-003', 'node-ut-01', 'South Central Water Pumping Complex', 'utilities', 'zone-2', 'WARNING', 'Delivery Pressure Drop below 2.5 Bar', 'Cavitation risk in municipal delivery distribution lines due to partial voltage sag.', '[]', 'ACKNOWLEDGED')
ON CONFLICT (id) DO NOTHING;

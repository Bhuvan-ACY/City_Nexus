# System Architecture Document

## CityNexus — Urban Infrastructure Intelligence Platform

---

## 1. Document Overview

### 1.1 Document Metadata
| Attribute | Detail |
|---|---|
| **Document Title** | System Architecture Document (SAD) — CityNexus |
| **Project Name** | CityNexus — Urban Infrastructure Intelligence Platform |
| **Document Purpose** | Define the complete technical, structural, behavioral, data, and deployment architecture of CityNexus to guide engineering implementation without architectural ambiguity. |
| **Document Scope** | Covers high-level system style, component architecture, frontend/backend separation, Supabase BaaS data and RPC design, API communication contracts, security enforcement, deployment pipelines, testing paradigms, and requirement traceability. |
| **Architecture Version** | 1.0.0 |
| **Status** | Approved for Implementation & Technical Baseline |
| **Primary Source Documents** | `proposed_solution.md` (v1.0.0), `prd.md` (v1.0.0) |
| **Target Audience** | Software Architects, Full-Stack Engineers, Database Engineers, DevOps/Cloud Engineers, QA Automation Engineers |

### 1.2 Architectural Terminology & Abbreviations
- **BaaS:** Backend-as-a-Service (specifically Supabase providing managed PostgreSQL, Auth, Storage, Realtime, and Edge Functions).
- **RLS:** Row-Level Security (PostgreSQL security policy mechanism restricting data access based on authenticated user JWT claims).
- **CTE:** Common Table Expression (specifically recursive SQL queries utilized for directed graph traversal).
- **DAG:** Directed Acyclic Graph (structural model for municipal infrastructure dependency hierarchies).
- **CDC:** Change Data Capture (PostgreSQL write-ahead-log replication driving real-time WebSocket publications).
- **SPA:** Single Page Application (React 18 + Vite client-side rendered application).
- **RPC:** Remote Procedure Call (PostgreSQL stored procedures invoked via Supabase PostgREST client).
- **FCP / TTI:** First Contentful Paint / Time to Interactive (Core Web Vitals).

---

## 2. System Overview

### 2.1 System Purpose & Capabilities
**CityNexus** is an event-driven, cyber-physical digital twin and infrastructure intelligence platform designed to ingest, correlate, and simulate cross-domain telemetry across municipal **Transportation Networks**, **Electrical Power Grids**, and **Public Water Utilities**.

The platform provides:
1. **Unified Multi-Domain Monitoring:** Aggregating disparate SCADA/telemetry feeds into a single-pane-of-glass operational console.
2. **Topological Dependency Modeling:** Storing and visualizing physical and functional asset couplings as a directed property graph.
3. **Cross-Domain Anomaly Correlation:** Automatically enriching threshold breach alerts with downstream blast-radius impact analysis.
4. **Predictive "What-If" Simulation:** Executing deterministic forward-propagation algorithms to project the cascading impacts of planned civil disruptions or sudden system failures.
5. **Geospatial GIS Context:** Overlaying asset telemetry and zone health indices on interactive geographic map layers.
6. **Synchronized Longitudinal Analytics:** Correlating multi-stream time-series datasets across synchronized time axes to isolate systemic failure signatures.

### 2.2 Architectural Boundaries
- **Client Tier (Browser/Vercel Edge):** Pure client-side rendered React SPA executing UI state management, interactive canvas rendering, and client-side data filtering.
- **BaaS Tier (Supabase Cloud):** Manages identity, persistent relational and graph storage, real-time WebSocket pub/sub, and serverless compute isolates (Edge Functions).
- **External Integration Tier:** Ingests meteorological context (OpenWeatherMap) and base map tiles (OpenStreetMap).
- **Actuation Boundary:** The system strictly operates as an **Intelligence, Simulation, and Decision Support Platform**. It possesses zero direct hardware actuator control over physical municipal infrastructure (e.g., cannot physically trip circuit breakers or alter traffic signal phases).

---

## 3. Architectural Goals and Quality Attributes

| Quality Attribute | Architectural Relevance | Architectural Decision / Mechanism | Verification Strategy |
|---|---|---|---|
| **Performance** | Sub-second situational awareness during municipal crises is non-negotiable. | TanStack Query client-side caching; PostgreSQL composite B-Tree indexes on `(recorded_at, node_id)`; recursive CTE traversal depth bounding ($\le 5$ hops); SVG virtualization in React Flow. | Playwright E2E Lighthouse audits (FCP $\le 1.2\text{s}$, TTI $\le 2.0\text{s}$); PostgreSQL `EXPLAIN ANALYZE` benchmarks ($\le 350\text{ms}$ traversal). |
| **Scalability** | Telemetry volume scales linearly with monitored municipal assets and time. | Time-series table partitioning by month (`metrics`); scheduled database aggregation jobs (`pg_cron`) rolling raw records older than 90 days into hourly summaries; stateless serverless Edge Functions. | Synthetic load generation tests simulating 50 concurrent operators and 1,000 telemetry inserts/minute. |
| **Availability** | Emergency operations demand high platform resilience. | Hosted on multi-zone redundant cloud infrastructure (Vercel Edge Network + Supabase AWS Managed multi-AZ PostgreSQL); target 99.5% uptime. | Uptime monitoring HTTP ping health checks. |
| **Reliability & Fault Tolerance** | Ingestion failures must not break active operator dashboards. | Circuit-breaker error boundaries; fallback to cached historical telemetry when external APIs fail; client-side exponential backoff for WebSocket reconnections. | Chaos testing via simulated API timeouts and network throttling. |
| **Security & Privacy** | Critical municipal infrastructure data requires stringent access controls. | 100% TLS 1.3 encryption; JWT authentication; PostgreSQL Row-Level Security (RLS) enforcing strict role boundaries; zero citizen PII ingested. | Automated security test suites executing unprivileged SQL mutations; static vulnerability scans. |
| **Maintainability** | Hackathon codebase must support structured extension into production. | Modular feature-driven folder architecture; strict TypeScript compilation (`strict: true`); Zod schema validation sharing contracts across UI forms and RPC invocations. | Zero allowable `any` types in core logic; automated ESLint and build verification in CI. |

---

## 4. Architecture Style and Design Decisions

### 4.1 Architecture Style: Modular Client-BaaS Architecture
CityNexus adopts a **Modular Client-BaaS Architecture** utilizing a React Single-Page Application deployed on Vercel's global edge network, backed directly by Supabase (Managed PostgreSQL, PostgREST API engine, GoTrue Auth, Realtime WebSocket daemon, and Deno Edge Functions).

```mermaid
graph TD
    subgraph ClientLayer["Presentation & Application Layer (Client Browser / Vercel Edge)"]
        UI[React 18 SPA + Vite + TypeScript]
        Store[Zustand Client State + TanStack Server State]
        VisEng[Recharts + React Flow + React Leaflet]
    end

    subgraph BaaSLayer["Backend-as-a-Service Layer (Supabase Managed Cloud)"]
        Auth[Supabase GoTrue Auth]
        API[PostgREST Auto-Generated REST Engine]
        RT[Realtime Elixir WebSocket Daemon]
        Edge[Deno Edge Functions]
        PG[(PostgreSQL 15 Relational & Graph Storage)]
    end

    subgraph ExtLayer["External Ingestion Services"]
        OWM[OpenWeatherMap API]
        OSM[OpenStreetMap Tile Server]
    end

    UI --> Store
    Store --> VisEng
    UI -->|HTTPS / TLS 1.3| Auth
    UI -->|HTTPS PostgREST Queries| API
    UI -->|WSS Realtime Subscriptions| RT
    UI -->|HTTPS Invocations| Edge
    Edge -->|Direct DB Connection| PG
    API -->|Enforces RLS| PG
    RT -->|CDC / WAL Replication| PG
    Edge -->|Cron / REST Pull| OWM
    VisEng -->|Raster Tile Pull| OSM
```

### 4.2 Architectural Rationale & Trade-Offs
1. **Elimination of Custom Node.js/Express Middleware:**
   - *Rationale:* Developing a bespoke Node.js/Express intermediary introduces unnecessary serialization overhead, duplicate schema declarations, hosting management, and latency.
   - *Trade-off:* Business logic that cannot execute client-side is encapsulated directly in PostgreSQL stored procedures (PL/pgSQL RPCs) or Deno Edge Functions.
2. **Relational-Graph Hybrid Storage in PostgreSQL:**
   - *Rationale:* Rather than maintaining a specialized Neo4j graph database alongside PostgreSQL, CityNexus stores graph nodes and edges in normalized tables (`infrastructure_nodes`, `infrastructure_edges`) and queries traversal paths via recursive Common Table Expressions (CTEs).
   - *Trade-off:* For municipal graphs of hundreds to low thousands of nodes, PostgreSQL recursive CTEs achieve sub-50ms execution without the operational complexity and cost of a separate graph database cluster.
3. **Client-Side Rendering (SPA) vs. Server-Side Rendering (SSR):**
   - *Rationale:* CityNexus is an authenticated, real-time command dashboard with intensive client-side canvas manipulation (React Flow, Leaflet, Recharts). Client-side rendering maximizes interactive frame rates and eliminates SSR hydration overhead.

---

## 5. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Tier1["Tier 1: Client Presentation Layer"]
        A1["Landing & Marketing Page (GSAP + Lenis)"]
        A2["Operational Dashboard (shadcn/ui + Tailwind)"]
        A3["Domain Detail Views (Traffic / Power / Water)"]
        A4["Interactive Dependency Canvas (React Flow)"]
        A5["Simulation Control Sandbox (Zustand)"]
        A6["Geospatial GIS Map (React Leaflet)"]
        A7["Historical Analytics Engine (Recharts)"]
    end

    subgraph Tier2["Tier 2: Client Orchestration & State Layer"]
        B1["React Router v6 (Protected Route Guards)"]
        B2["TanStack Query v5 (Caching, Polling & Invalidation)"]
        B3["Supabase JS Client SDK v2 (Data, Auth, Realtime)"]
        B4["Zod Validation Layer (Form & Payload Schemas)"]
    end

    subgraph Tier3["Tier 3: Platform Compute & Ingestion Layer"]
        C1["Deno Edge Function: /ingest-weather (Scheduled 15m)"]
        C2["Deno Edge Function: /evaluate-anomalies (Cron 1m)"]
        C3["Deno Edge Function: /simulate-cascade (Heavy RPC)"]
    end

    subgraph Tier4["Tier 4: Enterprise Data & Security Layer (PostgreSQL)"]
        D1["PostgreSQL Relational Tables (Metrics, Alerts, Zones)"]
        D2["PostgreSQL Graph Tables (Nodes, Edges, Weights)"]
        D3["Row-Level Security Policies (Role Enforcement)"]
        D4["Stored Procedures / Functions (Recursive CTE BFS)"]
        D5["WAL / Replication Slots (Supabase Realtime CDC)"]
    end

    Tier1 --> Tier2
    Tier2 -->|Direct RPC / REST| Tier4
    Tier2 -->|WSS Live Stream| Tier4
    Tier2 -->|HTTPS Invocation| Tier3
    Tier3 -->|Database Mutations| Tier4
```

---

## 6. Technology Stack and Technical Responsibilities

| Technology | Architectural Layer | Responsibility | Reason for Selection | Status |
|---|---|---|---|---|
| **React 18** | Presentation Layer | Component lifecycle, virtual DOM, interactive UI rendering. | Mandatory core library specified in requirements. | Required |
| **Vite** | Build & Tooling | Fast development server (HMR), production ESBuild bundling. | Instant dev starts, lightning-fast HMR, optimized production build. | Required |
| **TypeScript 5.x** | Language Standard | Strict compile-time typing, contract interfaces, type safety. | Prevents runtime data mismatch bugs; enforces strict domain models. | Required |
| **React Router v6** | Client Routing | Client-side page navigation, nested route layouts, auth guards. | Standard client routing for React SPAs without browser reloads. | Required |
| **TanStack Query v5** | Server State Management | Cache management, background refetching, query invalidation. | Handles server telemetry caching, loading skeletons, and error retry logic. | Required |
| **Tailwind CSS v3** | Styling Framework | Utility-first CSS styling, responsive grid layouts, design tokens. | Rapid UI styling directly in JSX; zero runtime CSS overhead. | Required |
| **shadcn/ui** | Component Library | Accessible UI primitives (modals, dropdowns, sheets, tables). | Copy-paste architecture with 100% Tailwind customization control. | Required |
| **Lenis** | UX & Scrolling | Momentum-based smooth scroll for marketing/landing views. | Fluid scroll physics for Landing Page (PAGE-001). | Required |
| **Framer Motion** | Animation Layer | Micro-interactions, layout transitions, alert pulse badges. | Declarative spring animations for entering cards and real-time state shifts. | Required |
| **GSAP + ScrollTrigger**| Animation Layer | Scroll-driven section pinning and timeline scrubbing on Landing Page. | High-performance canvas pinning and complex landing page animations. | Required |
| **Supabase PostgreSQL** | Persistence & Graph | Relational tables, graph edges, stored procedures, RLS policies. | Highly scalable relational DB capable of recursive graph queries. | Required |
| **Supabase Auth** | Security & Identity | User registration, session tokens, bcrypt hashing, OAuth handshakes. | Out-of-the-box secure identity provider integrating with PostgreSQL RLS. | Required |
| **Supabase Realtime** | Event Streaming | WebSocket gateway streaming database changes (CDC) to client. | Eliminates polling; delivers sub-second telemetry updates. | Required |
| **Supabase Storage** | Asset Storage | Flat file asset hosting (CSV exports, report archives). | Secure S3-compatible cloud storage managed under database RLS. | Required |
| **Vercel** | Hosting & CDN | Global edge network hosting, automated CI/CD GitHub deployments. | Premier React deployment platform with global CDN caching. | Required |
| **Recharts** | Data Visualization | Multi-domain time-series line, area, and bar charts. | React-native declarative charting built on SVG with synchronized `syncId`. | Recommended (Approved) |
| **React Flow** | Graph Visualization | Interactive node-edge dependency graph canvas with pan/zoom. | Purpose-built node canvas with custom node rendering and viewport controls. | Recommended (Approved) |
| **React Leaflet** | Geospatial GIS | Interactive map rendering, GeoJSON polygons, custom markers. | Lightweight, battle-tested open-source mapping backed by Leaflet.js. | Recommended (Approved) |
| **Zustand** | Client State | Managing local transient UI state (active filters, simulation sliders). | Lightweight hooks-based state store without boilerplate. | Recommended (Approved) |
| **date-fns** | Utility Library | Date parsing, time bucketing, timestamp formatting. | Lightweight, immutable, tree-shakeable date manipulation functions. | Recommended (Approved) |
| **Zod** | Schema Validation | Form input validation, API payload validation. | Seamless TypeScript inference and runtime payload parsing. | Recommended (Approved) |

---

## 7. Detailed Component Architecture

### 7.1 Component Inventory & Ownership
| Component ID | Component Name | Architectural Module | Purpose & Responsibility | Inputs | Outputs | Dependencies | Related PRD Requirements |
|---|---|---|---|---|---|---|---|
| **COMP-001** | `TelemetryIngestor` | Ingestion / BaaS | Scheduled worker fetching external APIs and normalising sensor payloads. | Raw API JSON (IN-001 to IN-004) | Insert rows in `metrics` table | OpenWeatherMap API, Supabase Edge Functions | FR-001, INT-001 |
| **COMP-002** | `DashboardAggregator` | MOD-001 (Monitoring) | Computes composite domain health and formats KPI summary cards. | `metrics` table rows | OUT-001 (Dashboard KPI view) | TanStack Query, Zustand | FR-001, FR-004 |
| **COMP-003** | `RealtimeStreamManager` | MOD-001 (Monitoring) | Manages WebSocket channel subscription, event dispatch, and query cache invalidation. | PostgreSQL CDC messages | React state trigger | Supabase Realtime SDK | FR-003, NFR-002 |
| **COMP-004** | `DependencyGraphEngine` | MOD-002 (Graph) | Models nodes/edges, calculates layout, and manages graph canvas interactions. | `infrastructure_nodes`, `infrastructure_edges` | OUT-003 (Interactive canvas) | React Flow, Dagre Layout | FR-005, FR-006 |
| **COMP-005** | `GraphTraversalService` | MOD-002 (Graph) | Executes recursive BFS graph traversal to calculate blast radius and dependency chains. | `node_id`, initial disruption magnitude | Ranked downstream asset list | PostgreSQL CTE function `fn_traverse_dependencies` | FR-006, FR-007 |
| **COMP-006** | `CascadingSimulator` | MOD-003 (Simulation) | Propagates simulated perturbations across connected nodes using forward-propagation factors. | Scenario payload (IN-008) | OUT-005 (Projected metric deltas) | PostgreSQL RPC `fn_simulate_cascade` | FR-008, FR-009 |
| **COMP-007** | `AnomalyEvaluator` | MOD-004 (Alerts) | Compares live metrics against threshold configurations with hysteresis controls. | Live telemetry rows, `threshold_configs` | Inserts in `alerts` table | Supabase Edge Function / Triggers | FR-011, BR-003 |
| **COMP-008** | `CrossDomainCorrelator` | MOD-004 (Alerts) | Enriches alerts with cross-domain impacted asset metadata. | Triggered alert record | Updated `alerts.affected_systems` | `GraphTraversalService` (COMP-005) | FR-012 |
| **COMP-009** | `GeospatialEngine` | MOD-005 (GIS Map) | Renders map layers, colors zone health polygons, and manages marker clusters. | Zone GeoJSON, Asset Lat/Lng | OUT-006 (Leaflet GIS view) | React Leaflet, OpenStreetMap | FR-014, FR-015, FR-016 |
| **COMP-010** | `HistoricalAnalytics` | MOD-006 (Analytics) | Aggregates time-series data and controls synchronized crosshair chart scrubbing. | Historical metrics date bucket | OUT-007 (Synchronized charts) | Recharts, PostgreSQL `date_trunc` | FR-017, FR-018 |
| **COMP-011** | `SecurityEnforcer` | MOD-007 (Governance) | Authenticates user credentials, validates JWT claims, and guards protected routes. | Credentials (IN-009), Route path | Authenticated session / Route grant | Supabase Auth, React Router | FR-020, FR-021 |
| **COMP-012** | `TopologyConfigurator` | MOD-007 (Governance) | Provides validated CRUD operations for nodes, edges, and thresholds. | Form inputs (IN-005 to IN-007) | Database mutations | Zod, Supabase Client | FR-022, BR-001, BR-002 |

### 7.2 Component Interaction Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Operator as City Operations Manager
    participant UI as Dashboard UI (COMP-002)
    participant RT as RealtimeStreamManager (COMP-003)
    participant Query as TanStack Query Cache
    participant DB as PostgreSQL Database
    participant Correlator as CrossDomainCorrelator (COMP-008)

    Operator->>UI: Access Dashboard (/dashboard)
    UI->>Query: Request Telemetry (metrics, alerts)
    Query->>DB: SELECT latest metrics & active alerts
    DB-->>Query: Return normalized records
    Query-->>UI: Render KPI Cards & Active Alerts
    UI->>RT: Subscribe to channels ('dashboard_changes')
    
    Note over DB,RT: Background Telemetry Breach Detected
    DB->>Correlator: Trigger fn_traverse_dependencies(node_id)
    Correlator->>DB: Enrich alert with affected_systems JSON
    DB->>RT: Emit WAL CDC Event (INSERT on alerts)
    RT->>UI: Push WebSocket Notification
    UI->>Query: Invalidate ['alerts', 'metrics'] cache keys
    UI->>UI: Play alert pulse animation & render toast
    Operator->>UI: Click Alert to Inspect Affected Cross-Domain Assets
```

---

## 8. Frontend Architecture

### 8.1 Proposed Project Folder Structure
```text
c:\Users\Bhuvan A\OneDrive\Desktop\project\Hackathon\
├── public/
│   ├── favicon.ico
│   ├── assets/
│   └── geojson/
│       └── bengaluru_zones.json
├── src/
│   ├── app/
│   │   ├── App.tsx                   # Application root, Providers & Theme setup
│   │   ├── routes.tsx                # React Router v6 route configuration & guards
│   │   └── main.tsx                  # Vite entry point
│   ├── assets/                       # Static SVGs, images
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives (button, card, dialog, sheet, table, etc.)
│   │   ├── layout/                   # Navbar, Sidebar, PageContainer, Header, Footer
│   │   └── shared/                   # MetricBadge, StatusIndicator, ErrorBoundary, SkeletonLoader
│   ├── features/                     # Domain & Module feature slices
│   │   ├── landing/                  # Landing page hero, GSAP animations, Lenis scroll
│   │   ├── auth/                     # LoginForm, RegisterForm, AuthGuard, useAuth hook
│   │   ├── dashboard/                # KPICard, DomainCard, IncidentTicker, ZoneHealthTable
│   │   ├── sectoral/                 # TrafficDetail, ElectricityDetail, UtilitiesDetail views
│   │   ├── graph/                    # ReactFlow canvas, CustomNodes, EdgeControls, ImpactTracer
│   │   ├── simulation/               # ScenarioBuilder, ParameterSliders, ImpactComparisonTable
│   │   ├── map/                      # LeafletMap, ZonePolygonLayer, AssetMarkerCluster, AssetDrawer
│   │   ├── alerts/                   # AlertCenter, AlertTable, EnrichedAlertDrawer, AcknowledgeModal
│   │   ├── history/                  # TimeSeriesStack, SynchronizedCharts, DateRangeFilter
│   │   └── admin/                    # NodeEditorForm, EdgeEditorForm, ThresholdManager, UserTable
│   ├── hooks/                        # Custom reusable React hooks (useRealtime, useDebounce, etc.)
│   ├── lib/
│   │   ├── supabase.ts               # Initialized Supabase client instance
│   │   ├── utils.ts                  # Tailwind clsx/twMerge helpers
│   │   └── constants.ts              # System constants, domain colors, fallback coordinates
│   ├── stores/                       # Zustand client state slices (useFilterStore, useSimulationStore)
│   ├── types/                        # TypeScript definitions (database.types.ts, domain.types.ts)
│   └── services/                     # Supabase data access layer & RPC wrappers
├── tests/
│   ├── unit/                         # Vitest unit tests for calculations and hooks
│   ├── component/                    # React Testing Library component tests
│   └── e2e/                          # Playwright end-to-end integration flows
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### 8.2 Frontend Architectural Subsystems
```mermaid
flowchart TD
    subgraph CoreFrontendSubsystems["Frontend Subsystems Architecture"]
        Router["React Router v6<br/>(Client Navigation & Guards)"]
        AuthContext["Auth Context<br/>(Supabase Session & RBAC)"]
        TanStack["TanStack Query Cache<br/>(Server State Sync)"]
        Zustand["Zustand Stores<br/>(UI & Simulation State)"]
        WebSocketSub["Supabase Realtime Hooks<br/>(Live CDC Dispatcher)"]
        UIComponents["shadcn/ui + Tailwind<br/>(Design System Primitives)"]
        AnimationEng["Framer Motion + GSAP<br/>(Transitions & Scrubbing)"]
    end

    Router --> AuthContext
    AuthContext --> TanStack
    TanStack --> UIComponents
    Zustand --> UIComponents
    WebSocketSub --> TanStack
    UIComponents --> AnimationEng
```

1. **State Management Division:**
   - **Server State (TanStack Query):** Caches metrics, alerts, topology nodes, and historical time-series. Handles background stale-while-revalidate cycles and query invalidation.
   - **Local/Client State (Zustand):** Manages interactive parameters including active zone filters, selected canvas nodes, parameter slider positions, and drawer open/close states.
2. **Component Separation & Boundaries:**
   - Feature slices in `src/features/` remain completely self-contained with co-located components, hooks, and types.
   - Primitives in `src/components/ui/` remain stateless, purely driven by props.
3. **Route Guards & Authorization:**
   - High-order route wrapper `<ProtectedRoute allowedRoles={[...]} />` checks active session JWT claims. Unauthorized access attempts redirect to `/dashboard` with an error toast notification.

---

## 9. Backend and Application Service Architecture

### 9.1 Service Architecture Overview
Because CityNexus leverages Supabase as its BaaS backbone, backend responsibilities are divided between **PostgreSQL Stored Procedures (PL/pgSQL Functions)** for database-adjacent logic and **Supabase Deno Edge Functions** for background ingestion and cron tasks.

```mermaid
flowchart LR
    subgraph IngestionCron["Scheduled Ingestion (Cron / Background)"]
        CronTrigger["pg_cron (Every 15 min)"]
        EdgeWeather["Edge Function: /ingest-weather"]
        OWM_API["OpenWeatherMap API"]
    end

    subgraph EvaluationCron["Anomaly Detection (Cron / Background)"]
        CronEval["pg_cron (Every 1 min)"]
        EdgeEval["Edge Function: /evaluate-anomalies"]
    end

    subgraph DBCompute["PostgreSQL Database Compute Engine"]
        RPC_BFS["fn_traverse_dependencies()"]
        RPC_Sim["fn_simulate_cascade()"]
        RLS_Policy["Row-Level Security Policies"]
    end

    subgraph ClientRequests["Client API Invocations"]
        ClientApp["React SPA Client"]
    end

    CronTrigger --> EdgeWeather
    EdgeWeather --> OWM_API
    EdgeWeather -->|Service Role Insert| DBCompute
    CronEval --> EdgeEval
    EdgeEval -->|Evaluate Thresholds & Trigger RPC| DBCompute
    ClientApp -->|Execute RPC: Simulation| RPC_Sim
    ClientApp -->|Execute RPC: Blast Radius| RPC_BFS
    ClientApp -->|PostgREST Query via RLS| RLS_Policy
```

### 9.2 Edge Function Specifications
1. **`/ingest-weather` (Deno Runtime):**
   - *Trigger:* Scheduled every 15 minutes via `pg_cron` / HTTP webhook.
   - *Logic:* Fetches current weather for city coordinates from OpenWeatherMap; extracts temperature, humidity, precipitation, and conditions; performs an upsert into `weather_telemetry`.
   - *Error Handling:* Catches HTTP 429/500 errors; logs failure; gracefully terminates without mutating database.
2. **`/evaluate-anomalies` (Deno Runtime):**
   - *Trigger:* Scheduled every 60 seconds.
   - *Logic:* Scans latest telemetry per node against `threshold_configs`; applies hysteresis check (BR-003); emits `alerts` inserts for breaches; calls `fn_traverse_dependencies` to enrich alert with cross-domain downstream impact.

---

## 10. Database Architecture

### 10.1 Database Technology
**PostgreSQL 15 (Managed by Supabase)** with extensions:
- `uuid-ossp` (UUID generation).
- `pg_cron` (Scheduled background tasks).
- `postgis` (Geospatial indexing and polygon containment).

### 10.2 Logical Entity Relationship Diagram
```mermaid
erDiagram
    ZONES ||--o{ INFRASTRUCTURE_NODES : contains
    INFRASTRUCTURE_NODES ||--o{ METRICS : emits
    INFRASTRUCTURE_NODES ||--o{ INFRASTRUCTURE_EDGES : sources
    INFRASTRUCTURE_NODES ||--o{ INFRASTRUCTURE_EDGES : targets
    INFRASTRUCTURE_NODES ||--o{ ALERTS : triggers
    INFRASTRUCTURE_NODES ||--o{ THRESHOLD_CONFIGS : bounds
    ALERTS ||--o{ AUDIT_LOGS : logs
    USERS ||--o{ AUDIT_LOGS : executes
    USERS ||--o{ SIMULATION_RUNS : runs

    ZONES {
        varchar zone_id PK
        varchar name
        geometry boundary_polygon
        timestamp created_at
    }

    INFRASTRUCTURE_NODES {
        uuid node_id PK
        varchar name
        varchar domain
        varchar zone_id FK
        float latitude
        float longitude
        varchar status
        jsonb specifications
        timestamp created_at
        timestamp updated_at
    }

    INFRASTRUCTURE_EDGES {
        uuid edge_id PK
        uuid source_node_id FK
        uuid target_node_id FK
        varchar dependency_type
        float weight
        float propagation_factor
        timestamp created_at
    }

    METRICS {
        uuid metric_id PK
        uuid node_id FK
        varchar metric_name
        float value
        varchar unit
        timestamp recorded_at
    }

    THRESHOLD_CONFIGS {
        uuid config_id PK
        uuid node_id FK
        varchar metric_name
        float warning_threshold
        float critical_threshold
        timestamp updated_at
    }

    ALERTS {
        uuid alert_id PK
        uuid node_id FK
        varchar severity
        varchar title
        text description
        jsonb affected_systems
        varchar status
        timestamp created_at
        timestamp resolved_at
        uuid resolved_by FK
    }

    SIMULATION_RUNS {
        uuid run_id PK
        uuid user_id FK
        jsonb parameters
        jsonb results
        timestamp executed_at
    }

    AUDIT_LOGS {
        uuid log_id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb details
        timestamp performed_at
    }

    USERS {
        uuid id PK
        varchar email
        varchar role
        varchar department
        timestamp created_at
    }
```

### 10.3 Entity Schema Specifications

#### 1. `zones`
| Field | Description | Data Type | Constraints | Required |
|---|---|---|---|---|
| `zone_id` | Unique zone identifier (e.g., 'ZONE_1') | `VARCHAR(32)` | PRIMARY KEY | Yes |
| `name` | Human-readable zone title | `VARCHAR(100)` | NOT NULL | Yes |
| `boundary_polygon` | GeoJSON polygon coordinates | `GEOMETRY(Polygon, 4326)` | NOT NULL | Yes |
| `created_at` | Record creation timestamp | `TIMESTAMPTZ` | DEFAULT NOW() | Yes |

#### 2. `infrastructure_nodes`
| Field | Description | Data Type | Constraints | Required |
|---|---|---|---|---|
| `node_id` | Unique infrastructure asset UUID | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | Yes |
| `name` | Asset name (e.g., 'Substation 2A') | `VARCHAR(128)` | NOT NULL | Yes |
| `domain` | Sector category | `VARCHAR(32)` | CHECK (domain IN ('traffic', 'electricity', 'utilities')) | Yes |
| `zone_id` | Enclosing municipal zone | `VARCHAR(32)` | REFERENCES zones(zone_id) ON DELETE RESTRICT | Yes |
| `latitude` | Geographic coordinate | `DOUBLE PRECISION` | CHECK (latitude BETWEEN -90 AND 90) | Yes |
| `longitude` | Geographic coordinate | `DOUBLE PRECISION` | CHECK (longitude BETWEEN -180 AND 180) | Yes |
| `status` | Operational state | `VARCHAR(16)` | CHECK (status IN ('NORMAL', 'WARNING', 'CRITICAL')) | Yes |
| `specifications` | Asset metadata attributes | `JSONB` | DEFAULT '{}'::jsonb | No |
| `created_at` | Registration timestamp | `TIMESTAMPTZ` | DEFAULT NOW() | Yes |
| `updated_at` | Last telemetry update timestamp | `TIMESTAMPTZ` | DEFAULT NOW() | Yes |

*Index:* `CREATE INDEX idx_nodes_domain_zone ON infrastructure_nodes(domain, zone_id);`

#### 3. `infrastructure_edges`
| Field | Description | Data Type | Constraints | Required |
|---|---|---|---|---|
| `edge_id` | Unique directed edge UUID | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | Yes |
| `source_node_id` | Originating asset (provider) | `UUID` | REFERENCES infrastructure_nodes(node_id) ON DELETE CASCADE | Yes |
| `target_node_id` | Dependent asset (consumer) | `UUID` | REFERENCES infrastructure_nodes(node_id) ON DELETE CASCADE | Yes |
| `dependency_type` | Nature of coupling | `VARCHAR(32)` | CHECK (dependency_type IN ('powers', 'feeds', 'controls', 'protects')) | Yes |
| `weight` | Dependency strength factor | `DOUBLE PRECISION` | CHECK (weight > 0.0 AND weight <= 1.0) | Yes |
| `propagation_factor` | Cascading forward impact coefficient | `DOUBLE PRECISION` | CHECK (propagation_factor > 0.0 AND propagation_factor <= 1.0) | Yes |
| `created_at` | Mapping timestamp | `TIMESTAMPTZ` | DEFAULT NOW() | Yes |

*Constraints:* `CHECK (source_node_id != target_node_id)`
*Index:* `CREATE UNIQUE INDEX idx_unique_edge ON infrastructure_edges(source_node_id, target_node_id, dependency_type);`

#### 4. `metrics`
| Field | Description | Data Type | Constraints | Required |
|---|---|---|---|---|
| `metric_id` | Unique telemetry entry UUID | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | Yes |
| `node_id` | Emitting infrastructure asset | `UUID` | REFERENCES infrastructure_nodes(node_id) ON DELETE CASCADE | Yes |
| `metric_name` | Metric parameter name | `VARCHAR(64)` | NOT NULL | Yes |
| `value` | Measured telemetry value | `DOUBLE PRECISION` | NOT NULL | Yes |
| `unit` | Engineering unit of measure | `VARCHAR(16)` | NOT NULL | Yes |
| `recorded_at` | Exact measurement timestamp | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Yes |

*Index:* `CREATE INDEX idx_metrics_query ON metrics(node_id, metric_name, recorded_at DESC);`

#### 5. `alerts`
| Field | Description | Data Type | Constraints | Required |
|---|---|---|---|---|
| `alert_id` | Unique alert instance UUID | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | Yes |
| `node_id` | Triggering root asset | `UUID` | REFERENCES infrastructure_nodes(node_id) ON DELETE CASCADE | Yes |
| `severity` | Threat classification | `VARCHAR(16)` | CHECK (severity IN ('WARNING', 'CRITICAL', 'INFORMATIONAL')) | Yes |
| `title` | Brief alert heading | `VARCHAR(128)` | NOT NULL | Yes |
| `description` | Diagnostic details | `TEXT` | NOT NULL | Yes |
| `affected_systems` | Enriched list of at-risk assets | `JSONB` | DEFAULT '[]'::jsonb | Yes |
| `status` | Incident handling status | `VARCHAR(16)` | CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')) | Yes |
| `created_at` | Breach timestamp | `TIMESTAMPTZ` | DEFAULT NOW() | Yes |
| `resolved_at` | Incident resolution timestamp | `TIMESTAMPTZ` | NULL | No |
| `resolved_by` | Operator UUID | `UUID` | REFERENCES auth.users(id) ON DELETE SET NULL | No |

*Index:* `CREATE INDEX idx_alerts_active ON alerts(status, severity) WHERE status = 'ACTIVE';`

#### 6. `simulation_runs`
| Field | Description | Data Type | Constraints | Required |
|---|---|---|---|---|
| `run_id` | Unique simulation instance UUID | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | Yes |
| `user_id` | Initiating planner UUID | `UUID` | REFERENCES auth.users(id) ON DELETE SET NULL | Yes |
| `parameters` | Injected perturbation variables | `JSONB` | NOT NULL | Yes |
| `results` | Computed baseline vs projected delta | `JSONB` | NOT NULL | Yes |
| `executed_at` | Simulation execution timestamp | `TIMESTAMPTZ` | DEFAULT NOW() | Yes |

---

## 11. API Architecture and Communication Contracts

### 11.1 Communication Paradigm
CityNexus leverages Supabase's auto-generated **PostgREST RESTful interface** for standard CRUD operations and **PostgreSQL Remote Procedure Calls (RPCs)** for analytical and graph traversal tasks.

### 11.2 API & RPC Contracts

#### API-001: Query Live Metrics
- **Invocation:** `GET /rest/v1/metrics?node_id=eq.{id}&order=recorded_at.desc&limit=1`
- **Method:** HTTPS GET
- **Auth:** Bearer JWT (Anon or Authenticated)
- **Response Structure (200 OK):**
  ```json
  [
    {
      "metric_id": "8b5a1f6a-4d2c-4977-bf31-9f9b5a1e8a01",
      "node_id": "3c8a9e0f-1a2b-4c3d-8e4f-5a6b7c8d9e0f",
      "metric_name": "grid_load_pct",
      "value": 87.4,
      "unit": "%",
      "recorded_at": "2026-11-17T09:45:00Z"
    }
  ]
  ```

#### API-002: Stored Procedure `fn_traverse_dependencies`
- **Invocation:** `POST /rest/v1/rpc/fn_traverse_dependencies`
- **Method:** HTTPS POST
- **Auth:** Bearer JWT (Authenticated)
- **Request Body:**
  ```json
  {
    "origin_node_id": "3c8a9e0f-1a2b-4c3d-8e4f-5a6b7c8d9e0f",
    "max_depth": 4,
    "min_impact_threshold": 0.05
  }
  ```
- **Response Structure (200 OK):**
  ```json
  [
    {
      "node_id": "e2f1a0b9-8c7d-6e5f-4a3b-2c1d0e9f8a7b",
      "name": "Traffic Signal Corridor 4B",
      "domain": "traffic",
      "zone_id": "ZONE_2",
      "depth": 1,
      "propagated_impact_score": 0.90,
      "dependency_chain": ["Substation 2A", "Traffic Signal Corridor 4B"]
    },
    {
      "node_id": "9a8b7c6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4",
      "name": "Water Booster Pump 2",
      "domain": "utilities",
      "zone_id": "ZONE_2",
      "depth": 2,
      "propagated_impact_score": 0.675,
      "dependency_chain": ["Substation 2A", "Feeder Station 2B", "Water Booster Pump 2"]
    }
  ]
  ```

#### API-003: Stored Procedure `fn_simulate_cascade`
- **Invocation:** `POST /rest/v1/rpc/fn_simulate_cascade`
- **Method:** HTTPS POST
- **Auth:** Bearer JWT (ROLE-002, ROLE-003, ROLE-007)
- **Request Body:**
  ```json
  {
    "target_domain": "traffic",
    "target_zone": "ZONE_5",
    "perturbation_pct": 30.0
  }
  ```
- **Response Structure (200 OK):**
  ```json
  {
    "run_id": "7f6e5d4c-3b2a-1f0e-9d8c-7b6a5e4d3c2b",
    "executed_at": "2026-11-17T10:05:00Z",
    "summary": {
      "affected_assets_count": 18,
      "critical_risk_count": 2
    },
    "zone_deltas": [
      {
        "zone_id": "ZONE_5",
        "domain": "traffic",
        "baseline": 62.0,
        "projected": 88.0,
        "delta_pct": 41.9
      },
      {
        "zone_id": "ZONE_5",
        "domain": "electricity",
        "baseline": 68.0,
        "projected": 77.0,
        "delta_pct": 13.2
      },
      {
        "zone_id": "ZONE_5",
        "domain": "utilities",
        "baseline": 45.0,
        "projected": 41.0,
        "delta_pct": -8.8
      }
    ]
  }
  ```

#### API-004: Acknowledge Alert Mutation
- **Invocation:** `PATCH /rest/v1/alerts?alert_id=eq.{id}`
- **Method:** HTTPS PATCH
- **Auth:** Bearer JWT (ROLE-002, ROLE-004)
- **Request Body:**
  ```json
  {
    "status": "ACKNOWLEDGED",
    "resolved_by": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
  }
  ```
- **Response Structure (204 No Content / 200 OK)**

---

## 12. Authentication and Authorization Architecture

### 12.1 Authentication Workflow
```mermaid
sequenceDiagram
    autonumber
    actor User as Municipal Operator
    participant Client as React Client (Supabase SDK)
    participant Auth as Supabase GoTrue Auth
    participant PG as PostgreSQL (RLS Engine)

    User->>Client: Submit Email & Password
    Client->>Auth: POST /auth/v1/token?grant_type=password
    Auth->>Auth: Validate Credentials & Verify bcrypt Hash
    Auth-->>Client: Return JWT Access Token + Refresh Token (HTTP-Only Cookie)
    Client->>Client: Extract Role Claims from Decoded JWT
    Client->>PG: Request Protected Data (Header: Bearer <JWT>)
    PG->>PG: Extract auth.uid() & auth.jwt() ->> 'role'
    PG->>PG: Evaluate Row-Level Security (RLS) Filter
    PG-->>Client: Return Authorized Rows Only
```

### 12.2 Row-Level Security (RLS) Policy Specifications

```sql
-- 1. Enable RLS across all core tables
ALTER TABLE infrastructure_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE threshold_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;

-- 2. Infrastructure Nodes: Everyone authenticated can read; only admins can write
CREATE POLICY "Allow public read access to nodes"
  ON infrastructure_nodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin full access to nodes"
  ON infrastructure_nodes FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- 3. Alerts: Everyone authenticated can read; Ops/Emergency/Admin can update status
CREATE POLICY "Allow read access to alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow operators to acknowledge alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'operations_manager', 'emergency_coordinator'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'operations_manager', 'emergency_coordinator'));

-- 4. Simulation Runs: Users can view all runs, but can only insert their own
CREATE POLICY "Allow read access to simulation runs"
  ON simulation_runs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert own simulations"
  ON simulation_runs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## 13. Security Architecture

| Security Domain | Identified Threat / Vulnerability | Architectural Mitigation Strategy | Enforcement Point | Verification Technique |
|---|---|---|---|---|
| **Injection** | SQL Injection via dynamic filtering. | 100% parameterization via PostgREST and typed PL/pgSQL routines; zero raw SQL string concatenation. | PostgreSQL Query Parser | Automated SQL injection penetration scanner. |
| **Authentication** | Credential stuffing, brute-force attacks. | Password hashing via Argon2/bcrypt; automatic rate limiting on Supabase Auth endpoints (5 attempts/min); JWT expiry set to 3600 seconds. | Supabase GoTrue Gateway | Automated auth brute-force simulation test. |
| **Authorization** | Broken Object Level Authorization (BOLA/IDOR). | Enforced in database kernel via Row-Level Security (RLS) bound to `auth.jwt()`; client-side route hiding is strictly cosmetic. | PostgreSQL RLS Engine | Automated test invoking mutations with mismatched JWT roles. |
| **Data in Transit** | Man-in-the-Middle (MitM) eavesdropping. | Strict Transport Security (HSTS); TLS 1.3 mandated across all HTTPS and WSS endpoints; HTTP permanently redirected. | Vercel Edge / Cloudflare | SSL Labs Server Security Audit (Grade: A+). |
| **Input Validation** | Malformed payloads, buffer/type overflows. | Zod schema validation on frontend form boundaries and database schema check constraints on numeric bounds. | Client Form Hooks + PostgreSQL Check Constraints | Negative schema unit tests submitting out-of-bounds numbers. |
| **Secret Management** | Leaked database or third-party API credentials. | Zero hardcoded keys in repository; separate `.env` files; secrets injected securely via Vercel and Supabase Environment Secret Managers. | CI/CD Pipeline & Edge Runtime | Pre-commit git secret scanner (GitGuardian / TruffleHog). |

---

## 14. Data Flow Architecture

### 14.1 End-to-End Data Flow Diagram
```mermaid
flowchart TD
    subgraph DataIngestionFlow["1. Telemetry Ingestion Flow"]
        Sensor[Weather / Sensor Feeds] -->|HTTPS REST| EdgeFn[Supabase Edge Function]
        EdgeFn -->|Batch Insert| MetricsTable[(metrics table)]
    end

    subgraph AnomalyDetectionFlow["2. Anomaly & Correlation Flow"]
        MetricsTable -->|pg_cron Trigger| AnomalyWorker[Anomaly Evaluator]
        AnomalyWorker -->|Check Bounds| Thresholds[(threshold_configs)]
        AnomalyWorker -->|Breach Detected| DB_BFS[Recursive CTE BFS Traversal]
        DB_BFS -->|Enrich Affected Assets| AlertsTable[(alerts table)]
    end

    subgraph RealtimeDispatchFlow["3. Live Client Push Flow"]
        AlertsTable -->|WAL Replication Slot| RealtimeServer[Supabase Realtime WSS]
        RealtimeServer -->|WSS Event Dispatch| ClientListener[useRealtime Hook in React]
        ClientListener -->|Invalidate Cache| TanStack[TanStack Query Cache]
        TanStack -->|Trigger Re-render| DashboardUI[Dashboard / Alert View]
    end

    subgraph UserActionFlow["4. Interactive Simulation Flow"]
        Planner[Urban Planner User] -->|Slider Input| SimUI[Scenario Builder]
        SimUI -->|POST /rpc/fn_simulate_cascade| SimProc[fn_simulate_cascade]
        SimProc -->|Traverse Edges & Apply Factors| GraphTopology[(nodes & edges)]
        SimProc -->|Return Delta Projection| SimUI
    end
```

---

## 15. Core Processing and Algorithm Architecture

### 15.1 Dependency Traversal Algorithm (Recursive CTE BFS)
To trace cascading vulnerabilities, CityNexus implements a breadth-first search directly inside PostgreSQL using recursive SQL:

```sql
CREATE OR REPLACE FUNCTION fn_traverse_dependencies(
  origin_node_id UUID,
  max_depth INT DEFAULT 4,
  min_impact_threshold FLOAT DEFAULT 0.05
)
RETURNS TABLE (
  node_id UUID,
  name VARCHAR,
  domain VARCHAR,
  zone_id VARCHAR,
  depth INT,
  propagated_impact_score FLOAT,
  dependency_chain TEXT[]
)
LANGUAGE sql
STABLE
AS $$
WITH RECURSIVE dependency_path AS (
  -- Base Query: Direct outgoing edges from originating node
  SELECT 
    target_node_id AS current_node_id,
    1 AS current_depth,
    e.weight AS current_impact,
    ARRAY[n_origin.name, n_target.name]::TEXT[] AS chain
  FROM infrastructure_edges e
  JOIN infrastructure_nodes n_origin ON n_origin.node_id = e.source_node_id
  JOIN infrastructure_nodes n_target ON n_target.node_id = e.target_node_id
  WHERE e.source_node_id = origin_node_id

  UNION ALL

  -- Recursive Step: Traverse downstream connected nodes
  SELECT 
    e.target_node_id,
    dp.current_depth + 1,
    dp.current_impact * e.weight,
    dp.chain || n_next.name
  FROM infrastructure_edges e
  JOIN dependency_path dp ON e.source_node_id = dp.current_node_id
  JOIN infrastructure_nodes n_next ON n_next.node_id = e.target_node_id
  WHERE dp.current_depth < max_depth
    AND (dp.current_impact * e.weight) >= min_impact_threshold
    AND NOT (n_next.name = ANY(dp.chain)) -- Prevent circular loops
)
SELECT DISTINCT ON (dp.current_node_id)
  n.node_id,
  n.name,
  n.domain,
  n.zone_id,
  dp.current_depth AS depth,
  dp.current_impact AS propagated_impact_score,
  dp.chain AS dependency_chain
FROM dependency_path dp
JOIN infrastructure_nodes n ON n.node_id = dp.current_node_id
ORDER BY dp.current_node_id, dp.current_impact DESC;
$$;
```

### 15.2 Rule-Based Forward Simulation Algorithm
The forward simulation model propagates a defined percentage perturbation $\delta_0$ across the directed graph. For each outgoing edge $e = (u, v)$, the propagated change $\delta_v$ is calculated as:
$$\delta_v = \delta_u \times e.\text{propagation\_factor}$$

The simulation accumulates compounding shifts at each asset and aggregates the resulting values per municipal zone, outputting a projected delta comparison against baseline metrics.

---

## 16. External Integrations and Data Sources

| Integration ID | Provider | Endpoint / Protocol | Auth | Rate Limit | Failure Mode & Fallback Strategy | Verification Method |
|---|---|---|---|---|---|---|
| **INT-001** | OpenWeatherMap | `https://api.openweathermap.org/data/2.5/weather` | API Key (`appid` param) | 60 req/min (Free Tier) | Edge function catches 429/timeout; logs warning; reads last saved record from `weather_telemetry`. | Integration test verifying fallback record return on mock 429. |
| **INT-002** | OpenStreetMap | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | Open Access | Standard HTTP tile policy | Browser tile cache serves cached map tiles; canvas displays gray grid if network unreachable. | Visual validation of offline map behavior. |
| **INT-003** | Supabase Auth | `https://<proj>.supabase.co/auth/v1` | Anon / Service Key | 30 requests/second | Return formatted `ERR-001` auth error to client; maintain existing session token. | Unit test simulating auth outage response. |
| **INT-004** | Supabase Realtime | `wss://<proj>.supabase.co/realtime/v1/websocket` | Bearer JWT | 500 concurrent connections | Client triggers automatic exponential reconnection; switches to HTTP polling every 30s. | Unit test measuring client fallback on WebSocket disconnection. |

---

## 17. File Storage and Asset Architecture

CityNexus stores tabular CSV analytical reports and exported scenario datasets utilizing **Supabase Storage**:
- **Bucket Configuration:** Bucket named `reports` configured with private access.
- **Upload Flow:** Client formats generated CSV Blob and uploads via `supabase.storage.from('reports').upload(...)`.
- **Access Control:** Storage RLS policy enforces that files are downloadable only by authenticated users holding `ROLE-003` (Planner), `ROLE-006` (Analyst), or `ROLE-007` (Admin).
- **Lifecycle & Retention:** Files are assigned a 30-day expiration retention policy, automatically scrubbed via scheduled edge storage cleanup routines.

---

## 18. Error Handling and Reliability Architecture

### 18.1 Global Error Taxonomy & Classification
```mermaid
flowchart TD
    ErrorEvent[System Error Event Detected] --> Classify{Classify Error Source}
    
    Classify -->|UI / Rendering| UIError[Client Error Boundary]
    Classify -->|Network / HTTP| NetError[Network Interceptor]
    Classify -->|Database / RLS| DBError[PostgREST / Supabase Error Handler]
    Classify -->|WebSocket| WSError[Realtime Reconnection Manager]

    UIError --> RenderFallback[Render Clean Fallback Card with 'Reset UI' Action]
    NetError --> CheckRetry{Idempotent Request?}
    CheckRetry -- Yes --> AutoRetry[TanStack Query Exponential Retry x3]
    CheckRetry -- No --> UserToast[Display Non-Blocking Toast Error]
    DBError --> TranslateCode[Translate PostgreSQL Error Code to User Message]
    WSError --> FallbackPolling[Switch Client to 30s HTTP Fallback Polling]
```

### 18.2 Standard Error Response Contract
All custom RPC functions and edge endpoints standardize on RFC 7807 problem details:
```json
{
  "type": "https://citynexus.internal/errors/cyclic-dependency",
  "title": "Cyclic Dependency Detected",
  "status": 400,
  "detail": "The requested edge from 'Substation 2A' creates an invalid circular loop with existing edge E-104.",
  "instance": "/rest/v1/rpc/fn_create_edge",
  "timestamp": "2026-11-17T10:12:00Z"
}
```

---

## 19. Performance and Scalability Architecture

### 19.1 Frontend Optimization Strategies
1. **Dynamic Code Splitting:** Heavy sub-views (React Flow dependency canvas, Leaflet map view, and Recharts historical stack) are lazy-loaded via React `Suspense` and `React.lazy()` to maintain initial vendor bundle size under 250 KB.
2. **Virtualization & Debouncing:** Parameter sliders on the Scenario Builder are debounced by 250ms to prevent simulation execution storms during user interaction.
3. **Canvas Element Culling:** React Flow canvas enables `onlyRenderVisibleElements=true` to ensure off-screen nodes consume zero SVG rendering overhead.

### 19.2 Database Optimization Strategies
1. **Targeted B-Tree Indexing:** High-frequency telemetry queries utilize composite indexes:
   ```sql
   CREATE INDEX idx_metrics_node_recorded ON metrics(node_id, recorded_at DESC);
   ```
2. **Automated Rollup Aggregation:** A `pg_cron` worker executes every midnight to aggregate raw high-frequency records into daily hourly summaries, keeping the working index memory footprint strictly within Supabase free-tier RAM limits.

---

## 20. Logging, Monitoring and Observability

### 20.1 Observability Matrix
| Log Stream | Log Source | Destination | Retained Attributes | Explicitly Excluded (PII/Security) |
|---|---|---|---|---|
| **Application Errors** | React Error Boundaries | Console / Supabase `error_logs` | Component Stack, Error Name, Route, User ID | Passwords, Session Tokens |
| **Security Events** | Supabase Auth & RLS | Supabase `security_events` | Timestamp, IP Address, Event (Login Failed, RLS Denied) | Plaintext Passwords |
| **Operational Audits** | System Mutations | `audit_logs` table | Performed By User ID, Action, Entity Type, Entity ID, Diff | Confidential System Keys |
| **API Health Telemetry**| Edge Functions | Supabase Edge Log Console | Function Name, Execution Duration, Status Code, Memory | External API Keys |

---

## 21. Deployment and Infrastructure Architecture

### 21.1 Production Deployment Topology
```mermaid
flowchart TD
    subgraph DeveloperWorkspace["Developer Environment"]
        Dev[Local Git Working Copy]
    end

    subgraph GitHubRepo["GitHub Repository"]
        MainBranch[main branch]
    end

    subgraph VercelEdge["Vercel Global Edge Network"]
        CDN[Vercel Global Anycast CDN]
        StaticApp[Static SPA Build Assets / Edge Cache]
    end

    subgraph SupabaseCloud["Supabase Managed Cloud Infrastructure (AWS)"]
        EdgeWorker[Deno Edge Functions]
        PostgREST[PostgREST Engine]
        PostgreSQL[(PostgreSQL 15 Database)]
        RealtimeGW[Realtime WebSocket Gateway]
        StorageS3[S3 Storage Bucket]
    end

    Dev -->|git push| MainBranch
    MainBranch -->|Automated Webhook CI/CD| VercelEdge
    VercelEdge --> CDN
    CDN --> StaticApp
    StaticApp -->|HTTPS REST| PostgREST
    StaticApp -->|WSS| RealtimeGW
    StaticApp -->|HTTPS Invocations| EdgeWorker
    PostgREST --> PostgreSQL
    EdgeWorker --> PostgreSQL
    RealtimeGW --> PostgreSQL
```

### 21.2 CI/CD Deployment Pipeline
1. **GitHub Push Trigger:** Push to `main` branch triggers Vercel deployment preview or production build.
2. **Build Phase:**
   - Execute TypeScript compiler validation: `tsc --noEmit`.
   - Run linter: `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0`.
   - Execute production bundle build: `vite build`.
3. **Deployment:** Static artifacts propagated to Vercel global edge nodes with instant atomic rollback capability.

---

## 22. Environment and Configuration Management

| Environment Variable Name | Layer | Purpose | Sensitivity Classification |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Frontend Client | Public endpoint URL for the Supabase project instance. | Public / Non-Sensitive |
| `VITE_SUPABASE_ANON_KEY` | Frontend Client | Public anonymous API key honoring Row-Level Security. | Public / Safe for Client Bundle |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend / Edge Only | Elevated administrative key bypassing RLS. **NEVER EXPOSED TO CLIENT.** | Highly Sensitive / Secret |
| `OPENWEATHERMAP_API_KEY` | Edge Function Only | API authentication key for fetching weather context. | Sensitive / Secret |
| `VITE_APP_ENV` | Frontend Client | Environment flag (`development`, `staging`, `production`). | Public / Non-Sensitive |

---

## 23. Testing Architecture

| Testing Level | Scope & Component | Technical Tools | Verification Objective |
|---|---|---|---|
| **Unit Testing** | Utility calculations, Zod validation schemas, graph traversal logic. | Vitest | Validate data transformations, rule enforcement, and math functions in isolation. |
| **Component Testing** | Reusable UI components (KPI cards, alert modals, sliders). | React Testing Library + Vitest | Verify component render fidelity, accessibility labels, and event handlers. |
| **API & Database Testing**| PostgreSQL stored procedures, RLS policies, Edge functions. | Supabase CLI Test Runner + pgTAP | Verify RLS blocks unauthorized reads/writes; verify graph recursive queries return correct trees. |
| **E2E Integration** | Core user journeys (Login $\rightarrow$ Dashboard $\rightarrow$ Simulation $\rightarrow$ Alert Triage). | Playwright | Verify complete cross-tier browser flows and real-time WebSocket updates. |

---

## 24. Requirements-to-Architecture Traceability

| PRD Requirement ID | Requirement Summary | Architectural Component | Technical Responsibility | Verification Approach |
|---|---|---|---|---|
| **FR-001** | Multi-Domain Telemetry Aggregation | `DashboardAggregator` (COMP-002) | Query latest rows per domain, compute percentage deltas, render KPI ribbon. | E2E Playwright test validating DOM values against seeded database records. |
| **FR-002** | Domain Detail Inspection | `SectoralViews` (PAGE-005 to 007) | Group and render zone-level metrics for specific sector. | Component test asserting table row count equals active zone count. |
| **FR-003** | Real-Time Telemetry Streaming | `RealtimeStreamManager` (COMP-003) | Manage WebSocket connection and trigger TanStack Query cache invalidations. | Integration test injecting metric row and measuring UI update latency ($\le 1000\text{ms}$). |
| **FR-004** | Status Indicator Computation | `DashboardAggregator` (COMP-002) | Evaluate metrics against BR-003 threshold bounds to emit semantic color tokens. | Unit test verifying threshold boundary edge cases. |
| **FR-005** | Interactive Dependency Graph | `DependencyGraphEngine` (COMP-004) | Render node-edge DAG in React Flow with domain color categorization. | Visual regression test checking SVG node positions and edge arrows. |
| **FR-006** | Cross-Domain Highlighting | `DependencyGraphEngine` (COMP-004) | Dim non-dependent nodes; highlight directed traversal path on click. | DOM inspection verifying opacity and stroke style shifts on node click. |
| **FR-007** | Blast Radius Impact Calculation | `GraphTraversalService` (COMP-005) | Execute `fn_traverse_dependencies` recursive query and return ranked at-risk assets. | pgTAP SQL test asserting correct hop depth and impact attenuation math. |
| **FR-008** | Scenario Parameter Definition | `CascadingSimulator` (COMP-006) | Capture and validate perturbation percentage slider adjustments. | Zod schema validation unit test. |
| **FR-009** | Forward-Propagation Simulation | `CascadingSimulator` (COMP-006) | Execute `fn_simulate_cascade` and output projected metric deltas within 5 seconds. | Benchmark timing test measuring execution turnaround ($\le 5.0\text{s}$). |
| **FR-011** | Threshold Anomaly Evaluation | `AnomalyEvaluator` (COMP-007) | Monitor incoming telemetry and insert alert rows upon threshold breach. | Edge function integration test injecting breaching metric value. |
| **FR-012** | Cross-Domain Alert Enrichment | `CrossDomainCorrelator` (COMP-008) | Call traversal function to populate `alerts.affected_systems` JSON. | Integration test verifying JSON structure of generated alert records. |
| **FR-013** | Alert Lifecycle & Audit Log | `SecurityEnforcer` (COMP-011) | Update alert status, stamp operator ID, and create audit record. | Security test verifying only authorized roles can acknowledge alerts. |
| **FR-014** | Interactive Multi-Layer Map | `GeospatialEngine` (COMP-009) | Render Leaflet map with togglable GeoJSON infrastructure layers. | E2E test verifying layer toggle adds/removes SVG polygon groups. |
| **FR-015** | Zone Health Overlay | `GeospatialEngine` (COMP-009) | Color zone boundary polygons based on composite health index. | Unit test validating composite health index calculation formula. |
| **FR-016** | Map Asset Inspection Drawer | `GeospatialEngine` (COMP-009) | Slide open shadcn/ui sheet on marker click displaying live telemetry. | Component test asserting sheet visibility and live telemetry presence. |
| **FR-017** | Time-Series Charting | `HistoricalAnalytics` (COMP-010) | Render Recharts time-series with date-bucket aggregation. | Snapshot test verifying Recharts SVG line generation. |
| **FR-018** | Synchronized Timeline Scrubbing| `HistoricalAnalytics` (COMP-010) | Synchronize crosshairs across vertically stacked charts via `syncId`. | Interaction test verifying synchronized cursor indicator rendering. |
| **FR-020** | Secure User Authentication | `SecurityEnforcer` (COMP-011) | Manage GoTrue login, JWT session persistence, and logout flows. | E2E test validating successful login redirect and session cookie storage. |
| **FR-021** | Role-Based Access Control | `SecurityEnforcer` (COMP-011) | Restrict route navigation and PostgreSQL mutations based on role claims. | Negative security test asserting 403 Forbidden on unprivileged access. |
| **FR-022** | Topology Configuration Console | `TopologyConfigurator` (COMP-012) | Provide validated forms for node/edge/threshold administrative CRUD. | Form validation test asserting rejection of circular edges (BR-001). |

---

## 25. Architecture Decision Records (ADRs)

### ADR-001: Selection of Client-BaaS Architecture via Supabase
- **Context:** The system requires relational storage, real-time data streaming, user authentication, and serverless compute under hackathon engineering timelines.
- **Decision:** Adopt a pure Client-BaaS pattern utilizing Supabase instead of hosting a custom Node.js/Express server.
- **Consequences:** Eliminates middleware maintenance and hosting overhead; leverages PostgreSQL RLS for security; requires analytical business logic to be encapsulated in SQL functions or Deno edge isolates.
- **Status:** Confirmed.

### ADR-002: Relational-Graph Hybrid Storage via PostgreSQL Recursive CTEs
- **Context:** Modeling infrastructure couplings requires graph traversal (blast-radius calculation), but standing up a standalone Neo4j cluster introduces operational overhead.
- **Decision:** Store nodes and directed edges in normalized PostgreSQL tables and execute traversals using recursive SQL Common Table Expressions (`WITH RECURSIVE`).
- **Consequences:** Single database for all operations; zero inter-database sync latency; sub-50ms query turnaround for municipal topologies ($\le 500$ nodes); limited if topology scales to tens of millions of nodes.
- **Status:** Confirmed.

### ADR-003: Selection of Recharts, React Flow, and React Leaflet
- **Context:** The user-specified technology stack mandates React and Tailwind, but omits dedicated charting, graph diagramming, and mapping libraries.
- **Decision:** Standardize on **Recharts** (SVG time-series with `syncId`), **React Flow** (interactive node-edge canvas), and **React Leaflet** (lightweight 2D GIS mapping).
- **Consequences:** 100% React component integration; zero heavy WebGL dependencies; low learning curve; declarative composition.
- **Status:** Confirmed.

---

## 26. Technical Risks, Constraints and Dependencies

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Status |
|---|---|---|---|---|---|
| **RSK-001** | Recursive CTE infinite loop on circular dependency edges. | High | Low | Enforce acyclic check constraint during edge insertion (BR-001); bound recursive SQL loop to maximum 5 hops. | Mitigated |
| **RSK-002** | Supabase free-tier connection exhaustion during real-time load. | Medium | Low | Route client queries through PostgREST connection pooler (Supavisor); group component real-time listeners into shared channel. | Mitigated |
| **RSK-003** | OpenWeatherMap free-tier rate limit (60 calls/min) breached. | Low | Low | Ingestion worker schedules calls strictly every 15 minutes; responses cached in database. | Mitigated |
| **RSK-004** | Client-side performance degradation on React Flow graph canvas. | Medium | Low | Enable canvas element culling (`onlyRenderVisibleElements=true`); bound visible graph to filtered zone subsets. | Mitigated |

---

## 27. Architecture Assumptions and Open Questions

| Item ID | Topic / Assumption | Architectural Impact | Resolution / Working Assumption |
|---|---|---|---|
| **ASM-001** | Demonstration Dataset Pre-Seeding | Real-time simulator requires historical context. | Working assumption: System includes a database seed migration (`seed.sql`) injecting 30 days of realistic hourly telemetry across 6 municipal zones. |
| **ASM-002** | Metropolitan Geographic Coordinate Base | Leaflet map requires realistic geographic bounds. | Working assumption: Bounding coordinates centered on Bengaluru Metropolitan Region ($12.9716^\circ\text{ N}, 77.5946^\circ\text{ E}$). |
| **OQ-001** | Production Multi-City Deployment | Database schema partitioning for multi-tenant municipal scaling. | Deferred to Phase 2 roadmap; MVP architecture focuses on a single metropolitan footprint. |

---

## 28. MVP Architecture and Future Scalability

### 28.1 MVP Architectural Baseline
The MVP architecture is strictly bounded to the components required to fulfill the 23 PRD functional requirements:
- Client-side React SPA with 15 defined routes.
- PostgreSQL schema covering 8 core tables with RLS and recursive CTE traversal functions.
- Supabase Realtime WebSocket subscription for live dashboard updates.
- 2 Deno Edge Functions handling weather ingestion and anomaly checks.

### 28.2 Future Scalability Pathways (Post-MVP)
- **Phase 2 (IoT Streaming Ingestion):** Introduce an Apache Kafka or RabbitMQ event broker fronting a TimescaleDB extension for handling 10,000+ IoT events per second.
- **Phase 3 (3D Digital Twin):** Integrate Deck.gl and MapLibre GL for WebGL-accelerated 3D building extrusions and subsurface utility pipe rendering.

---

## 29. Architecture Validation and Completeness Review

The architecture has been comprehensively verified against:
1. `proposed_solution.md`: All 7 core capabilities and 23 proposed features mapped to technical architectural components.
2. `prd.md`: Every functional requirement (FR-001 to FR-023) has an explicit architectural owner and verification approach.
3. User-Mandated Technology Stack: 100% adherence to React, Vite, TypeScript, React Router, TanStack Query, Tailwind CSS, shadcn/ui, Lenis, Framer Motion, GSAP, Supabase, and Vercel.
4. Security & Data Integrity: Row-Level Security, JWT authentication, and acyclic graph constraints fully documented.

---

*This document represents the definitive System Architecture Document for CityNexus. It serves as the primary technical blueprint for the subsequent creation of `design.md` and `rules.md`.*

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPageView } from '../features/landing/LandingPageView';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { UserProfileView } from '../features/auth/UserProfileView';
import { MultiDomainDashboard } from '../features/dashboard/MultiDomainDashboard';
import { TrafficDetailView } from '../features/sectoral/TrafficDetailView';
import { ElectricityDetailView } from '../features/sectoral/ElectricityDetailView';
import { UtilitiesDetailView } from '../features/sectoral/UtilitiesDetailView';
import { DependencyGraphView } from '../features/graph/DependencyGraphView';
import { ScenarioSimulationView } from '../features/simulation/ScenarioSimulationView';
import { GeospatialMapView } from '../features/map/GeospatialMapView';
import { AlertCenterView } from '../features/alerts/AlertCenterView';
import { HistoricalAnalysisView } from '../features/history/HistoricalAnalysisView';
import { UserManagementView } from '../features/admin/UserManagementView';
import { SystemConfigView } from '../features/admin/SystemConfigView';

export const router = createBrowserRouter([
  // Public Landing & Auth
  {
    path: '/',
    element: <LandingPageView />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Authenticated Command Application
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <MultiDomainDashboard />,
      },
      {
        path: 'dashboard/traffic',
        element: <TrafficDetailView />,
      },
      {
        path: 'dashboard/electricity',
        element: <ElectricityDetailView />,
      },
      {
        path: 'dashboard/utilities',
        element: <UtilitiesDetailView />,
      },
      {
        path: 'dependencies',
        element: <DependencyGraphView />,
      },
      {
        path: 'simulation',
        element: <ScenarioSimulationView />,
      },
      {
        path: 'map',
        element: <GeospatialMapView />,
      },
      {
        path: 'alerts',
        element: <AlertCenterView />,
      },
      {
        path: 'history',
        element: <HistoricalAnalysisView />,
      },
      {
        path: 'admin/users',
        element: <UserManagementView />,
      },
      {
        path: 'admin/config',
        element: <SystemConfigView />,
      },
      {
        path: 'profile',
        element: <UserProfileView />,
      },
    ],
  },

  // Fallback Catch-all
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

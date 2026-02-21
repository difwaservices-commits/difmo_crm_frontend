// import ErrorBoundary from "./components/ErrorBoundary";
// import ScrollToTop from "./components/ScrollToTop";
// import Dashboard from "./pages/dashboard";
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
// import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import CompanyRegistration from './pages/company-registration';
import TaskManagement from './pages/task-management';
import Dashboard from './pages/dashboard';
import EmployeeManagement from './pages/employee-management';
import TimeTrackingPage from './pages/time-tracking';
import MonitoringDashboard from './pages/monitoring-dashboard';
import AttendanceManagement from './pages/attendance-management';
import EmployeeCheckInCheckOut from './pages/employee-check-in-check-out';
import AttendanceAnalytics from './pages/attendance-analytics';
import ScrollToTop from "./components/ScrollToTop";
import Login from './pages/Login';
import EmployeeDashboard from './pages/employee-dashboard';

import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import CompanyProfile from './pages/company-profile';
import RolesManagement from './pages/settings/roles';
import PayrollPage from './pages/payroll';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company-registration" element={<CompanyRegistration />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee-dashboard" element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/task-management" element={
            <ProtectedRoute>
              <TaskManagement />
            </ProtectedRoute>
          } />
          <Route path="/employee-management" element={
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          } />
          <Route path="/time-tracking" element={
            <ProtectedRoute>
              <TimeTrackingPage />
            </ProtectedRoute>
          } />
          <Route path="/monitoring-dashboard" element={
            <ProtectedRoute>
              <MonitoringDashboard />
            </ProtectedRoute>
          } />
          <Route path="/attendance-management" element={
            <ProtectedRoute>
              <AttendanceManagement />
            </ProtectedRoute>
          } />
          <Route path="/employee-check-in-check-out" element={
            <ProtectedRoute>
              <EmployeeCheckInCheckOut />
            </ProtectedRoute>
          } />
          <Route path="/attendance-analytics" element={
            <ProtectedRoute>
              <AttendanceAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/company-profile" element={
            <ProtectedRoute>
              <CompanyProfile />
            </ProtectedRoute>
          } />
          <Route path="/payroll" element={
            <ProtectedRoute>
              <PayrollPage />
            </ProtectedRoute>
          } />
          <Route path="/settings/roles" element={
            <ProtectedRoute>
              <RolesManagement />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />


          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

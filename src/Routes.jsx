import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/dashboard";
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
// // import ScrollToTop from "components/ScrollToTop";
// import ErrorBoundary from "components/ErrorBoundary";
// import NotFound from "pages/NotFound";
// import CompanyRegistration from './pages/company-registration';
// import TaskManagement from './pages/task-management';
// import Dashboard from './pages/dashboard';
// import EmployeeManagement from './pages/employee-management';
// import TimeTrackingPage from './pages/time-tracking';
// import MonitoringDashboard from './pages/monitoring-dashboard';
// import AttendanceManagement from './pages/attendance-management';
// import EmployeeCheckInCheckOut from './pages/employee-check-in-check-out';
// import AttendanceAnalytics from './pages/attendance-analytics';
// import ScrollToTop from "components/ScrollToTop";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route path="/task-management" element={<TaskManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/time-tracking" element={<TimeTrackingPage />} />
        <Route path="/monitoring-dashboard" element={<MonitoringDashboard />} />
        <Route path="/attendance-management" element={<AttendanceManagement />} />
        <Route path="/employee-check-in-check-out" element={<EmployeeCheckInCheckOut />} />
        <Route path="/attendance-analytics" element={<AttendanceAnalytics />} />
        <Route path="*" element={<NotFound />} /> */}
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

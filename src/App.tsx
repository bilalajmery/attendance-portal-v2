
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import { RequireAuth } from './components/auth/RequireAuth';

// Shared
import { Login } from './routes/shared/Login';
import { AccessDenied } from './routes/shared/AccessDenied';

// Employee
import { EmployeeLayout } from './routes/employee/Layout';
import { EmployeeDashboard } from './routes/employee/Dashboard';
import { EmployeeCalendar } from './routes/employee/Calendar';

// Admin
import { AdminLayout } from './routes/admin/Layout';
import { AdminDashboard } from './routes/admin/dashboard/Dashboard';
import { EmployeeList } from './routes/admin/employees/EmployeeList';
import { AdminList } from './routes/admin/admins/AdminList';
import { AttendanceView } from './routes/admin/attendance/AttendanceView';
import { CalendarView } from './routes/admin/calendar/CalendarView';
import { HolidayManagement } from './routes/admin/holidays/HolidayManagement';
import { SalaryReports } from './routes/admin/reports/SalaryReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Employee Routes */}
          <Route
            path="/"
            element={
              <RequireAuth role="employee">
                <EmployeeLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="calendar" element={<EmployeeCalendar />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="admins" element={<AdminList />} />
            <Route path="attendance" element={<AttendanceView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="holidays" element={<HolidayManagement />} />
            <Route path="reports" element={<SalaryReports />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;

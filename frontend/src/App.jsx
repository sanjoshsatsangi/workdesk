import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login/Login";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import Attendance from "./pages/Attendance/Attendance";
import Profile from "./pages/Profile/Profile";
import Tickets from "./pages/Tickets/Tickets";
import Leaves from "./pages/Leaves/Leaves";
import Announcements from "./pages/Announcements/Announcements";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminTickets from "./pages/AdminTickets/AdminTickets";
import AdminLeaves from "./pages/AdminLeaves/AdminLeaves";
import AdminEmployees from "./pages/AdminEmployees/AdminEmployees";
import AdminAttendance from "./pages/AdminAttendance/AdminAttendance";
import AdminAnnouncements from "./pages/AdminAnnouncements/AdminAnnouncements";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <Tickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <Leaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminAnnouncements />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
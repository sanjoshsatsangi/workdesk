import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchDashboardData = async () => {
    try {
      const [
        ticketsResponse,
        leavesResponse,
        employeesResponse,
        announcementsResponse
      ] = await Promise.all([
        axios.get(
          "https://workdesk-production.up.railway.app/api/tickets",
          { headers }
        ),
        axios.get(
          "https://workdesk-production.up.railway.app/api/leaves",
          { headers }
        ),
        axios.get(
          "https://workdesk-production.up.railway.app/api/users",
          { headers }
        ),
        axios.get(
          "https://workdesk-production.up.railway.app/api/announcements",
          { headers }
        )
      ]);

      setTickets(ticketsResponse.data);
      setLeaves(leavesResponse.data);

      const employeeUsers = employeesResponse.data.filter(
        (employee) => employee.role === "EMPLOYEE"
      );

      setEmployees(employeeUsers);
      setAnnouncements(announcementsResponse.data);
    } catch (error) {
      console.error(
        "Failed to load admin dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openTickets = tickets.filter(
    (ticket) =>
      ticket.status === "OPEN" ||
      ticket.status === "IN_PROGRESS"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>WorkDesk</h2>
          <span>Admin Portal</span>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            className="admin-sidebar-link active"
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </button>

          <button
            className="admin-sidebar-link"
            onClick={() => navigate("/admin/tickets")}
          >
            Tickets
          </button>

          <button
            className="admin-sidebar-link"
            onClick={() => navigate("/admin/leaves")}
          >
            Leave Requests
          </button>

          <button
            className="admin-sidebar-link"
            onClick={() => navigate("/admin/employees")}
          >
            Employees
          </button>

          <button
            className="admin-sidebar-link"
            onClick={() => navigate("/admin/attendance")}
          >
            Attendance
          </button>

          <button
            className="admin-sidebar-link"
            onClick={() => navigate("/admin/announcements")}
          >
            Announcements
          </button>
        </nav>

        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage employees, support requests, leave and company updates.
            </p>
          </div>

          <div className="admin-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Admin"}
              </strong>

              <span>
                {user?.role || "ADMIN"}
              </span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-summary-grid">
            <div className="admin-summary-card">
              <span>Employees</span>

              <strong>
                {employees.length}
              </strong>

              <p>Registered employees</p>
            </div>

            <div className="admin-summary-card">
              <span>Open Tickets</span>

              <strong>
                {openTickets}
              </strong>

              <p>Active support requests</p>
            </div>

            <div className="admin-summary-card">
              <span>Pending Leaves</span>

              <strong>
                {pendingLeaves}
              </strong>

              <p>Awaiting approval</p>
            </div>

            <div className="admin-summary-card">
              <span>Announcements</span>

              <strong>
                {announcements.length}
              </strong>

              <p>Published updates</p>
            </div>
          </div>

          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Quick Overview</h2>

                <p>
                  Current activity across the employee portal.
                </p>
              </div>
            </div>

            <div className="admin-overview-grid">
              <div className="admin-overview-card">
                <span className="overview-label">
                  Total Tickets
                </span>

                <strong>
                  {tickets.length}
                </strong>

                <small>
                  {resolvedTickets} resolved
                </small>
              </div>

              <div className="admin-overview-card">
                <span className="overview-label">
                  Total Leave Requests
                </span>

                <strong>
                  {leaves.length}
                </strong>

                <small>
                  {approvedLeaves} approved
                </small>
              </div>
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Quick Actions</h2>

                <p>
                  Access frequently used administration features.
                </p>
              </div>
            </div>

            <div className="admin-actions-grid">
              <button
                className="admin-action-card"
                onClick={() => navigate("/admin/tickets")}
              >
                <span className="admin-action-icon">
                  T
                </span>

                <strong>
                  Manage Tickets
                </strong>

                <small>
                  Review and update support tickets
                </small>
              </button>

              <button
                className="admin-action-card"
                onClick={() => navigate("/admin/leaves")}
              >
                <span className="admin-action-icon">
                  L
                </span>

                <strong>
                  Manage Leaves
                </strong>

                <small>
                  Approve or reject leave requests
                </small>
              </button>

              <button
                className="admin-action-card"
                onClick={() => navigate("/admin/employees")}
              >
                <span className="admin-action-icon">
                  E
                </span>

                <strong>
                  Employees
                </strong>

                <small>
                  View employee information
                </small>
              </button>

              <button
                className="admin-action-card"
                onClick={() => navigate("/admin/announcements")}
              >
                <span className="admin-action-icon">
                  A
                </span>

                <strong>
                  Announcements
                </strong>

                <small>
                  Publish company announcements
                </small>
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
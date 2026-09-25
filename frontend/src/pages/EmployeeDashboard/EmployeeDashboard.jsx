import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://workdesk-production.up.railway.app/api/tickets/my",
          { headers }
        );

        setTickets(response.data);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      } finally {
        setTicketsLoading(false);
      }
    };

    const fetchLeaves = async () => {
      try {
        const response = await axios.get(
          "https://workdesk-production.up.railway.app/api/leaves/my",
          { headers }
        );

        setLeaves(response.data);
      } catch (error) {
        console.error("Failed to load leaves:", error);
      } finally {
        setLeavesLoading(false);
      }
    };

    const fetchLeaveBalance = async () => {
      try {
        const response = await axios.get(
          "https://workdesk-production.up.railway.app/api/leaves/balance",
          { headers }
        );

        setLeaveBalance(response.data);
      } catch (error) {
        console.error("Failed to load leave balance:", error);
      } finally {
        setBalanceLoading(false);
      }
    };

    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          "https://workdesk-production.up.railway.app/api/attendance/today",
          { headers }
        );

        setAttendance(response.data);
      } catch (error) {
        console.error("Failed to load attendance:", error);
      } finally {
        setAttendanceLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          "https://workdesk-production.up.railway.app/api/announcements",
          { headers }
        );

        const latestAnnouncements = [...response.data]
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 3);

        setAnnouncements(latestAnnouncements);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    fetchTickets();
    fetchLeaves();
    fetchLeaveBalance();
    fetchAttendance();
    fetchAnnouncements();
  }, []);

  const openTickets = tickets.filter(
    (ticket) =>
      ticket.status === "OPEN" ||
      ticket.status === "IN_PROGRESS"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const totalLeaveBalance = leaveBalance
    ? Object.values(leaveBalance).reduce(
        (total, value) =>
          typeof value === "number" ? total + value : total,
        0
      )
    : 0;

  const getAttendanceStatus = () => {
    if (!attendance) {
      return "Not Checked In";
    }

    if (attendance.checkIn && !attendance.checkOut) {
      return "Checked In";
    }

    if (attendance.checkIn && attendance.checkOut) {
      return "Completed";
    }

    return "Not Checked In";
  };

  const formatAnnouncementDate = (dateTime) => {
    if (!dateTime) {
      return "--";
    }

    return new Date(dateTime).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="employee-dashboard">
      <aside className="employee-sidebar">
        <div className="sidebar-brand">
          <h2>WorkDesk</h2>
          <span>Employee Portal</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-link active"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/tickets")}
          >
            My Tickets
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/leaves")}
          >
            Leave Management
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/announcements")}
          >
            Announcements
          </button>
        </nav>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      <main className="employee-main">
        <header className="employee-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back, {user?.name || "Employee"}!
            </p>
          </div>

          <div className="employee-info">
            <div className="employee-avatar">
              {user?.name?.charAt(0).toUpperCase() || "E"}
            </div>

            <div>
              <strong>{user?.name || "Employee"}</strong>
              <span>{user?.role || "EMPLOYEE"}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">
                Open Tickets
              </span>

              <h2>
                {ticketsLoading ? "..." : openTickets}
              </h2>

              <p>Currently active</p>
            </div>

            <div className="summary-card">
              <span className="summary-label">
                Pending Leaves
              </span>

              <h2>
                {leavesLoading ? "..." : pendingLeaves}
              </h2>

              <p>Awaiting approval</p>
            </div>

            <div className="summary-card">
              <span className="summary-label">
                Leave Balance
              </span>

              <h2>
                {balanceLoading ? "..." : totalLeaveBalance}
              </h2>

              <p>Days remaining</p>
            </div>

            <div className="summary-card">
              <span className="summary-label">
                Attendance
              </span>

              <h2 className="attendance-status">
                {attendanceLoading
                  ? "..."
                  : getAttendanceStatus()}
              </h2>

              <p>Today's status</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-section">
              <div className="section-header">
                <div>
                  <h2>Quick Actions</h2>
                  <p>
                    Frequently used employee services
                  </p>
                </div>
              </div>

              <div className="quick-actions">
                <button
                  className="action-card"
                  onClick={() => navigate("/tickets")}
                >
                  <span className="action-icon">+</span>
                  <strong>Raise a Ticket</strong>
                  <small>
                    Report an issue or request support
                  </small>
                </button>

                <button
                  className="action-card"
                  onClick={() => navigate("/leaves")}
                >
                  <span className="action-icon">+</span>
                  <strong>Apply for Leave</strong>
                  <small>
                    Submit a new leave request
                  </small>
                </button>

                <button
                  className="action-card"
                  onClick={() => navigate("/attendance")}
                >
                  <span className="action-icon">✓</span>
                  <strong>Attendance</strong>
                  <small>
                    Check in or check out
                  </small>
                </button>

                <button
                  className="action-card"
                  onClick={() => navigate("/profile")}
                >
                  <span className="action-icon">→</span>
                  <strong>View Profile</strong>
                  <small>
                    Manage your employee information
                  </small>
                </button>
              </div>
            </section>

            <section className="dashboard-section announcements-preview">
              <div className="section-header">
                <div>
                  <h2>Announcements</h2>
                  <p>Latest company updates</p>
                </div>

                <button
                  className="view-all-button"
                  onClick={() => navigate("/announcements")}
                >
                  View All
                </button>
              </div>

              {announcementsLoading ? (
                <div className="empty-state">
                  <p>Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="empty-state">
                  <h3>No announcements yet</h3>
                  <p>
                    Company announcements will appear here.
                  </p>
                </div>
              ) : (
                <div className="announcements-list">
                  {announcements.map((announcement) => (
                    <article
                      className="announcement-card"
                      key={announcement.id}
                    >
                      <div className="announcement-title-area">
                        <div className="announcement-icon">
                          !
                        </div>

                        <div>
                          <h3>{announcement.title}</h3>

                          <span className="announcement-date">
                            {formatAnnouncementDate(
                              announcement.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="announcement-divider" />

                      <p className="announcement-message">
                        {announcement.message}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
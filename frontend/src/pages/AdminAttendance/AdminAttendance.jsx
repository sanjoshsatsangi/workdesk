import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./AdminAttendance.css";

function AdminAttendance() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/attendance",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAttendance(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAttendance();
    }
  }, [token]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString();
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatWorkingHours = (minutes) => {
    if (minutes === null || minutes === undefined) {
      return "-";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatus = (record) => {
    if (record.checkIn && record.checkOut) {
      return "COMPLETED";
    }

    if (record.checkIn) {
      return "CHECKED IN";
    }

    return "ABSENT";
  };

  return (
    <div className="admin-attendance-page">

      <aside className="admin-attendance-sidebar">

        <div className="admin-attendance-brand">
          <h2>WorkDesk</h2>
          <span>ADMIN PORTAL</span>
        </div>

        <nav>

          <button
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/tickets")}
          >
            Tickets
          </button>

          <button
            onClick={() => navigate("/admin/leaves")}
          >
            Leave Requests
          </button>

          <button
            onClick={() => navigate("/admin/employees")}
          >
            Employees
          </button>

          <button className="active">
            Attendance
          </button>

          <button
            onClick={() => navigate("/admin/announcements")}
          >
            Announcements
          </button>

        </nav>

        <button
          className="admin-attendance-back"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </aside>

      <main className="admin-attendance-content">

        <div className="admin-attendance-header">

          <div>
            <h1>Attendance</h1>

            <p>
              View employee attendance and working hours.
            </p>
          </div>

          <button
            className="admin-attendance-refresh"
            onClick={fetchAttendance}
          >
            Refresh
          </button>

        </div>

        <div className="admin-attendance-summary">

          <div className="admin-attendance-summary-card">
            <span>Total Records</span>
            <strong>
              {attendance.length}
            </strong>
          </div>

          <div className="admin-attendance-summary-card">
            <span>Completed</span>
            <strong>
              {
                attendance.filter(
                  (record) =>
                    record.checkIn &&
                    record.checkOut
                ).length
              }
            </strong>
          </div>

          <div className="admin-attendance-summary-card">
            <span>Currently Checked In</span>
            <strong>
              {
                attendance.filter(
                  (record) =>
                    record.checkIn &&
                    !record.checkOut
                ).length
              }
            </strong>
          </div>

        </div>

        {error && (
          <div className="admin-attendance-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-attendance-loading">
            Loading attendance records...
          </div>
        ) : attendance.length === 0 ? (
          <div className="admin-attendance-empty">

            <h3>No attendance records found</h3>

            <p>
              There are currently no employee attendance records.
            </p>

          </div>
        ) : (
          <div className="admin-attendance-table-wrapper">

            <table className="admin-attendance-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {attendance.map((record) => {

                  const employee =
                    record.user?.name ||
                    record.user?.email ||
                    "Employee";

                  const status = getStatus(record);

                  return (
                    <tr key={record.id}>

                      <td>
                        #{record.id}
                      </td>

                      <td>
                        <div className="attendance-employee">
                          {employee}
                        </div>

                        {record.user?.email &&
                          record.user?.name && (
                            <div className="attendance-email">
                              {record.user.email}
                            </div>
                          )}
                      </td>

                      <td>
                        {formatDate(record.date)}
                      </td>

                      <td>
                        {formatDateTime(record.checkIn)}
                      </td>

                      <td>
                        {formatDateTime(record.checkOut)}
                      </td>

                      <td>
                        {formatWorkingHours(
                          record.workingMinutes
                        )}
                      </td>

                      <td>
                        <span
                          className={`attendance-status ${status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {status}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminAttendance;
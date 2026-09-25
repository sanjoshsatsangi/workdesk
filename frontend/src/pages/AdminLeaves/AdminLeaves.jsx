import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./AdminLeaves.css";

function AdminLeaves() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLeaves(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load leave requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeaves();
    }
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/leaves/${id}/status`,
        null,
        {
          params: {
            status
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchLeaves();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update leave status."
      );
    }
  };

  return (
    <div className="admin-leaves-page">

      <aside className="admin-leaves-sidebar">

        <div className="admin-leaves-brand">
          <h2>WorkDesk</h2>
          <span>Admin Portal</span>
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

          <button className="active">
            Leave Requests
          </button>

          <button
            onClick={() => navigate("/admin/employees")}
          >
            Employees
          </button>

          <button
            onClick={() => navigate("/admin/attendance")}
          >
            Attendance
          </button>

          <button
            onClick={() => navigate("/admin/announcements")}
          >
            Announcements
          </button>

        </nav>

        <button
          className="admin-leaves-back"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </aside>

      <main className="admin-leaves-content">

        <div className="admin-leaves-header">

          <div>
            <h1>Leave Requests</h1>

            <p>
              Review and manage employee leave requests.
            </p>
          </div>

          <button
            className="admin-leaves-refresh"
            onClick={fetchLeaves}
          >
            Refresh
          </button>

        </div>

        {error && (
          <div className="admin-leaves-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-leaves-loading">
            Loading leave requests...
          </div>
        ) : leaves.length === 0 ? (
          <div className="admin-leaves-empty">

            <h3>No leave requests found</h3>

            <p>
              There are currently no employee leave requests.
            </p>

          </div>
        ) : (
          <div className="admin-leaves-table-wrapper">

            <table className="admin-leaves-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {leaves.map((leave) => {

                  const employee =
                    leave.user?.name ||
                    leave.user?.email ||
                    "Employee";

                  return (
                    <tr key={leave.id}>

                      <td>
                        #{leave.id}
                      </td>

                      <td>
                        <div className="leave-employee">
                          {employee}
                        </div>

                        {leave.user?.email &&
                          leave.user?.name && (
                            <div className="leave-email">
                              {leave.user.email}
                            </div>
                          )}
                      </td>

                      <td>
                        {leave.leaveType}
                      </td>

                      <td>
                        {leave.startDate
                          ? new Date(
                              `${leave.startDate}T00:00:00`
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        {leave.endDate
                          ? new Date(
                              `${leave.endDate}T00:00:00`
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="leave-reason">
                          {leave.reason || "-"}
                        </div>
                      </td>

                      <td>

                        <span
                          className={`leave-status ${String(
                            leave.status || ""
                          ).toLowerCase()}`}
                        >
                          {leave.status}
                        </span>

                      </td>

                      <td>

                        {leave.status === "PENDING" ? (
                          <div className="leave-actions">

                            <button
                              className="approve-button"
                              onClick={() =>
                                updateStatus(
                                  leave.id,
                                  "APPROVED"
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="reject-button"
                              onClick={() =>
                                updateStatus(
                                  leave.id,
                                  "REJECTED"
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>
                        ) : (
                          <span className="leave-action-done">
                            Completed
                          </span>
                        )}

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

export default AdminLeaves;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./AdminTickets.css";

function AdminTickets() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://workdesk-production.up.railway.app/api/tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTickets(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTickets();
    }
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://workdesk-production.up.railway.app/api/tickets/${id}/status`,
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

      fetchTickets();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update ticket status."
      );
    }
  };

  const deleteTicket = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `https://workdesk-production.up.railway.app/api/tickets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchTickets();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete ticket."
      );
    }
  };

  return (
    <div className="admin-tickets-page">

      <aside className="admin-tickets-sidebar">
        <div className="admin-tickets-brand">
          <h2>WorkDesk</h2>
          <span>Admin Portal</span>
        </div>

        <nav>
          <button
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </button>

          <button className="active">
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
          className="admin-tickets-back"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </aside>

      <main className="admin-tickets-content">

        <div className="admin-tickets-header">
          <div>
            <h1>Support Tickets</h1>
            <p>
              View and manage employee support requests.
            </p>
          </div>

          <button
            className="admin-tickets-refresh"
            onClick={fetchTickets}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="admin-tickets-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-tickets-loading">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="admin-tickets-empty">
            <h3>No tickets found</h3>
            <p>
              There are currently no support tickets.
            </p>
          </div>
        ) : (
          <div className="admin-tickets-table-wrapper">
            <table className="admin-tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>

                    <td>#{ticket.id}</td>

                    <td>
                      {ticket.user?.name ||
                        ticket.employee?.name ||
                        ticket.user?.email ||
                        "Employee"}
                    </td>

                    <td>
                      <div className="ticket-title">
                        {ticket.title}
                      </div>

                      {ticket.description && (
                        <div className="ticket-description">
                          {ticket.description}
                        </div>
                      )}
                    </td>

                    <td>
                      {ticket.category}
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${String(
                          ticket.priority || ""
                        ).toLowerCase()}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td>
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          updateStatus(
                            ticket.id,
                            e.target.value
                          )
                        }
                        className="ticket-status-select"
                      >
                        <option value="OPEN">
                          OPEN
                        </option>

                        <option value="IN_PROGRESS">
                          IN PROGRESS
                        </option>

                        <option value="RESOLVED">
                          RESOLVED
                        </option>
                      </select>
                    </td>

                    <td>
                      {ticket.createdAt
                        ? new Date(
                            ticket.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <button
                        className="ticket-delete-button"
                        onClick={() =>
                          deleteTicket(ticket.id)
                        }
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminTickets;
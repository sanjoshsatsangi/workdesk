import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Tickets.css";

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "IT",
    priority: "MEDIUM"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tickets/my",
        { headers }
      );

      setTickets(response.data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "http://localhost:8080/api/tickets",
        formData,
        { headers }
      );

      setFormData({
        title: "",
        description: "",
        category: "IT",
        priority: "MEDIUM"
      });

      setShowForm(false);
      setSuccess("Ticket created successfully.");

      await fetchTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);

      setError(
        error.response?.data?.message ||
        "Failed to create ticket."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace("_", "-");
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  if (loading) {
    return (
      <div className="tickets-page">
        <div className="tickets-loading">
          Loading tickets...
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-page">

      <div className="tickets-container">

        <header className="tickets-header">

          <div>
            <h1>My Tickets</h1>
            <p>
              Raise support requests and track their status.
            </p>
          </div>

          <div className="tickets-header-actions">

            <button
              className="back-dashboard-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>

            <button
              className="create-ticket-button"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccess("");
              }}
            >
              {showForm ? "Cancel" : "+ Raise Ticket"}
            </button>

          </div>

        </header>

        {error && (
          <div className="tickets-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="tickets-message success">
            {success}
          </div>
        )}

        {showForm && (
          <section className="ticket-form-card">

            <div className="ticket-form-header">
              <div>
                <h2>Raise a New Ticket</h2>
                <p>
                  Describe the issue or request you need help with.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="ticket-form-grid">

                <div className="ticket-form-group full-width">
                  <label>Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter ticket title"
                    required
                  />
                </div>

                <div className="ticket-form-group">
                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="PAYROLL">Payroll</option>
                    <option value="FACILITIES">
                      Facilities
                    </option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="ticket-form-group">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="ticket-form-group full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your issue or request..."
                    rows="5"
                    required
                  ></textarea>
                </div>

              </div>

              <div className="ticket-form-actions">

                <button
                  type="button"
                  className="cancel-ticket-button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-ticket-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Ticket"}
                </button>

              </div>

            </form>

          </section>
        )}

        <section className="tickets-section">

          <div className="tickets-section-header">
            <div>
              <h2>Ticket History</h2>
              <p>
                View your submitted support requests.
              </p>
            </div>

            <span className="ticket-count">
              {tickets.length}{" "}
              {tickets.length === 1 ? "Ticket" : "Tickets"}
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="tickets-empty">

              <div className="tickets-empty-icon">
                +
              </div>

              <h3>No tickets yet</h3>

              <p>
                You haven't raised any support tickets.
              </p>

              <button
                className="empty-create-button"
                onClick={() => {
                  setShowForm(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Raise Your First Ticket
              </button>

            </div>
          ) : (
            <div className="tickets-list">

              {tickets.map((ticket) => (

                <div
                  className="ticket-card"
                  key={ticket.id}
                >

                  <div className="ticket-card-top">

                    <div className="ticket-main-info">

                      <span className="ticket-id">
                        Ticket #{ticket.id}
                      </span>

                      <h3>{ticket.title}</h3>

                    </div>

                    <span
                      className={`ticket-status ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>

                  </div>

                  <p className="ticket-description">
                    {ticket.description}
                  </p>

                  <div className="ticket-card-bottom">

                    <div className="ticket-meta">

                      <span className="ticket-category">
                        {ticket.category}
                      </span>

                      <span
                        className={`ticket-priority ${getPriorityClass(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>

                    </div>

                    <span className="ticket-date">
                      {ticket.createdAt
                        ? new Date(
                            ticket.createdAt
                          ).toLocaleDateString([], {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })
                        : "--"}
                    </span>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default Tickets;

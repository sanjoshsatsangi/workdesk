import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Leaves.css";

function Leaves() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchData = async () => {
    try {
      const [leavesResponse, balanceResponse] =
        await Promise.all([
          axios.get(
            "http://localhost:8080/api/leaves/my",
            { headers }
          ),
          axios.get(
            "http://localhost:8080/api/leaves/balance",
            { headers }
          )
        ]);

      setLeaves(leavesResponse.data);
      setBalance(balanceResponse.data);
    } catch (error) {
      console.error("Failed to load leave data:", error);
      setError("Failed to load leave data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        "http://localhost:8080/api/leaves",
        formData,
        { headers }
      );

      setFormData({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: ""
      });

      setShowForm(false);
      setSuccess("Leave request submitted successfully.");

      await fetchData();
    } catch (error) {
      console.error("Failed to submit leave:", error);

      setError(
        error.response?.data?.message ||
        "Failed to submit leave request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      [],
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  if (loading) {
    return (
      <div className="leaves-page">
        <div className="leaves-loading">
          Loading leave information...
        </div>
      </div>
    );
  }

  return (
    <div className="leaves-page">

      <div className="leaves-container">

        <header className="leaves-header">

          <div>
            <h1>Leave Management</h1>

            <p>
              Apply for leave and track your leave requests.
            </p>
          </div>

          <div className="leaves-header-actions">

            <button
              className="back-dashboard-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>

            <button
              className="apply-leave-button"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccess("");
              }}
            >
              {showForm ? "Cancel" : "+ Apply for Leave"}
            </button>

          </div>

        </header>

        {error && (
          <div className="leaves-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="leaves-message success">
            {success}
          </div>
        )}

        <section className="leave-balance-section">

          <div className="section-heading">

            <div>
              <h2>Leave Balance</h2>

              <p>
                Your available leave days.
              </p>
            </div>

          </div>

          <div className="leave-balance-grid">

            <div className="balance-card">
              <span>Casual Leave</span>

              <strong>
                {balance?.casualLeave ?? 0}
              </strong>

              <small>Days available</small>
            </div>

            <div className="balance-card">
              <span>Sick Leave</span>

              <strong>
                {balance?.sickLeave ?? 0}
              </strong>

              <small>Days available</small>
            </div>

            <div className="balance-card">
              <span>Earned Leave</span>

              <strong>
                {balance?.earnedLeave ?? 0}
              </strong>

              <small>Days available</small>
            </div>

          </div>

        </section>

        {showForm && (
          <section className="leave-form-card">

            <div className="section-heading">

              <div>
                <h2>Apply for Leave</h2>

                <p>
                  Submit a new leave request for approval.
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="leave-form-grid">

                <div className="leave-form-group">
                  <label>Leave Type</label>

                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="CASUAL">
                      Casual Leave
                    </option>

                    <option value="SICK">
                      Sick Leave
                    </option>

                    <option value="EARNED">
                      Earned Leave
                    </option>
                  </select>
                </div>

                <div className="leave-form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="leave-form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="leave-form-group full-width">
                  <label>Reason</label>

                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter the reason for your leave..."
                    rows="5"
                    required
                  ></textarea>
                </div>

              </div>

              <div className="leave-form-actions">

                <button
                  type="button"
                  className="cancel-leave-button"
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
                  className="submit-leave-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Request"}
                </button>

              </div>

            </form>

          </section>
        )}

        <section className="leave-history-section">

          <div className="section-heading leave-history-heading">

            <div>
              <h2>Leave History</h2>

              <p>
                Your submitted leave requests.
              </p>
            </div>

            <span className="leave-count">
              {leaves.length}{" "}
              {leaves.length === 1 ? "Request" : "Requests"}
            </span>

          </div>

          {leaves.length === 0 ? (
            <div className="leaves-empty">

              <div className="leaves-empty-icon">
                +
              </div>

              <h3>No leave requests</h3>

              <p>
                You haven't submitted any leave requests yet.
              </p>

              <button
                className="empty-apply-button"
                onClick={() => {
                  setShowForm(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Apply for Leave
              </button>

            </div>
          ) : (
            <div className="leave-table-wrapper">

              <table className="leave-table">

                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {leaves.map((leave) => (

                    <tr key={leave.id}>

                      <td>
                        <span className="leave-type">
                          {leave.leaveType}
                        </span>
                      </td>

                      <td>
                        {formatDate(leave.startDate)}
                      </td>

                      <td>
                        {formatDate(leave.endDate)}
                      </td>

                      <td className="leave-reason">
                        {leave.reason || "--"}
                      </td>

                      <td>
                        <span
                          className={`leave-status ${getStatusClass(
                            leave.status
                          )}`}
                        >
                          {leave.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default Leaves;
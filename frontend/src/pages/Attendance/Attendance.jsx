import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Attendance.css";

function Attendance() {
  const navigate = useNavigate();

  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchAttendance = async () => {
    try {
      setError("");

      const [todayResult, historyResult] =
        await Promise.allSettled([
          axios.get(
            "http://localhost:8080/api/attendance/today",
            { headers }
          ),
          axios.get(
            "http://localhost:8080/api/attendance/my",
            { headers }
          )
        ]);

      if (todayResult.status === "fulfilled") {
        setToday(todayResult.value.data || null);
      } else if (
        todayResult.reason.response?.status === 404
      ) {
        setToday(null);
      } else {
        throw todayResult.reason;
      }

      if (historyResult.status === "fulfilled") {
        setHistory(historyResult.value.data);
      } else {
        throw historyResult.reason;
      }
    } catch (error) {
      console.error("Failed to load attendance:", error);
      setError("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:8080/api/attendance/check-in",
        {},
        { headers }
      );

      await fetchAttendance();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to check in."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:8080/api/attendance/check-out",
        {},
        { headers }
      );

      await fetchAttendance();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to check out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) {
      return "--";
    }

    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
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

  const formatWorkingTime = (minutes) => {
    if (minutes === null || minutes === undefined) {
      return "--";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const isCheckedIn =
    today?.checkIn && !today?.checkOut;

  const isCompleted =
    today?.checkIn && today?.checkOut;

  if (loading) {
    return (
      <div className="attendance-page">
        <div className="attendance-loading">
          Loading attendance...
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <header className="attendance-header">
          <div>
            <h1>Attendance</h1>

            <p>
              Manage your daily attendance and view your history.
            </p>
          </div>

          <button
            className="back-dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {error && (
          <div className="attendance-error">
            {error}
          </div>
        )}

        <section className="today-attendance">
          <div className="today-header">
            <div>
              <h2>Today's Attendance</h2>

              <p>
                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>

            <span
              className={`attendance-badge ${
                isCompleted
                  ? "completed"
                  : isCheckedIn
                  ? "checked-in"
                  : "not-checked"
              }`}
            >
              {isCompleted
                ? "Completed"
                : isCheckedIn
                ? "Checked In"
                : "Not Checked In"}
            </span>
          </div>

          <div className="attendance-details">
            <div className="attendance-detail-card">
              <span>Check In</span>

              <strong>
                {formatTime(today?.checkIn)}
              </strong>
            </div>

            <div className="attendance-detail-card">
              <span>Check Out</span>

              <strong>
                {formatTime(today?.checkOut)}
              </strong>
            </div>

            <div className="attendance-detail-card">
              <span>Working Time</span>

              <strong>
                {formatWorkingTime(today?.workingMinutes)}
              </strong>
            </div>
          </div>

          <div className="attendance-actions">
            {!today?.checkIn && (
              <button
                className="check-in-button"
                onClick={handleCheckIn}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Check In"}
              </button>
            )}

            {isCheckedIn && (
              <button
                className="check-out-button"
                onClick={handleCheckOut}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Check Out"}
              </button>
            )}

            {isCompleted && (
              <div className="completed-message">
                Today's attendance is complete.
              </div>
            )}
          </div>
        </section>

        <section className="attendance-history">
          <div className="history-header">
            <div>
              <h2>Attendance History</h2>

              <p>
                Your recent attendance records
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="attendance-empty">
              <h3>No attendance records</h3>

              <p>
                Your attendance history will appear here.
              </p>
            </div>
          ) : (
            <div className="attendance-table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Working Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((record) => {
                    const completed =
                      record.checkIn &&
                      record.checkOut;

                    return (
                      <tr key={record.id}>
                        <td>
                          {formatDate(record.date)}
                        </td>

                        <td>
                          {formatTime(record.checkIn)}
                        </td>

                        <td>
                          {formatTime(record.checkOut)}
                        </td>

                        <td>
                          {formatWorkingTime(
                            record.workingMinutes
                          )}
                        </td>

                        <td>
                          <span
                            className={`history-status ${
                              completed
                                ? "completed"
                                : "in-progress"
                            }`}
                          >
                            {completed
                              ? "Completed"
                              : "In Progress"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Attendance;
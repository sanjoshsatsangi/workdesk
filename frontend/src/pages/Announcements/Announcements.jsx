import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Announcements.css";

function Announcements() {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "https://workdesk-production.up.railway.app/api/announcements",
        { headers }
      );

      setAnnouncements(response.data);
    } catch (error) {
      console.error(
        "Failed to load announcements:",
        error
      );

      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (dateTime) => {
    if (!dateTime) {
      return "--";
    }

    return new Date(dateTime).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
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

  if (loading) {
    return (
      <div className="announcements-page">
        <div className="announcements-loading">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-page">
      <div className="announcements-container">

        <header className="announcements-header">
          <div>
            <h1>Announcements</h1>
            <p>
              Stay updated with the latest company news and updates.
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
          <div className="announcements-message">
            {error}
          </div>
        )}

        <section className="announcements-section">

          <div className="announcements-section-header">
            <div>
              <h2>Company Updates</h2>
              <p>
                Important announcements from your organization.
              </p>
            </div>

            <span className="announcement-count">
              {announcements.length}{" "}
              {announcements.length === 1
                ? "Announcement"
                : "Announcements"}
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className="announcements-empty">
              <div className="announcement-empty-icon">
                !
              </div>

              <h3>No announcements yet</h3>

              <p>
                Company announcements will appear here when they are published.
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
                        {formatDate(announcement.createdAt)}
                        {" • "}
                        {formatTime(announcement.createdAt)}
                      </span>
                    </div>

                  </div>

                  <div className="announcement-divider"></div>

                  <p className="announcement-message">
                    {announcement.message}
                  </p>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default Announcements;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./AdminAnnouncements.css";

function AdminAnnouncements() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    message: ""
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://workdesk-production.up.railway.app/api/announcements",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAnnouncements(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnnouncements();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      message: ""
    });
    setShowForm(true);
    setError("");
  };

  const openEditForm = (announcement) => {
    setEditingId(announcement.id);

    setFormData({
      title: announcement.title || "",
      message: announcement.message || ""
    });

    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      title: "",
      message: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required.");
      return;
    }

    try {
      setError("");

      if (editingId) {
        await axios.put(
          `https://workdesk-production.up.railway.app/api/announcements/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          "https://workdesk-production.up.railway.app/api/announcements",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      closeForm();
      fetchAnnouncements();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to save announcement."
      );
    }
  };

  const deleteAnnouncement = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `https://workdesk-production.up.railway.app/api/announcements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchAnnouncements();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete announcement."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="admin-announcements-page">
      <aside className="admin-announcements-sidebar">
        <div className="admin-announcements-brand">
          <h2>WorkDesk</h2>
          <span>ADMIN PORTAL</span>
        </div>

        <nav>
          <button onClick={() => navigate("/admin")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/tickets")}>
            Tickets
          </button>

          <button onClick={() => navigate("/admin/leaves")}>
            Leave Requests
          </button>

          <button onClick={() => navigate("/admin/employees")}>
            Employees
          </button>

          <button onClick={() => navigate("/admin/attendance")}>
            Attendance
          </button>

          <button className="active">
            Announcements
          </button>
        </nav>

        <button
          className="admin-announcements-back"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </aside>

      <main className="admin-announcements-content">
        <div className="admin-announcements-header">
          <div>
            <h1>Announcements</h1>
            <p>
              Create and manage company announcements.
            </p>
          </div>

          <div className="admin-announcements-header-actions">
            <button
              className="admin-announcements-refresh"
              onClick={fetchAnnouncements}
            >
              Refresh
            </button>

            <button
              className="admin-announcements-create"
              onClick={openCreateForm}
            >
              + New Announcement
            </button>
          </div>
        </div>

        {error && (
          <div className="admin-announcements-error">
            {error}
          </div>
        )}

        {showForm && (
          <div className="announcement-form-card">
            <div className="announcement-form-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Announcement"
                    : "Create Announcement"}
                </h2>

                <p>
                  {editingId
                    ? "Update the announcement details."
                    : "Publish an announcement for employees."}
                </p>
              </div>

              <button
                className="announcement-form-close"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="announcement-form-group">
                <label>Title</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                />
              </div>

              <div className="announcement-form-group">
                <label>Message</label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter announcement message"
                  rows="5"
                />
              </div>

              <div className="announcement-form-actions">
                <button
                  type="button"
                  className="announcement-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="announcement-save-button"
                >
                  {editingId
                    ? "Update Announcement"
                    : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-announcements-summary">
          <div className="admin-announcements-summary-card">
            <span>Total Announcements</span>
            <strong>{announcements.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="admin-announcements-loading">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="admin-announcements-empty">
            <h3>No announcements found</h3>

            <p>
              Create an announcement to share information
              with employees.
            </p>

            <button
              onClick={openCreateForm}
              className="announcement-empty-button"
            >
              Create Announcement
            </button>
          </div>
        ) : (
          <div className="admin-announcements-list">
            {announcements.map((announcement) => (
              <div
                className="announcement-card"
                key={announcement.id}
              >
                <div className="announcement-card-content">
                  <h2>{announcement.title}</h2>

                  <p>{announcement.message}</p>

                  <div className="announcement-meta">
                    <span>
                      {announcement.user?.name ||
                        announcement.author?.name ||
                        "Admin"}
                    </span>

                    <span>
                      {formatDate(
                        announcement.createdAt
                      )}
                    </span>
                  </div>
                </div>

                <div className="announcement-card-actions">
                  <button
                    className="announcement-edit-button"
                    onClick={() =>
                      openEditForm(announcement)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="announcement-delete-button"
                    onClick={() =>
                      deleteAnnouncement(announcement.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminAnnouncements;
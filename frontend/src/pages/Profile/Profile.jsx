import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import "./Profile.css";

const API_URL = "https://workdesk-production.up.railway.app/api/profile";

const emptyForm = {
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
  manager: ""
};

const mapProfileToForm = (profile) => ({
  phone: profile?.phone || "",
  department: profile?.department || "",
  designation: profile?.designation || "",
  joiningDate: profile?.joiningDate || "",
  manager: profile?.manager || ""
});

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/me`, { headers });

        setProfile(response.data);
        setFormData(mapProfileToForm(response.data));
        setEditing(false);
      } catch (error) {
        if (error.response?.status === 404) {
          // Employee has not created a profile yet.
          setProfile(null);
          setFormData(emptyForm);
          setEditing(true);
        } else {
          console.error("Failed to load profile:", error);
          setError(
            error.response?.data?.message ||
            "Failed to load profile. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.phone.trim() ||
      !formData.department.trim() ||
      !formData.designation.trim() ||
      !formData.joiningDate
    ) {
      setError(
        "Please fill in phone, department, designation, and joining date."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        joiningDate: formData.joiningDate,
        manager: formData.manager.trim() || null
      };

      const response = profile
        ? await axios.put(API_URL, payload, { headers })
        : await axios.post(API_URL, payload, { headers });

      setProfile(response.data);
      setFormData(mapProfileToForm(response.data));
      setEditing(false);

      setSuccess(
        profile
          ? "Profile updated successfully."
          : "Profile created successfully."
      );
    } catch (error) {
      console.error("Failed to save profile:", error);

      setError(
        error.response?.data?.message ||
        "Failed to save profile. Please check your details and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setFormData(mapProfileToForm(profile));
    setEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(mapProfileToForm(profile));
      setEditing(false);
    } else {
      // A new employee must complete the profile before leaving edit mode.
      setFormData(emptyForm);
      setEditing(true);
    }

    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>
              View and manage your employee information.
            </p>
          </div>

          <div className="profile-header-actions">
            <button
              type="button"
              className="back-dashboard-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>

            {!editing && (
              <button
                type="button"
                className="edit-profile-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="profile-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-message success">
            {success}
          </div>
        )}

        <section className="profile-card">
          <div className="profile-identity">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "E"}
            </div>

            <div>
              <h2>{user?.name || "Employee"}</h2>
              <p>{user?.email || "--"}</p>

              <span className="profile-role">
                {user?.role || "EMPLOYEE"}
              </span>
            </div>
          </div>

          <div className="profile-divider"></div>

          {!editing ? (
            <div className="profile-details">
              <div className="profile-detail">
                <span>Phone</span>
                <strong>{profile?.phone || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Department</span>
                <strong>{profile?.department || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Designation</span>
                <strong>{profile?.designation || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Joining Date</span>
                <strong>{profile?.joiningDate || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Manager</span>
                <strong>{profile?.manager || "Not provided"}</strong>
              </div>
            </div>
          ) : (
            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >
              {!profile && (
                <p className="profile-form-hint">
                  Complete your employee profile to continue.
                </p>
              )}

              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="department">Department *</label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="designation">Designation *</label>
                  <input
                    id="designation"
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="joiningDate">Joining Date *</label>
                  <input
                    id="joiningDate"
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="manager">Manager</label>
                  <input
                    id="manager"
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="Enter manager name"
                  />
                </div>
              </div>

              <div className="profile-form-actions">
                {profile && (
                  <button
                    type="button"
                    className="cancel-profile-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="save-profile-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : profile
                      ? "Save Changes"
                      : "Create Profile"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
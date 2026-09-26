import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(
        formData.email,
        formData.password,
        "ADMIN"
      );

      if (user.role !== "ADMIN") {
        throw new Error("Invalid admin account.");
      }

      navigate("/admin");
    } catch (error) {
      const message = error.response?.data?.message;

      if (message) {
        setError(message);
      } else if (error.response?.status === 401) {
        setError("Invalid admin email or password.");
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>WorkDesk</h1>

          <span className="admin-login-badge">
            ADMIN PORTAL
          </span>

          <p>
            Sign in to manage the employee support portal.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-login-form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-login-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            Are you an employee?
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
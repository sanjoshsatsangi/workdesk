import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./AdminEmployees.css";

function AdminEmployees() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const employeeUsers = response.data.filter(
        (user) => user.role === "EMPLOYEE"
      );

      setEmployees(employeeUsers);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token]);

  return (
    <div className="admin-employees-page">

      <aside className="admin-employees-sidebar">

        <div className="admin-employees-brand">
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

          <button
            onClick={() => navigate("/admin/leaves")}
          >
            Leave Requests
          </button>

          <button className="active">
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
          className="admin-employees-back"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>

      </aside>

      <main className="admin-employees-content">

        <div className="admin-employees-header">

          <div>
            <h1>Employees</h1>

            <p>
              View all employees registered in WorkDesk.
            </p>
          </div>

          <button
            className="admin-employees-refresh"
            onClick={fetchEmployees}
          >
            Refresh
          </button>

        </div>

        <div className="admin-employees-summary">

          <div className="admin-employees-summary-card">
            <span>Total Employees</span>
            <strong>
              {employees.length}
            </strong>
          </div>

        </div>

        {error && (
          <div className="admin-employees-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-employees-loading">
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div className="admin-employees-empty">

            <h3>No employees found</h3>

            <p>
              There are currently no employee accounts.
            </p>

          </div>
        ) : (
          <div className="admin-employees-table-wrapper">

            <table className="admin-employees-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>

                {employees.map((employee) => (
                  <tr key={employee.id}>

                    <td>
                      #{employee.id}
                    </td>

                    <td>
                      <div className="employee-name">
                        {employee.name}
                      </div>
                    </td>

                    <td>
                      {employee.email}
                    </td>

                    <td>
                      <span className="employee-role">
                        {employee.role}
                      </span>
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

export default AdminEmployees;
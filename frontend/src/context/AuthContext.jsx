import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password, role) => {
    const response = await axios.post(
      "https://workdesk-production.up.railway.app/api/auth/login",
      {
        email,
        password,
        role
      }
    );

    const newToken = response.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    const userResponse = await axios.get(
      "https://workdesk-production.up.railway.app/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${newToken}`
        }
      }
    );

    setUser(userResponse.data);

    return userResponse.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://workdesk-production.up.railway.app/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
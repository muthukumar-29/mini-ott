import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import "./styles/Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ REAL DJANGO LOGIN
      const res = await api.post("auth/login/", {
        username: credentials.username,
        password: credentials.password,
      });

      // ✅ STORE TOKEN VIA CONTEXT
      login({
        accessToken: res.data.access,
        userData: { username: credentials.username },
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-large">
            <div className="logo-icon-large">🎥</div>
            <h1>FilmHub</h1>
          </div>
          <p>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-text">{error}</p>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  username: e.target.value,
                })
              }
              required
              placeholder="Enter your Username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ fix: ensure there's a slash between base URL and endpoint
      const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
        ? import.meta.env.VITE_API_BASE_URL
        : import.meta.env.VITE_API_BASE_URL + "/";

      await axios.post(`${baseURL}api/auth/register`, {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container font-style">
      <div className="glass-box">
        <div className="border-animation"></div>
        <div className="border-animation reverse"></div>

        <h1 className="register-title">Create Account</h1>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            className="input-field"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/" className="login-btn-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

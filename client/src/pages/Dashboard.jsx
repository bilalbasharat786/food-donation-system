import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard({ isSidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    donors: 0,
    beneficiaries: 0,
    stores: 0,
    donations: 0,
    distributions: 0
  });

  // ✅ Safe Base URL fix — ensures it always ends with a slash "/"
  const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL + "/";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ updated to use baseURL
        const res = await axios.get(`${baseURL}api/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={`dashboard-container ${isSidebarOpen ? "shifted" : "normal"}`}>
      <div className="dashboard-header">
        <div className="title-wrap">
          <h1>Dashboard</h1>
          <div className="dashboard-subtitle">Welcome back {user?.name}</div>
        </div>

        <div className="user-chip">
          <div className="user-avatar">{(user?.name || 'U').charAt(0)}</div>
          <div className="p-muted">Signed in</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card variant-a">
          <div className="stat-top">
            <div className="stat-icon">D</div>
            <div>
              <div className="stat-value">{stats.donors}</div>
              <div className="stat-label">Donors</div>
            </div>
          </div>
        </div>

        <div className="stat-card variant-b">
          <div className="stat-top">
            <div className="stat-icon">B</div>
            <div>
              <div className="stat-value">{stats.beneficiaries}</div>
              <div className="stat-label">Beneficiaries</div>
            </div>
          </div>
        </div>

        <div className="stat-card variant-a">
          <div className="stat-top">
            <div className="stat-icon">S</div>
            <div>
              <div className="stat-value">{stats.stores}</div>
              <div className="stat-label">Stores</div>
            </div>
          </div>
        </div>

        <div className="stat-card variant-b">
          <div className="stat-top">
            <div className="stat-icon">DN</div>
            <div>
              <div className="stat-value">{stats.donations}</div>
              <div className="stat-label">Donations</div>
            </div>
          </div>
        </div>

        <div className="stat-card variant-a">
          <div className="stat-top">
            <div className="stat-icon">DS</div>
            <div>
              <div className="stat-value">{stats.distributions}</div>
              <div className="stat-label">Distributions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-footer">
        You're running the themed dashboard — neat & shiny ✨
      </div>
    </div>
  );
}

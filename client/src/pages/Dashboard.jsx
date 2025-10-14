import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard({ isSidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    donors: 0,
    beneficiaries: 0,
    stores: 0,
    donations: 0,
    distributions: 0,
  });

  // 🟢 Graph Data (backend se)
  const [chartData, setChartData] = useState([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL + "/";

  // ---------------- FETCH TOTAL STATS ----------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${baseURL}api/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching stats:", err.response?.data || err.message);
      }
    };
    fetchStats();
  }, []);

  // ---------------- FETCH GRAPH DATA (REAL API) ----------------
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await axios.get(`${baseURL}api/donations/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Ab sirf aaj ka data aayega
const today = res.data[0] || { date: "Today", totalKg: 0 };
const formatted = [
  { day: today.date, current: today.totalKg, previous: 0 },
];

setChartData(formatted);

        setChartData(formatted);
      } catch (err) {
        console.error("❌ Error fetching graph data:", err.response?.data || err.message);
      }
    };
    fetchGraphData();
  }, []);

  return (
    <div
      className={`dashboard-container ${isSidebarOpen ? "shifted" : "normal"}`}
    >
      {/* Header */}
      <div className="dashboard-header">
        <div className="title-wrap">
          <h1>Dashboard</h1>
          <div className="dashboard-subtitle">Welcome back {user?.name}</div>
        </div>

        <div className="user-chip">
          <div className="user-avatar">
            {(user?.name || "U").charAt(0)}
          </div>
          <div className="p-muted">Signed in</div>
        </div>
      </div>

      {/* Stats */}
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

      {/* --- Graph Section --- */}
      <div className="chart-section">
        <h2 className="chart-title">Donation Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0072ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff512f" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#dd2476" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(20,20,40,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#fff",
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#00c6ff" }}
              animationDuration={250}
            />

            {/* Previous Week (pink) */}
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#dd2476"
              fillOpacity={1}
              fill="url(#colorPrevious)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              animationDuration={400}
            />

            {/* Current Week (blue) */}
            <Area
              type="monotone"
              dataKey="current"
              stroke="#00c6ff"
              fillOpacity={1}
              fill="url(#colorCurrent)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




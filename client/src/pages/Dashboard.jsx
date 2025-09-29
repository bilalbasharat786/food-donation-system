import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
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

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("http://localhost:5000/api/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back {user?.name}</p>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
        <div style={{ background: " #2ec4b6", color: "white", padding: "20px", borderRadius: "8px" }}>
          <h2>{stats.donors}</h2>
          <p>Donors</p>
        </div>
        <div style={{ background: "#2ec4b6", color: "white", padding: "20px", borderRadius: "8px" }}>
          <h2>{stats.beneficiaries}</h2>
          <p>Beneficiaries</p>
        </div>
        <div style={{ background: " #2ec4b6", color: "white", padding: "20px", borderRadius: "8px" }}>
          <h2>{stats.stores}</h2>
          <p>Stores</p>
        </div>
        <div style={{ background: " #2ec4b6", color: "white", padding: "20px", borderRadius: "8px" }}>
          <h2>{stats.donations}</h2>
          <p>Donations</p>
        </div>
        <div style={{ background: " #2ec4b6", color: "white", padding: "20px", borderRadius: "8px" }}>
          <h2>{stats.distributions}</h2>
          <p>Distributions</p>
        </div>
      </div>

     
    </div>
  );
}


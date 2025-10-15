import { useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Reports.css";

export default function Reports({ isSidebarOpen }) {
  const [donors, setDonors] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stores, setStores] = useState([]);
  const [summary, setSummary] = useState({});
  const [active, setActive] = useState("");

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL + "/";

  // === Fetch APIs ===
  const fetchDonors = async () => {
    const res = await axios.get(`${baseURL}api/reports/donors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDonors(res.data);
    setActive("donors");
  };

  const fetchBeneficiaries = async () => {
    const res = await axios.get(`${baseURL}api/reports/beneficiaries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBeneficiaries(res.data);
    setActive("beneficiaries");
  };

  const fetchStores = async () => {
    const res = await axios.get(`${baseURL}api/reports/stores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStores(res.data.stores);
    setSummary(res.data.summary);
    setActive("stores");
  };

  const handlePrint = useReactToPrint({
    content: () => document.getElementById("report-sheet"),
  });

  // === Prepare Graph Data (Last 7 Entries) ===
  const getGraphData = (data, labelKey, valueKey) => {
    if (!data.length) return [];
    const sliced = data.slice(-7); // last 7 entries
    return sliced.map((item, i) => ({
      label: item[labelKey] || `#${i + 1}`,
      value: item[valueKey] || 0,
    }));
  };

  const donorGraph = getGraphData(donors, "name", "quantity");
  const beneGraph = getGraphData(beneficiaries, "name", "householdSize");
  const storeGraph = getGraphData(stores, "name", "capacityKg");

  return (
    <div
      className={`reports-container ${isSidebarOpen ? "shifted" : "normal"}`}
    >
      <div className="reports-header">
        <h1 className="page-title">📊 Reports</h1>
      </div>

      {/* Buttons */}
      <div className="btn-group">
        <button className="btn" onClick={fetchDonors}>
          Donors Report
        </button>
        <button className="btn" onClick={fetchBeneficiaries}>
          Beneficiaries Report
        </button>
        <button className="btn" onClick={fetchStores}>
          Stores Report
        </button>
        <button className="btn secondary" onClick={handlePrint}>
          Print / Export PDF
        </button>
      </div>

      {/* Report Container */}
      <div id="report-sheet" className="card">
        {!active && <p className="text-muted">Select any report to view…</p>}

        {/* Donors Report */}
        {active === "donors" && (
          <>
            <h2>Donors Report</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Food</th>
                  <th>Qty (kg)</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.foodType}</td>
                    <td>{d.quantity}</td>
                  </tr>
                ))}
                {!donors.length && (
                  <tr>
                    <td colSpan={3} className="text-muted center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Donors Graph */}
            {donors.length > 0 && (
              <div style={{ width: "100%", height: 300, marginTop: 40 }}>
                <h3>Last 7 Donors (Quantity Trend)</h3>
                <ResponsiveContainer>
                  <AreaChart data={donorGraph}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* Beneficiaries Report */}
        {active === "beneficiaries" && (
          <>
            <h2>Beneficiaries Report</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((b) => (
                  <tr key={b._id}>
                    <td>{b.name}</td>
                    <td>{b.type}</td>
                    <td>{b.contact}</td>
                  </tr>
                ))}
                {!beneficiaries.length && (
                  <tr>
                    <td colSpan={3} className="text-muted center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Beneficiaries Graph */}
            {beneficiaries.length > 0 && (
              <div style={{ width: "100%", height: 300, marginTop: 40 }}>
                <h3>Last 7 Beneficiaries (Household Size Trend)</h3>
                <ResponsiveContainer>
                  <AreaChart data={beneGraph}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* Stores Report */}
        {active === "stores" && (
          <>
            <h2>Stores Report</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Location</th>
                  <th>Capacity (kg)</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.location}</td>
                    <td>{s.capacityKg}</td>
                  </tr>
                ))}
                {!stores.length && (
                  <tr>
                    <td colSpan={3} className="text-muted center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <h3>Summary by Food Type</h3>
            <div className="summary">
              {Object.entries(summary).map(([type, total]) => (
                <span key={type} className="badge">
                  {type}: {total}kg
                </span>
              ))}
              {!Object.keys(summary).length && (
                <p className="text-muted">No summary</p>
              )}
            </div>

            {/* Stores Graph */}
            {stores.length > 0 && (
              <div style={{ width: "100%", height: 300, marginTop: 40 }}>
                <h3>Last 7 Stores (Capacity Trend)</h3>
                <ResponsiveContainer>
                  <AreaChart data={storeGraph}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}






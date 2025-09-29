import { useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

export default function Reports() {
  const [donors, setDonors] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stores, setStores] = useState([]);
  const [summary, setSummary] = useState({});
  const [active, setActive] = useState("");

  // token localStorage se lo
  const token = localStorage.getItem("token");

  const fetchDonors = async () => {
    const res = await axios.get("http://localhost:5000/api/reports/donors", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDonors(res.data);
    setActive("donors");
  };

  const fetchBeneficiaries = async () => {
    const res = await axios.get("http://localhost:5000/api/reports/beneficiaries", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBeneficiaries(res.data);
    setActive("beneficiaries");
  };

  const fetchStores = async () => {
    const res = await axios.get("http://localhost:5000/api/reports/stores", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStores(res.data.stores);
    setSummary(res.data.summary);
    setActive("stores");
  };

  const handlePrint = useReactToPrint({
    content: () => document.getElementById("report-sheet"),
  });

  return (
    <div>
      <h1>Reports</h1>

      {/* Buttons */}
      <div className="btn-group">
        <button onClick={fetchDonors}>Donors Report</button>
        <button onClick={fetchBeneficiaries}>Beneficiaries Report</button>
        <button onClick={fetchStores}>Stores Report</button>
        <button className="secondary" onClick={handlePrint}>Print / Export PDF</button>
      </div>

      {/* Report Container */}
      <div id="report-sheet" className="card">
        {!active && <p className="text-muted">Select any report to view…</p>}

        {/* Donors Report */}
        {active === "donors" && (
          <>
            <h2>Donors Report</h2>
            <table>
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
                    <td colSpan={3} className="text-muted center">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Beneficiaries Report */}
        {active === "beneficiaries" && (
          <>
            <h2>Beneficiaries Report</h2>
            <table>
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
                    <td colSpan={3} className="text-muted center">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Stores Report */}
        {active === "stores" && (
          <>
            <h2>Stores Report</h2>
            <table>
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
                    <td colSpan={3} className="text-muted center">No data</td>
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
          </>
        )}
      </div>
    </div>
  );
}



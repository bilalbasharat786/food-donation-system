import { useState, useEffect } from "react";
import axios from "axios";
import "./Distributions.css"; // 👈 apna CSS import kiya

export default function Distributions({ isSidebarOpen }) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stores, setStores] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [form, setForm] = useState({
    beneficiaryId: "",
    storeId: "",
    foodType: "",
    qtyKg: ""
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const beneficiariesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/beneficiaries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const storesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const distributionsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/distributions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBeneficiaries(beneficiariesRes.data);
      setStores(storesRes.data);
      setDistributions(distributionsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/distributions`,
        {
          beneficiaryId: form.beneficiaryId,
          storeId: form.storeId,
          items: [{ foodType: form.foodType, qtyKg: Number(form.qtyKg) }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({ type: "success", text: "Distribution recorded ✅" });
      setForm({ beneficiaryId: "", storeId: "", foodType: "", qtyKg: "" });
      fetchData();
    } catch (err) {
      console.error("Error saving distribution:", err.response?.data || err.message);
      setToast({ type: "error", text: "Error saving distribution ❌" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`distributions-page ${isSidebarOpen ? "shifted" : ""}`}>
      <h1 className="page-title">📦 Distributions</h1>

      {/* Form Card */}
      <div className="card distribution-form-card">
        <h2>Record Distribution</h2>
        <form onSubmit={handleSubmit} className="distribution-form">
          <div>
            <label>Beneficiary</label>
            <select
              value={form.beneficiaryId}
              onChange={(e) => setForm({ ...form, beneficiaryId: e.target.value })}
              required
            >
              <option value="">Select Beneficiary</option>
              {beneficiaries.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Store</label>
            <select
              value={form.storeId}
              onChange={(e) => setForm({ ...form, storeId: e.target.value })}
              required
            >
              <option value="">Select Store</option>
              {stores.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Food Type</label>
            <input
              type="text"
              placeholder="Food Type"
              value={form.foodType}
              onChange={(e) => setForm({ ...form, foodType: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Quantity (kg)</label>
            <input
              type="number"
              placeholder="Quantity (kg)"
              value={form.qtyKg}
              onChange={(e) => setForm({ ...form, qtyKg: e.target.value })}
              required
            />
          </div>

          <div className="full-width">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "➕ Add Distribution"}
            </button>
          </div>
        </form>
      </div>

      {/* Distributions List Card */}
      <div className="card distribution-table-card">
        <h2>All Distributions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Beneficiary</th>
                <th>Store</th>
                <th>Items</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((d) => (
                <tr key={d._id}>
                  <td>{d.beneficiaryId?.name}</td>
                  <td>{d.storeId?.name}</td>
                  <td>
                    {d.items.map((i, idx) => (
                      <span key={idx}>
                        {i.foodType} ({i.qtyKg}kg)
                      </span>
                    ))}
                  </td>
                  <td>{new Date(d.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {!distributions.length && (
                <tr>
                  <td colSpan={4}>No distributions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}

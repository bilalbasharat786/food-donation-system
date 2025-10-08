import { useState, useEffect } from "react";
import axios from "axios";
import "./Beneficiaries.css"; // 👈 Theme CSS link

function Beneficiaries({ isSidebarOpen }) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [form, setForm] = useState({
    type: "individual",
    name: "",
    contact: "",
    address: "",
    householdSize: "",
    notes: "",
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------- Fetch Beneficiaries ----------------
  const fetchBeneficiaries = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/beneficiaries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBeneficiaries(res.data);
    } catch (err) {
      console.error("Error fetching beneficiaries:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  // ---------------- Add Beneficiary ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/beneficiaries`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        type: "individual",
        name: "",
        contact: "",
        address: "",
        householdSize: "",
        notes: "",
      });

      setToast({ type: "success", text: "Beneficiary added ✅" });
      fetchBeneficiaries();
    } catch (err) {
      setToast({ type: "error", text: "Error adding beneficiary ❌" });
    }
    setLoading(false);
  };

  // ---------------- Delete Beneficiary ----------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/beneficiaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ type: "success", text: "Beneficiary deleted 🗑️" });
      fetchBeneficiaries();
    } catch (err) {
      setToast({ type: "error", text: "Error deleting beneficiary ❌" });
    }
  };

  return (
    <div className={`beneficiaries-page ${isSidebarOpen ? "shifted" : ""}`}>
      <h1 className="page-title">🤝 Beneficiaries</h1>

      {/* Form */}
      <div className="card beneficiary-form-card">
        <h2>Add New Beneficiary</h2>
        <form onSubmit={handleSubmit} className="beneficiary-form">
          <div>
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="individual">Individual</option>
              <option value="family">Family</option>
            </select>
          </div>

          <div>
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Contact</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {form.type === "family" && (
            <div>
              <label>Household Size</label>
              <input
                type="number"
                value={form.householdSize}
                onChange={(e) => setForm({ ...form, householdSize: e.target.value })}
              />
            </div>
          )}

          <div>
            <label>Notes</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="full-width">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "➕ Add Beneficiary"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card beneficiary-table-card">
        <h2>All Beneficiaries</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Household</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.type}</td>
                  <td>{b.contact}</td>
                  <td>{b.address}</td>
                  <td>{b.type === "family" ? b.householdSize : "-"}</td>
                  <td>{b.notes}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(b._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!beneficiaries.length && (
                <tr>
                  <td colSpan={7}>No beneficiaries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}

export default Beneficiaries;


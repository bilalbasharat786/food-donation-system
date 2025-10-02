import { useState, useEffect } from "react";
import axios from "axios";
import "./Stores.css"; // 👈 apna CSS link kiya

export default function Stores({ isSidebarOpen }) {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacityKg: "",
    supportedFoodTypes: "",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedForm = {
      ...form,
      capacityKg: Number(form.capacityKg),
      supportedFoodTypes: form.supportedFoodTypes
        .split(",")
        .map((t) => t.trim()),
    };

    try {
      await axios.post("http://localhost:5000/api/stores", formattedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ name: "", location: "", capacityKg: "", supportedFoodTypes: "" });
      setToast({ type: "success", text: "Store added ✅" });
      fetchStores();
    } catch (err) {
      console.error("Error adding store:", err.response?.data || err.message);
      setToast({ type: "error", text: "Failed to add store ❌" });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ type: "success", text: "Store deleted 🗑️" });
      fetchStores();
    } catch (err) {
      console.error("Error deleting store:", err.response?.data || err.message);
      setToast({ type: "error", text: "Failed to delete ❌" });
    }
  };

  return (
    <div className={`stores-page ${isSidebarOpen ? "shifted" : ""}`}>
      <h1 className="page-title">🏬 Stores</h1>

      {/* Form */}
      <div className="card stores-form-card">
        <h2>Add New Store</h2>
        <form onSubmit={handleSubmit} className="stores-form">
          <div>
            <label>Store Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Capacity (kg)</label>
            <input
              type="number"
              value={form.capacityKg}
              onChange={(e) => setForm({ ...form, capacityKg: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Supported Food Types</label>
            <input
              value={form.supportedFoodTypes}
              onChange={(e) =>
                setForm({ ...form, supportedFoodTypes: e.target.value })
              }
              placeholder="e.g. Rice, Wheat"
              required
            />
          </div>
          <div className="full-width">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "➕ Add Store"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card stores-table-card">
        <h2>All Stores</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Food Types</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.location}</td>
                  <td>{s.capacityKg} kg</td>
                  <td>{s.supportedFoodTypes.join(", ")}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(s._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!stores.length && (
                <tr>
                  <td colSpan={5}>No stores added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "error" : "success"}`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}

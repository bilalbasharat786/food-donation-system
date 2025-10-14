import { useEffect, useState } from "react";
import axios from "axios";
import "./Donors.css";

export default function Donors({ isSidebarOpen }) {
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    foodType: "",
    quantity: "",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const token = localStorage.getItem("token");

  const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL + "/";

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${baseURL}api/donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonors(res.data);
    } catch (err) {
      console.error("❌ Fetch donors error:", err);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios.post(
      `${baseURL}api/donors`,
      { ...form, quantity: Number(form.quantity || 0) },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({ name: "", contact: "", address: "", foodType: "", quantity: "" });
    setToast({ type: "success", text: "Donor added ✅" });
    fetchDonors();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseURL}api/donors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setToast({ type: "success", text: "Donor deleted 🗑️" });
    fetchDonors();
  };

  // ✅ Filter donors as you type
  const filteredDonors = donors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`donors-page ${isSidebarOpen ? "shifted" : ""}`}>
      {/* ===== Header + Search ===== */}
      <div className="donor-header">
        <h1 className="page-title">🌟 Donors</h1>

        <input
          type="text"
          className="donor-search"
          placeholder="Search donors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {/* ===== Show only search results when searching ===== */}
      {search ? (
        <div className="card donor-table-card focus-mode">
          <h2>Search Results</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Food</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((d) => (
                    <tr key={d._id}>
                      <td>{d.name}</td>
                      <td>{d.contact}</td>
                      <td>{d.foodType}</td>
                      <td>{d.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No donor found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* ===== Add Donor Form ===== */}
          <div className="card donor-form-card">
            <h2>Add New Donor</h2>
            <form onSubmit={handleSubmit} className="donor-form">
              <div>
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Contact</label>
                <input
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Food Type</label>
                <input
                  value={form.foodType}
                  onChange={(e) =>
                    setForm({ ...form, foodType: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Quantity (kg)</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="full-width">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Saving..." : "➕ Add Donor"}
                </button>
              </div>
            </form>
          </div>

          {/* ===== Full Donor List ===== */}
          <div className="card donor-table-card">
            <h2>All Donors</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Food</th>
                    <th>Qty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((d) => (
                    <tr key={d._id}>
                      <td>{d.name}</td>
                      <td>{d.contact}</td>
                      <td>{d.foodType}</td>
                      <td>{d.quantity}</td>
                      <td>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(d._id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!donors.length && (
                    <tr>
                      <td colSpan={5}>No donors yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}





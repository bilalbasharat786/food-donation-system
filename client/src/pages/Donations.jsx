import { useState, useEffect } from "react";
import axios from "axios";
import "./Donations.css"; // 👈 apna CSS import kiya

export default function Donations({ isSidebarOpen }) {
  const [donors, setDonors] = useState([]);
  const [stores, setStores] = useState([]);
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({
    donorId: "",
    storeId: "",
    foodType: "",
    qtyKg: "",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const token = localStorage.getItem("token");

  const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL + "/";

  const fetchData = async () => {
    try {
      const donorsRes = await axios.get(`${baseURL}api/donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storesRes = await axios.get(`${baseURL}api/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const donationsRes = await axios.get(`${baseURL}api/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(donorsRes.data);
      setStores(storesRes.data);
      setDonations(donationsRes.data);
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
        `${baseURL}api/donations`,
        {
          donorId: form.donorId,
          storeId: form.storeId,
          items: [{ foodType: form.foodType, qtyKg: Number(form.qtyKg) }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({ type: "success", text: "Donation recorded ✅" });
      setForm({ donorId: "", storeId: "", foodType: "", qtyKg: "" });
      fetchData();
    } catch (err) {
      console.error("Error saving donation:", err.response?.data || err.message);
      setToast({ type: "error", text: "Error saving donation ❌" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter donations by donor or store name
  const filteredDonations = donations.filter(
    (d) =>
      d.donorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.storeId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`donations-page ${isSidebarOpen ? "shifted" : ""}`}>
      {/* ===== Header + Search ===== */}
      <div className="donation-header">
        <h1 className="page-title">🎁 Donations</h1>

        <input
          type="text"
          className="donation-search"
          placeholder="Search donations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {/* ===== Show only search results when searching ===== */}
      {search ? (
        <div className="card donation-table-card focus-mode">
          <h2>Search Results</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Store</th>
                  <th>Items</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((d) => (
                    <tr key={d._id}>
                      <td>{d.donorId?.name}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No donation found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* ===== Form Card ===== */}
          <div className="card donation-form-card">
            <h2>Record Donation</h2>
            <form onSubmit={handleSubmit} className="donation-form">
              <div>
                <label>Donor</label>
                <select
                  value={form.donorId}
                  onChange={(e) => setForm({ ...form, donorId: e.target.value })}
                  required
                >
                  <option value="">Select Donor</option>
                  {donors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
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
                  placeholder="Quantity (kg)"
                  value={form.qtyKg}
                  onChange={(e) =>
                    setForm({ ...form, qtyKg: e.target.value })
                  }
                  required
                />
              </div>

              <div className="full-width">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Saving..." : "➕ Add Donation"}
                </button>
              </div>
            </form>
          </div>

          {/* ===== Donations List Card ===== */}
          <div className="card donation-table-card">
            <h2>All Donations</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Store</th>
                    <th>Items</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d._id}>
                      <td>{d.donorId?.name}</td>
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
                  {!donations.length && (
                    <tr>
                      <td colSpan={4}>No donations recorded yet.</td>
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

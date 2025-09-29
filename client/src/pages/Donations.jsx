import { useState, useEffect } from "react";
import axios from "axios";

function Donations() {
  const [donors, setDonors] = useState([]);
  const [stores, setStores] = useState([]);
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ donorId: "", storeId: "", foodType: "", qtyKg: "" });

  const token = localStorage.getItem("token"); // 🔥

  const fetchData = async () => {
    try {
      const donorsRes = await axios.get("http://localhost:5000/api/donors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const storesRes = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const donationsRes = await axios.get("http://localhost:5000/api/donations", {
        headers: { Authorization: `Bearer ${token}` }
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
    try {
      await axios.post(
        "http://localhost:5000/api/donations",
        {
          donorId: form.donorId,
          storeId: form.storeId,
          items: [{ foodType: form.foodType, qtyKg: Number(form.qtyKg) }]
        },
        { headers: { Authorization: `Bearer ${token}` } } // 🔥
      );

      alert("Donation recorded ✅");
      setForm({ donorId: "", storeId: "", foodType: "", qtyKg: "" });
      fetchData();
    } catch (err) {
      console.error("Error saving donation:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1>Record Donation</h1>
      <form onSubmit={handleSubmit}>
        <select value={form.donorId} onChange={(e) => setForm({ ...form, donorId: e.target.value })} required>
          <option value="">Select Donor</option>
          {donors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })} required>
          <option value="">Select Store</option>
          {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input
          type="text"
          placeholder="Food Type"
          value={form.foodType}
          onChange={(e) => setForm({ ...form, foodType: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity (kg)"
          value={form.qtyKg}
          onChange={(e) => setForm({ ...form, qtyKg: e.target.value })}
          required
        />
        <button type="submit">Add Donation</button>
      </form>

      <h2>All Donations</h2>
      <ul>
        {donations.map(d => (
          <li key={d._id}>
            {d.donorId?.name} → {d.storeId?.name} | {d.items.map(i => `${i.foodType} (${i.qtyKg}kg)`).join(", ")} on{" "}
            {new Date(d.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Donations;

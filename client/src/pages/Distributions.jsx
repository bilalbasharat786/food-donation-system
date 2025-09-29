import { useState, useEffect } from "react";
import axios from "axios";

function Distributions() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stores, setStores] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [form, setForm] = useState({ beneficiaryId: "", storeId: "", foodType: "", qtyKg: "" });

  const token = localStorage.getItem("token"); // 🔥

  const fetchData = async () => {
    try {
      const beneficiariesRes = await axios.get("http://localhost:5000/api/beneficiaries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const storesRes = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const distributionsRes = await axios.get("http://localhost:5000/api/distributions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBeneficiaries(beneficiariesRes.data);
      setStores(storesRes.data);
      setDistributions(distributionsRes.data);
    } catch (err) {
      console.error("Error fetching distributions:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/distributions",
        {
          beneficiaryId: form.beneficiaryId,
          storeId: form.storeId,
          items: [{ foodType: form.foodType, qtyKg: Number(form.qtyKg) }]
        },
        { headers: { Authorization: `Bearer ${token}` } } // 🔥
      );

      alert("Distribution recorded ✅");
      setForm({ beneficiaryId: "", storeId: "", foodType: "", qtyKg: "" });
      fetchData();
    } catch (err) {
      console.error("Error saving distribution:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1>Record Distribution</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={form.beneficiaryId}
          onChange={(e) => setForm({ ...form, beneficiaryId: e.target.value })}
          required
        >
          <option value="">Select Beneficiary</option>
          {beneficiaries.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select
          value={form.storeId}
          onChange={(e) => setForm({ ...form, storeId: e.target.value })}
          required
        >
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
        <button type="submit">Add Distribution</button>
      </form>

      <h2>All Distributions</h2>
      <ul>
        {distributions.map(d => (
          <li key={d._id}>
            {d.beneficiaryId?.name} ← {d.storeId?.name} |{" "}
            {d.items.map(i => `${i.foodType} (${i.qtyKg}kg)`).join(", ")} on{" "}
            {new Date(d.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Distributions;


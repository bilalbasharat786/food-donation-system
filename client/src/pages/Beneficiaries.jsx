import { useState, useEffect } from "react";
import axios from "axios";

function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [form, setForm] = useState({
    type: "individual",
    name: "",
    contact: "",
    address: "",
    householdSize: "",
    notes: ""
  });

  // 🔥 localStorage se token nikalna
  const token = localStorage.getItem("token");

  // ---------------- Fetch Beneficiaries ----------------
  const fetchBeneficiaries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/beneficiaries", {
        headers: { Authorization: `Bearer ${token}` } // 👈 token bhejna
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
    try {
      await axios.post("http://localhost:5000/api/beneficiaries", form, {
        headers: { Authorization: `Bearer ${token}` } // 👈 token bhejna
      });

      setForm({ type: "individual", name: "", contact: "", address: "", householdSize: "", notes: "" });
      fetchBeneficiaries();
    } catch (err) {
      console.error("Error adding beneficiary:", err.response?.data || err.message);
    }
  };

  // ---------------- Delete Beneficiary ----------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/beneficiaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` } // 👈 token bhejna
      });
      fetchBeneficiaries();
    } catch (err) {
      console.error("Error deleting beneficiary:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1>Beneficiaries Management</h1>
      <form onSubmit={handleSubmit}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="individual">Individual</option>
          <option value="family">Family</option>
        </select>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {form.type === "family" && (
          <input
            type="number"
            placeholder="Household Size"
            value={form.householdSize}
            onChange={(e) => setForm({ ...form, householdSize: e.target.value })}
          />
        )}

        <input
          type="text"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button type="submit">Add Beneficiary</button>
      </form>

      <h2>All Beneficiaries</h2>
      <ul>
        {beneficiaries.map((b) => (
          <li key={b._id}>
            {b.name} ({b.type}) - {b.contact}
            <button onClick={() => handleDelete(b._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Beneficiaries;

import { useState, useEffect } from "react";
import axios from "axios";

function Stores() {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacityKg: "",
    supportedFoodTypes: ""
  });

  const token = localStorage.getItem("token"); // 🔥 token nikaala

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` } // 🔥 token bhejna
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
    const formattedForm = {
      ...form,
      capacityKg: Number(form.capacityKg),
      supportedFoodTypes: form.supportedFoodTypes.split(",").map((t) => t.trim())
    };

    try {
      await axios.post("http://localhost:5000/api/stores", formattedForm, {
        headers: { Authorization: `Bearer ${token}` } // 🔥 token bhejna
      });

      setForm({ name: "", location: "", capacityKg: "", supportedFoodTypes: "" });
      fetchStores();
    } catch (err) {
      console.error("Error adding store:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` } // 🔥 token bhejna
      });
      fetchStores();
    } catch (err) {
      console.error("Error deleting store:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1>Stores Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity (kg)"
          value={form.capacityKg}
          onChange={(e) => setForm({ ...form, capacityKg: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Supported Food Types (comma separated)"
          value={form.supportedFoodTypes}
          onChange={(e) => setForm({ ...form, supportedFoodTypes: e.target.value })}
          required
        />
        <button type="submit">Add Store</button>
      </form>

      <h2>All Stores</h2>
      <ul>
        {stores.map((s) => (
          <li key={s._id}>
            <b>{s.name}</b> ({s.location}) - Capacity: {s.capacityKg}kg
            <br />
            Supports: {s.supportedFoodTypes.join(", ")}
            <button onClick={() => handleDelete(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Stores;


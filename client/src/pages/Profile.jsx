import "./Profile.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ fix: handle trailing slash in base URL
        const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
          ? import.meta.env.VITE_API_BASE_URL
          : import.meta.env.VITE_API_BASE_URL + "/";

        const res = await axios.get(`${baseURL}api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load profile (unauthorized or invalid token)"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="profile-container font-style">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container font-style">
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <div className="profile-container font-style">
      <div className="glass-box">
        <div className="border-animation"></div>
        <div className="border-animation reverse"></div>

        <h1 className="profile-title">My Profile</h1>

        <div className="profile-details">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Contact:</strong> {user.contact || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}


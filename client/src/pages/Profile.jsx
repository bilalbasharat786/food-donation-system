import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile({ isSidebarOpen }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL + "/";

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseURL}api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.put(`${baseURL}api/profile/upload-photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser({ ...user, profilePic: res.data.profilePic });
      setMessage(res.data.message);
    } catch {
      setError("Failed to upload image");
    }
  };

  // ✅ Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${baseURL}api/profile/update`,
        { name, email, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setError("");
      setEditMode(false);
      setUser({ ...user, name, email });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Update failed");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className={`profile-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {/* ✅ Profile Picture */}
        <div className="profile-pic-section">
          <img
            src={preview || user.profilePic}
            alt="Profile"
            className="profile-pic"
          />
          <label className="upload-btn">
            Change Photo
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {!editMode ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Current Password:</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}




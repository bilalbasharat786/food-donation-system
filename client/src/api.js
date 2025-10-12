// ✅ api.js — one-time global axios setup

import axios from "axios";

// 🧠 Ensure trailing slash is always present
const baseURL = import.meta.env.VITE_API_BASE_URL.endsWith("/")
  ? import.meta.env.VITE_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL + "/";

console.log("🌐 Using API Base URL:", baseURL);

const api = axios.create({
  baseURL, // automatically attaches /api/... correctly
});

export default api;

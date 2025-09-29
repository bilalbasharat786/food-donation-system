import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Donors from "./pages/Donors.jsx";
import Beneficiaries from "./pages/Beneficiaries.jsx";
import Stores from "./pages/Stores.jsx";
import Donations from "./pages/Donations.jsx";
import Distributions from "./pages/Distributions.jsx";
import Reports from "./pages/Reports.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";

// New auth pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
      <Routes>
        
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>} />
        <Route path="/donors" element={<ProtectedRoute><Layout><Donors/></Layout></ProtectedRoute>} />
        <Route path="/beneficiaries" element={<ProtectedRoute><Layout><Beneficiaries/></Layout></ProtectedRoute>} />
        <Route path="/stores" element={<ProtectedRoute><Layout><Stores/></Layout></ProtectedRoute>} />
        <Route path="/donations" element={<ProtectedRoute><Layout><Donations/></Layout></ProtectedRoute>} />
        <Route path="/distributions" element={<ProtectedRoute><Layout><Distributions/></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Layout><Reports/></Layout></ProtectedRoute>} />
      </Routes>
  );
}

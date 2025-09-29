import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/donors")}>Donors</button>
      <button onClick={() => navigate("/beneficiaries")}>Beneficiaries</button>
      <button onClick={() => navigate("/stores")}>Stores</button>
      <button onClick={() => navigate("/donations")}>Donations</button>
      <button onClick={() => navigate("/distributions")}>Distributions</button>
      <button onClick={() => navigate("/reports")}>Reports</button>
      <button onClick={handleLogout}>🚪 Logout</button>
    </nav>
  );
}

export default Navbar;

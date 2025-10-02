import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaStore, FaDonate, FaChartBar, FaHandHoldingHeart, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar({ handleLogout, onToggle }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
    onToggle(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onToggle(false);
  };

  return (
    <div
      className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul>
        <li>
          <button onClick={() => navigate("/dashboard")}>
            <FaTachometerAlt className="icon" />
            <span className="text">Dashboard</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/donors")}>
            <FaUsers className="icon" />
            <span className="text">Donors</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/beneficiaries")}>
            <FaHandHoldingHeart className="icon" />
            <span className="text">Beneficiaries</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/stores")}>
            <FaStore className="icon" />
            <span className="text">Stores</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/donations")}>
            <FaDonate className="icon" />
            <span className="text">Donations</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/distributions")}>
            <FaUsers className="icon" />
            <span className="text">Distributions</span>
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/reports")}>
            <FaChartBar className="icon" />
            <span className="text">Reports</span>
          </button>
        </li>
        <li>
          <button onClick={() =>  navigate("/login") }>
            <FaSignOutAlt className="icon" />
            <span className="text">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}



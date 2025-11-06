import React from "react";
import { useNavigate } from "react-router-dom";
import "./AppHome.css"; // optional, for header styling

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-wrapper">
        <div className="logo-circle">LFP</div>
        <span className="logo-text">LIFE FITNESS PARTNER</span>
        <span className="logo-arrow">»</span>
        <span
                    className="logo-sub-text-button"
                    onClick={() => navigate('/dashboard-admin')}
                  >
                    Admin Panel
                  </span>
      </div>

      <div className="header-right">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>
    </header>
  );
};

export default Header;

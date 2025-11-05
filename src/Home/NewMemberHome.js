import React from "react";
import { useNavigate } from "react-router-dom";
import "./AppHome.css";
import "../Admin/Admin.css";

export default function NewMemberHome() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span className="logo-sub-text-button" onClick={() => navigate("/dashboard-admin")}>
            Admin Panel
          </span>
        </div>
      </header>

      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to Pulse Fitness</h1>
        <p className="welcome-subtext">New Member Registration Portal</p>

        <div className="button-container">
          <button className="big-btn" onClick={() => navigate("/registration")}>
            📝 Register New Member
          </button>

          <button className="big-btn blue" onClick={() => navigate("/members-list")}>
            👥 View Pending Registrations
          </button>
        </div>
      </div>
    </div>
  );
}

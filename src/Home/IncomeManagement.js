import React from "react";
import { useNavigate } from "react-router-dom";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";

export default function NewMemberHome() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

          <Header />

      <div className="welcome-container">
        <h1 className="welcome-title">FINANCE REPORT ANALYZE</h1>


        <div className="button-container">
          <button className="big-btn" onClick={() => navigate("/income-management")}>
            📝 Revenue Report
          </button>

          <button className="big-btn blue" onClick={() => navigate("/members-list")}>
            📝 Expenditure Report
          </button>

         <button className="big-btn blue" onClick={() => navigate("/pending-payment")}>
            📝 Pending Payment Report
         </button>
        </div>
      </div>
    </div>
  );
}

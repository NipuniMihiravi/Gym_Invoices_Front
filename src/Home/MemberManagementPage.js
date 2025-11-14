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
        <h1 className="welcome-title">MEMBER DETAILS & ATTENDENCE MANAGEMENT</h1>


        <div className="button-container">
          <button className="big-btn" onClick={() => navigate("/member-management")}>
            📝 Registered Member
          </button>

          <button className="big-btn blue" onClick={() => navigate("/attendance-management")}>
                                📝 Member Attendance
                              </button>



          <button className="big-btn blue" onClick={() => navigate("/membership-management")}>
                      📝 Membership Type
                    </button>


        </div>
      </div>
    </div>
  );
}

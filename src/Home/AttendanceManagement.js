import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AppHome.css";
import "../Admin/Admin.css";

function AttendanceReport() {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchAttendance = async () => {
    if (!memberId || !startDate || !endDate) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const res = await axios.get(
        `https://gym-invoice-back.onrender.com/api/attendance/member/${memberId}/range`,
        { params: { startDate, endDate } }
      );

      setAttendanceData(res.data);
      setCount(res.data.length);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("❌ Failed to fetch attendance records");
    }
  };

  useEffect(() => {
          const role = sessionStorage.getItem("userRole");
          if (!role) {
            navigate("/"); // redirect to login if no session
          }
        }, [navigate]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span
            className="logo-sub-text-button"
            onClick={() => navigate("/dashboard-admin")}
          >
            Admin Panel
          </span>
        </div>
      </header>

      {/* Container */}
      <div className="payment-wrapper">
        <div className="payment-container">
          <h2>Member Attendance Report</h2>

          {/* Search Box */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter Member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={fetchAttendance}>View Attendance</button>
          </div>

          {/* Attendance Table */}
          {attendanceData.length > 0 && (
            <div className="payment-table">
              <h3>Total Attendance: {count}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;

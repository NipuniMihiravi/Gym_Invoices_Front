import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import { useNavigate } from 'react-router-dom';

function AttendanceScanner() {
  const [scannedId, setScannedId] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", "already"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Check session when component loads
  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) {
      navigate("/"); // redirect to login if no session
    }
  }, [navigate]);

  // ✅ Function to mark attendance
  const markAttendance = async () => {
    const value = scannedId.trim();
    if (!value) return;

    try {
      const res = await axios.post(
        "https://gym-invoice-back.onrender.com/api/attendance/mark",
        { memberId: value }
      );

      setStatus("success");
      setMessage("Attendance marked successfully!");
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 409) {
        setStatus("already");
        setMessage("You have already marked attendance today.");
      } else {
        setStatus("error");
        setMessage("Failed to mark attendance.");
      }
    }

    // Reset input for next scan
    setScannedId("");
  };

  return (
    <div className="dashboard">

      <Header/>

      <div className="payment-wrapper">
        <div className="payment-container">

            <h2>Mark Member Attendance</h2>

          <div className="search-box">
            <input
              type="text"
              value={scannedId}
              autoFocus
              onChange={(e) => setScannedId(e.target.value)}
              placeholder="Scan or type Member ID here"

            />
            <button onClick={markAttendance}>MARK ATTENDANCE</button>

           </div>



            <div style={{ marginTop: "20px" }}>
              {status === "success" && (
                <div style={{ color: "green" }}>
                  <img
                    src="/images/success.png"
                    alt="Success"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  {message}
                </div>
              )}

              {status === "already" && (
                <div style={{ color: "orange" }}>
                  <img
                    src="/images/warning.png"
                    alt="Warning"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  {message}
                </div>
              )}

              {status === "error" && (
                <div style={{ color: "red" }}>
                  <img
                    src="/images/error.png"
                    alt="Error"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  {message}
                </div>
              )}
            </div>

        </div>
      </div>
    </div>
  );
}

export default AttendanceScanner;

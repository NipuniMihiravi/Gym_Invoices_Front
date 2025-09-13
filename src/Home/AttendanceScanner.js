import React, { useState } from "react";
import axios from "axios";
import "./AppHome.css";

function AttendanceScanner() {
  const [scannedId, setScannedId] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", "already"
  const [message, setMessage] = useState("");

  const handleScan = async (e) => {
    const value = e.target.value.trim();
    setScannedId(value);

    if (value.length > 0) {
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
      e.target.value = "";
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan Your QR Code to Mark Attendance</h2>

      <input
        type="text"
        autoFocus
        onChange={handleScan}
        placeholder="Scan or type Member ID here"
        style={{ padding: "10px", fontSize: "18px", width: "300px" }}
      />

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
  );
}

export default AttendanceScanner;

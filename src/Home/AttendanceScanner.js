
import React, { useState } from "react";
import axios from "axios";
import "./AppHome.css";

function AttendanceScanner() {
  const [scannedId, setScannedId] = useState("");
  const [message, setMessage] = useState("");

  // Called when scanner fills the input
  const handleScan = async (e) => {
    const value = e.target.value.trim();
    setScannedId(value);

    if (value.length > 0) {
      try {
        const res = await axios.post("https://gym-invoice-back.onrender.com/api/attendance/mark", {
          memberId: value
        });

        setMessage(`✅ ${res.data}`);
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to mark attendance");
      }

      // Reset input so next scan works immediately
      setScannedId("");
      e.target.value = "";
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan Your QR Code to Mark Attendance</h2>
      /*<input
        type="text"
        autoFocus
        onChange={handleScan}
        style={{ opacity: 0, position: "absolute" }}
      />*/

  <input
    type="text"
    autoFocus
    onChange={handleScan}
    placeholder="Scan or type Member ID here"
    style={{ padding: "10px", fontSize: "18px", width: "300px" }}
  />

      <h3>{message}</h3>
    </div>
  );
}

export default AttendanceScanner;

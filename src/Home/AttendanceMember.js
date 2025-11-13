import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import { useNavigate } from 'react-router-dom';
import DialogBox from "../Home/DialogBox";

function AttendanceScanner() {
  const [scannedId, setScannedId] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", "already"
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
    type: "confirm",
    onConfirm: null,
  });

  const [memberName, setMemberName] = useState("");
  const navigate = useNavigate();


  // Step 1: Fetch member and show confirm dialog
  const handleAddClick = async () => {
    const memberId = scannedId.trim();
    if (!memberId) return;

    try {
      const res = await axios.get(`https://gym-invoice-back.onrender.com/api/members/by-member-id/${memberId}`);
      if (res.data && res.data.name) {
        setMemberName(res.data.name);

        // Show dialog
        setDialog({
          show: true,
          type: "confirm",
          message: `${res.data.name}, do you want to mark your attendance?`,
          onConfirm: confirmAttendance,
        });
      } else {
        setStatus("error");
        setMessage("Member not found.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Failed to fetch member info.");
    }
  };

  // Step 2: Confirm attendance
  const confirmAttendance = async () => {
    try {
      await axios.post("https://gym-invoice-back.onrender.com/api/attendance/mark", { memberId: scannedId.trim() });
      setStatus("success");
      setMessage(`Attendance marked successfully for ${memberName}!`);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        setStatus("already");
        setMessage("Attendance already marked today.");
      } else {
        setStatus("error");
        setMessage("Failed to mark attendance.");
      }
    }
    setScannedId("");
    setMemberName("");
  };

  return (
    <div className="dashboard">
<HeaderMember/>

      <div className="payment-wrapper">
        <div className="payment-container">
          <h2>⏰ Mark Member Attendance</h2>

          <div className="search-box">
            <input
              type="text"
              value={scannedId}
              autoFocus
              onChange={(e) => setScannedId(e.target.value)}
              placeholder="Scan or type Member ID here"
            />
            <button onClick={handleAddClick}>ADD</button>
          </div>

          {/* Status Messages */}
          <div style={{ marginTop: "20px" }}>
            {status === "success" && <div style={{ color: "green" }}>{message}</div>}
            {status === "already" && <div style={{ color: "orange" }}>{message}</div>}
            {status === "error" && <div style={{ color: "red" }}>{message}</div>}
          </div>
        </div>
      </div>

      {/* Reusable Dialog */}
      <DialogBox dialog={dialog} setDialog={setDialog} />
    </div>
  );
}

export default AttendanceScanner;

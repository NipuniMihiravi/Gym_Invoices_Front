import { Link, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect } from "react";
import '../Admin/Admin.css';
import Header from "../Home/Header";

function QRPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) {
      navigate("/"); // redirect to login if no session
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <Header />

      <h2>Scan to Register</h2>
      <QRCodeCanvas
        value="https://gym-invoice-front.onrender.com/#/registration-member"
        size={256}
      />

       <h2>Scan to Mark Attendance</h2>
      <QRCodeCanvas
        value="https://gym-invoice-front.onrender.com/#/mark-attendance"
        size={256}
      />
    </div>
  );
}

export default QRPage;


import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../Home/Header";

const QRDisplay = () => {
  const links = [
    {
      label: "Register Member",
      url: "https://gym-invoices-front.onrender.com/registration-member",
    },
    {
      label: "Mark Attendance",
      url: "https://gym-invoices-front.onrender.com/mark-attendance",
    },
  ];

  return (

  <div className="dashboard">
        <Header/>
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan QR Code</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "50px", marginTop: "30px" }}>
        {links.map((link, index) => (
          <div key={index}>
            <QRCodeCanvas value={link.url} size={200} />
            <p style={{ marginTop: "10px", fontWeight: "bold", color: "white" }}>{link.label}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default QRDisplay;


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

    <div className="qr-container">
      <h2>Scan QR Code</h2>

      <div className="qr-list">
        {links.map((link, index) => (
          <div key={index} className="qr-item">
            <QRCodeCanvas value={link.url} size={200} />
            <p>{link.label}</p>
          </div>
        ))}
      </div>

    </div>
  </div>

  );
};

export default QRDisplay;

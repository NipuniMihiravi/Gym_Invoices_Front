import React from "react";
import { QRCodeCanvas } from "qrcode.react";

function QRPage() {
  return (
    <div>
      <h2>Scan to Register</h2>
      <QRCodeCanvas value="https://gym-invoice-front.onrender.com/service/registration_member" size={256} />
    </div>
  );
}

export default QRPage;

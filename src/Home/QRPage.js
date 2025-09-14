import { Link, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useState } from "react";



function QRPage() {

const navigate = useNavigate();

 useEffect(() => {
      const role = sessionStorage.getItem("userRole");
      if (!role) {
        navigate("/"); // redirect to login if no session
      }
    }, [navigate]);

  return (
    <div>
      <h2>Scan to Register</h2>
      <QRCodeCanvas value="https://gym-invoice-front.onrender.com/service/registration_member" size={256} />
    </div>
  );
}

export default QRPage;

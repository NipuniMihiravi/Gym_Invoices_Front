import React, { useState,useEffect } from "react";
import '../Admin/Admin.css';
import { Link, useNavigate } from 'react-router-dom';

const SystemManagement = () => {
  const navigate = useNavigate();

   useEffect(() => {
        const role = sessionStorage.getItem("userRole");
        if (!role) {
          navigate("/"); // redirect to login if no session
        }
      }, [navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  const services = [

    { title: "Finance Report", icon: "📈"},
    { title: "Member Management", icon: "📈"},
    { title: "Attendance-Management", icon: "🔳" },
    { title: "Membership Management", icon: "📋"},
    { title: "Expenditure Management", icon: "📋"},
    { title: "QR-Code", icon: "🔳" },

  ];

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span
                        className="logo-sub-text-button"
                        onClick={() => navigate('/dashboard-admin')}
                      >
                        Admin Panel
                      </span>
        </div>

        <div className="header-right">

        </div>
      </header>

      <section className="services">
        <h3>SYSTEM MANAGEMENT</h3>
        <div className="service-grid">
          {services.map((service, index) => (
            <Link
              key={index}
              to={`/service/${encodeURIComponent(service.title.toLowerCase().replace(/ /g, "-"))}`}
              className="service-card-link"
            >
              <div
                className="service-card"
                style={{ backgroundColor: service.color }}
              >
                <div className="icon">{service.icon}</div>
                <h4>{service.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SystemManagement;

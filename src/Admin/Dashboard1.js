import React, { useEffect, useState } from 'react';
import './Admin.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMembers, setActiveMembers] = useState(0);

  const handleLogout = () => {
    navigate('/');
  };

  const services = [
    { title: "New Admission", icon: "📝" },
    { title: "Registered Members", icon: "👥" },
    { title: "Payment", icon: "💳"},
    { title: "Attendance", icon: "⏰" },
    { title: "Reports", icon: "📋"},
    { title: "Settings", icon: "⚙️"},
  ];

  // Fetch from backend
  useEffect(() => {
    fetch("https://gym-invoice.onrender.com/api/members/active/count")
      .then((res) => res.json())
      .then((data) => setActiveMembers(data))
      .catch((err) => console.error("Error fetching active members:", err));
  }, []);

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">LFP</div>
          <span className="logo-text">LIFE FITNESS PARTNER</span>


        </div>

        <div className="header-right">

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="services">
        <h3>ADMIN DASHBOARD</h3>
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

export default Dashboard;

import React, { useState } from 'react';
import './Admin.css';

const Profile = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const paymentData = {
    January: [
      { month: "January", amount: "120.00", date: "2025-01-10" },
      { month: "January", amount: "80.00", date: "2025-01-24" },
    ],
    February: [
      { month: "February", amount: "150.00", date: "2025-02-14" },
    ],
    // Add more data as needed
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <img src="/images/avatar.png" alt="Avatar" />
          <div>
            <h2>Clay Jensen</h2>
            <p>📍 Northridge, California(CA), 91326, USA</p>
            <p>Age: 24 | Gender: Male | Status: <span className="active-status">Active*</span></p>
          </div>
        </div>
        <button className="edit-button">Edit Profile</button>
      </div>

      <div className="info-section">
        <div><span className="info-label">Role:</span> <span className="info-value">Administrator</span></div>
        <div><span className="info-label">Email:</span> <span className="info-value">clay.jensen@email.com</span></div>
        <div><span className="info-label">Contact:</span> <span className="info-value">(+61) (45687) (45687)</span></div>
        <div><span className="info-label">Region:</span> <span className="info-value">Central US</span></div>
      </div>

      <h3 className="year-title">Year: 2025</h3>
      <div className="month-grid">
        {months.map((month, index) => (
          <div
            key={index}
            className={`month-box ${selectedMonth === month ? 'active' : ''}`}
            onClick={() => handleMonthClick(month)}
          >
            {month}
          </div>
        ))}
      </div>

      {selectedMonth && (
        <>
          <h4 className="payment-title">Payment Details for {selectedMonth}</h4>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(paymentData[selectedMonth] || []).map((payment, idx) => (
                <tr key={idx}>
                  <td>{payment.month}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Profile;

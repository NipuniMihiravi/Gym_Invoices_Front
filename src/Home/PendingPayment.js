import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

function DueMembers() {
  const [dueMembers, setDueMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("due"); // due | attendance

  const [filters, setFilters] = useState({
    dueDate: "",
    memberId: "",
    phone: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, [viewMode]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const apiURL =
        viewMode === "due"
          ? "https://gym-invoice-back.onrender.com/api/members/due-members"
          : "https://gym-invoice-back.onrender.com/api/members/due-attendance";

      const res = await axios.get(apiURL);
      setDueMembers(res.data);
      setFilteredMembers(res.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  const handleFilter = () => {
    let results = [...dueMembers];
    const { dueDate, memberId, phone } = filters;

    if (dueDate) {
      results = results.filter(m => formatDate(m.nextDueDate) === formatDate(dueDate));
    }
    if (memberId) {
      results = results.filter(m => m.memberId.toLowerCase().includes(memberId.toLowerCase()));
    }
    if (phone) {
      results = results.filter(m => (m.phone || "").includes(phone));
    }

    setFilteredMembers(results);
  };

  const clearFilters = () => {
    setFilters({ dueDate: "", memberId: "", phone: "" });
    setFilteredMembers(dueMembers);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span className="logo-sub-text-button"
            onClick={() => navigate('/dashboard-admin')}>
            Admin Panel
          </span>
        </div>
      </header>

      <div className="payment-container">
        <h2>
          {viewMode === "due" ? "Members With Pending Payment" : "Members Attending After Due Date"}
        </h2>

        {/* Toggle buttons */}
        <div style={{ marginBottom: "10px" }}>
          <button onClick={() => setViewMode("due")}
            style={{ background: viewMode === "due" ? "#007bff" : "#aaa", color: "#fff", marginRight: 8 }}>
            Pending Payments
          </button>

          <button onClick={() => setViewMode("attendance")}
            style={{ background: viewMode === "attendance" ? "#007bff" : "#aaa", color: "#fff" }}>
            Attendance After Due Date
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="date"
            value={filters.dueDate}
            onChange={e => setFilters({ ...filters, dueDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Member ID"
            value={filters.memberId}
            onChange={e => setFilters({ ...filters, memberId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={filters.phone}
            onChange={e => setFilters({ ...filters, phone: e.target.value })}
          />

          <button onClick={handleFilter}>Filter</button>
          <button onClick={clearFilters} style={{ background: "gray", color: "white" }}>Clear</button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredMembers.length === 0 ? (
          <p style={{ color: "green" }}>✅ No records found</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Membership Type</th>
                <th>Last Payment</th>
                <th>Due Date</th>
                {viewMode === "attendance" && <th>Late Attendance Days</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, i) => (
                <tr key={i}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{m.phone}</td>
                  <td>{formatDate(m.joinedDate)}</td>
                  <td>{m.membershipType}</td>
                  <td>{formatDate(m.lastPaymentDate)}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>{formatDate(m.nextDueDate)}</td>

                  {viewMode === "attendance" && (
                    <td style={{ color: "orange", fontWeight: "bold" }}>{m.lateDays || 0}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default DueMembers;

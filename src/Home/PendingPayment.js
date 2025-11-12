import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Admin/Admin.css';
import Header from "../Home/Header";

function DueMembers() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dueDate: "",
    memberId: "",
    phone: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Always fetch attendance-after-due members
      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/members/due-attendance"
      );
      setMembers(res.data);
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
    let results = [...members];
    const { dueDate, memberId, phone } = filters;

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      results = results.filter(
        (m) => new Date(m.nextDueDate) <= selectedDate
      );
    }
    if (memberId) {
      results = results.filter((m) =>
        m.memberId.toLowerCase().includes(memberId.toLowerCase())
      );
    }
    if (phone) {
      results = results.filter((m) =>
        (m.phone || "").includes(phone)
      );
    }

    setFilteredMembers(results);
  };

  const clearFilters = () => {
    setFilters({ dueDate: "", memberId: "", phone: "" });
    setFilteredMembers(members);
  };

  return (
    <div className="dashboard">
      {/* Header */}

            <Header />

      <div className="payment-container">
        <h2>📋 Due Payments & Due Date</h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="date"
            value={filters.dueDate}
            onChange={(e) =>
              setFilters({ ...filters, dueDate: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Member ID"
            value={filters.memberId}
            onChange={(e) =>
              setFilters({ ...filters, memberId: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone"
            value={filters.phone}
            onChange={(e) =>
              setFilters({ ...filters, phone: e.target.value })
            }
          />

          <div className="filter-buttons">
            <button className="btn btn-primary" onClick={handleFilter}>
              Filter
            </button>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear
            </button>
          </div>

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
                <th>Last Payment Date</th>
                <th>Due Date</th>
                <th>Late Attendance Days</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, i) => (
                <tr key={i}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{m.mobile}</td>
                  <td>{formatDate(m.joinedDate)}</td> {/* ✅ Apply formatDate */}
                  <td>{m.membershipType}</td>
                  <td>{formatDate(m.lastPaymentDate)}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {formatDate(m.nextDueDate)}
                  </td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {m.attendanceAfterDueCount || 0}
                  </td>
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

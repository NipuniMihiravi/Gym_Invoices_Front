import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Admin/Admin.css';
import Header from "../Home/Header";

function AttendanceTable() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    memberId: "",
    startDate: "",
    endDate: ""
  });

  // Fetch attendance from backend
  const fetchAttendance = async () => {
    setLoading(true);

    try {
      const params = {
        memberId: filters.memberId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };

      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/attendance",
        { params }
      );

      setAttendance(res.data); // display all records
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleSearch = () => {
    fetchAttendance(); // refetch filtered data
  };

  return (
    <div className="container">
      <Header />
      <div className="payment-container">
        <h2>Attendance Report</h2>

        {/* Filters */}
        <div className="filter-box">
          <input
            placeholder="Member ID"
            value={filters.memberId}
            onChange={(e) =>
              setFilters({ ...filters, memberId: e.target.value })
            }
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.memberId}</td>
                    <td>{record.date}</td>
                    <td>{record.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceTable;

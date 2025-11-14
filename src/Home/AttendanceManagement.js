import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import DialogBox from "../Home/DialogBox";
import { MdDelete } from 'react-icons/md';

function AttendanceTable() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    memberId: "",
    memberName: "",
    email: "",
    startDate: "",
    endDate: ""
  });

  const [dialog, setDialog] = useState({
    show: false,
    title: "Confirm Delete",
    message: "",
    type: "confirm",
    onConfirm: null,
  });

  // Replace this in your render part, before the return JSX
  const filteredAttendance = attendance.filter((a) => {
    const idMatch = (a.memberId || "").toLowerCase().includes(filters.memberId.toLowerCase());
    const nameMatch = (a.memberName || "").toLowerCase().includes(filters.memberName.toLowerCase());
    const emailMatch = (a.email || "").toLowerCase().includes(filters.email.toLowerCase());

    // Optional: filter by membershipType if available
    const typeMatch = filters.membershipType
      ? (a.membershipType || "").toLowerCase() === filters.membershipType.toLowerCase()
      : true;

    // Filter by date range
    const startDateMatch = filters.startDate ? new Date(a.date) >= new Date(filters.startDate) : true;
    const endDateMatch = filters.endDate ? new Date(a.date) <= new Date(filters.endDate) : true;

    return idMatch && nameMatch && emailMatch && typeMatch && startDateMatch && endDateMatch;
  });


  // Fetch attendance with current filters
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        memberId: filters.memberId || undefined,
        memberName: filters.memberName || undefined,
        email: filters.email || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };

      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/attendance",
        { params }
      );
      setAttendance(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch whenever filters change
  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const handleDelete = (id) => {
    setDialog({
      show: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this attendance record?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await axios.delete(`https://gym-invoice-back.onrender.com/api/attendance/delete/${id}`);
          alert("Attendance deleted successfully!");
          fetchAttendance();
        } catch (error) {
          console.error("Failed to delete attendance:", error);
          alert("Failed to delete attendance record.");
        }
      }
    });
  };

  return (
    <div className="container">
      <Header />
      <div className="payment-container">
        <h2>Attendance Report</h2>

        {/* Structured Search Section */}
        <div className="payment-card">
          <h2>🔍 Search Filters</h2>

          <div className="filter-row">
            <div className="filter-item">
              <label>Member ID</label>
              <input
                placeholder="Member ID"
                value={filters.memberId}
                onChange={(e) => setFilters({ ...filters, memberId: e.target.value })}
              />
            </div>

            <div className="filter-item">
              <label>Member Name</label>
              <input
                placeholder="Name"
                value={filters.memberName}
                onChange={(e) => setFilters({ ...filters, memberName: e.target.value })}
              />
            </div>


          </div>

          <div className="filter-row">
            <div className="filter-item">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div className="filter-item">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
             {filteredAttendance.length > 0 ? (
               filteredAttendance.map((record) => (
                 <tr key={record.id}>
                   <td>{record.memberId}</td>
                   <td>{record.memberName}</td>
                   <td>{record.date}</td>
                   <td>{record.time}</td>
                   <td>
                     <div className="table-action-buttons">
                       <button
                         onClick={() => handleDelete(record.id)}
                         className="action-btn delete-btn"
                       >
                         <MdDelete size={20} /> Delete
                       </button>
                     </div>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan="7">No records found.</td>
               </tr>
             )}

            </tbody>
          </table>
        )}
      </div>

      <DialogBox dialog={dialog} setDialog={setDialog} />
    </div>
  );
}

export default AttendanceTable;

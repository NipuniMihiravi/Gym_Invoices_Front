import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import Header from "../Home/Header";
import { MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function ExpenditurePage() {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    date: "",
    description: "",
  });
  const [expenditures, setExpenditures] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    name: "",
  });

  const expenditureOptions = [
    "Electricity Bill",
    "Water Bill",
    "Equipment Repair",
    "Salaries",
    "Maintenance",
    "Rent",
    "Cleaning Supplies",
    "Others",
  ];

  // ✅ Load expenditures from backend once
  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    try {
      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/expenditures"
      );
      setExpenditures(res.data);
    } catch (error) {
      console.error("Failed to fetch expenditures", error);
    }
  };

  // ✅ Handle input change for form
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle input change for filters
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // ✅ Client-side filtering (like PaymentAnalytics)
  const filteredExpenditures = expenditures.filter((exp) => {
    const expDate = new Date(exp.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    if (fromDate && expDate < fromDate) return false;
    if (toDate && expDate > toDate) return false;
    if (
      filters.name &&
      !exp.name.toLowerCase().includes(filters.name.toLowerCase())
    )
      return false;

    return true;
  });

  // ✅ Clear filters
  const clearFilter = () => {
    setFilters({ fromDate: "", toDate: "", name: "" });
  };

  // ✅ Edit record
  const handleEditClick = (exp) => {
    setFormData({
      name: exp.name,
      cost: exp.cost,
      date: exp.date,
      description: exp.description,
    });
    setEditId(exp.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Add or update record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://gym-invoice-back.onrender.com/api/expenditures/${editId}`,
          formData
        );
      } else {
        await axios.post(
          "https://gym-invoice-back.onrender.com/api/expenditures",
          formData
        );
      }
      setFormData({ name: "", cost: "", date: "", description: "" });
      setEditId(null);
      fetchExpenditures();
    } catch (error) {
      console.error("Error saving expenditure", error);
    }
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expenditure?")) {
      await axios.delete(
        `https://gym-invoice-back.onrender.com/api/expenditures/${id}`
      );
      fetchExpenditures();
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="payment-container">
        <h2>💰 Expenditure Management</h2>

        {/* ---------- Form ---------- */}
        <form className="expenditure-form" onSubmit={handleSubmit}>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          >
            <option value="">Select Expenditure</option>
            {expenditureOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cost"
            placeholder="Cost (Rs)"
            value={formData.cost}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <button type="submit" className="btn-add">
            {editId ? "💾 Update" : "➕ Add"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn-clear"
              onClick={() => {
                setEditId(null);
                setFormData({
                  name: "",
                  cost: "",
                  date: "",
                  description: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* ---------- Filters ---------- */}
        <div className="filter-section">
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Expenditure Name"
            value={filters.name}
            onChange={handleFilterChange}
          />

          <button onClick={clearFilter} className="btn-clear">
            Clear
          </button>
        </div>

        {/* ---------- Table ---------- */}
        <table className="payment-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Expenditure Name</th>
              <th>Cost (Rs)</th>
              <th>Date</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenditures.length > 0 ? (
              filteredExpenditures
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
                .map((e, i) => (
                  <tr key={e.id}>
                    <td>{i + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.cost}</td>
                    <td>{e.date}</td>
                    <td>{e.description}</td>
                    <td>
                      <div className="table-action-buttons">
                        <button
                          onClick={() => handleEditClick(e)}
                          className="action-btn edit-btn"
                        >
                          <MdEdit size={20} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
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
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenditurePage;

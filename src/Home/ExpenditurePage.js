import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./AppHome.css";

function ExpenditurePage() {
const navigate = useNavigate()
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

  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    const res = await axios.get("https://gym-invoice-back.onrender.com/api/expenditures");
    setExpenditures(res.data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://gym-invoice-back.onrender.com/api/expenditures", formData);
    setFormData({ name: "", cost: "", date: "", description: "" });
    fetchExpenditures();
  };

  const handleFilter = async () => {
    const { fromDate, toDate, name } = filters;
    const res = await axios.get(
      `https://gym-invoice-back.onrender.com/api/expenditures/filter`,
      { params: { fromDate, toDate, name } }
    );
    setExpenditures(res.data);
  };

  const clearFilter = () => {
    setFilters({ fromDate: "", toDate: "", name: "" });
    fetchExpenditures();
  };

  return (
   <div className="dashboard">
        <header className="header">
          <div className="logo-wrapper">
            <div className="logo-circle">LTF</div>
                          <span className="logo-text">LIFE TIME FITNESS</span>
            <span className="logo-arrow">»</span>

          </div>
          <div className="header-right">
              {/* Back Button */}
              <button className="back-btn" onClick={() => navigate(-1)}>
                ⬅ Back
              </button>
            </div>
        </header>
    <div className="payment-container">
      <h2>💰 Expenditure Management</h2>

      {/* ---------- Form ---------- */}
      <form className="expenditure-form" onSubmit={handleSubmit}>
        <select name="name" value={formData.name} onChange={handleChange} required>
          <option value="">Select Expenditure</option>
          {expenditureOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
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

        <button type="submit" className="btn-add">➕ Add</button>
      </form>

      {/* ---------- Filters ---------- */}
      <div className="filter-section">
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />
        <input
          type="text"
          name="name"
          placeholder="Expenditure Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <button onClick={handleFilter} className="btn-filter">Filter</button>
        <button onClick={clearFilter} className="btn-clear">Clear</button>
      </div>

      {/* ---------- Table ---------- */}
      <table className="payment-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Expenditure Name</th>
            <th>Cost (Rs)</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenditures.length > 0 ? (
            expenditures.map((e, i) => (
              <tr key={e.id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.cost}</td>
                <td>{e.date}</td>
                <td>{e.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default ExpenditurePage;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

function ExpenditurePage() {
const navigate = useNavigate()
const [editId, setEditId] = useState(null); // track which record is being edited
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

// handle form input changes
const handleChange = (e) =>
  setFormData({ ...formData, [e.target.name]: e.target.value });

// when clicking Edit button
const handleEditClick = (exp) => {
  setFormData({
    name: exp.name,
    cost: exp.cost,
    date: exp.date,
    description: exp.description,
  });
  setEditId(exp.id); // mark editing
  window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
};

// handle form submit (both add & update)
const handleSubmit = async (e) => {
  e.preventDefault();

  if (editId) {
    // ✅ Update existing expenditure
    await axios.put(
      `https://gym-invoice-back.onrender.com/api/expenditures/${editId}`,
      formData
    );
  } else {
    // ✅ Create new expenditure
    await axios.post("https://gym-invoice-back.onrender.com/api/expenditures", formData);
  }

  setFormData({ name: "", cost: "", date: "", description: "" });
  setEditId(null);
  fetchExpenditures();
};

// delete record
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this expenditure?")) {
    await axios.delete(`https://gym-invoice-back.onrender.com/api/expenditures/${id}`);
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

       {/* ✅ Button changes automatically */}
                <button type="submit" className="btn-add">
                  {editId ? "💾 Update" : "➕ Add"}
                </button>

                {/* ✅ Show cancel button only in edit mode */}
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
            <th>No</th>
            <th>Expenditure Name</th>
            <th>Cost (Rs)</th>
            <th>Date</th>
            <th>Description</th>
            <th>Action</th>
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
                <td>
                          <div className="table-action-buttons">
                            <button onClick={() => handleEditClick(e)} className="action-btn edit-btn">
                              <MdEdit size={20} /> Edit
                            </button>
                            <button onClick={() => handleDelete(e.id)} className="action-btn delete-btn">
                              <MdDelete size={20} /> Delete
                            </button>
                          </div>
                        </td>
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

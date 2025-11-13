import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import Header from "../Home/Header";
import { MdEdit, MdDelete } from "react-icons/md";
import DialogBox from "../Home/DialogBox";

function ExpenditurePage() {
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
  const [dialog, setDialog] = useState({
    show: false,
    type: "confirm",
    title: "",
    message: "",
    onConfirm: null,
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

  // Fetch expenditures from backend
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

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // Client-side filtering
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

  const clearFilter = () => setFilters({ fromDate: "", toDate: "", name: "" });

  // Edit expenditure with confirmation
  const handleEditClick = (exp) => {
    setDialog({
      show: true,
      type: "confirm",
      title: "Edit Expenditure",
      message: `Do you want to edit "${exp.name}"?`,
      onConfirm: () => {
        setFormData({
          name: exp.name,
          cost: exp.cost,
          date: exp.date,
          description: exp.description,
        });
        setEditId(exp.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  // Delete expenditure with confirmation
  const handleDelete = (id, name) => {
    setDialog({
      show: true,
      type: "confirm",
      title: "Delete Expenditure",
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async () => {
        try {
          await axios.delete(
            `https://gym-invoice-back.onrender.com/api/expenditures/${id}`
          );
          fetchExpenditures();
        } catch (error) {
          console.error("Failed to delete expenditure", error);
        }
      },
    });
  };

  // Add or update expenditure with confirmation
  const handleSubmit = (e) => {
    e.preventDefault();
    setDialog({
      show: true,
      type: "confirm",
      title: editId ? "Update Expenditure" : "Add Expenditure",
      message: editId
        ? `Do you want to update "${formData.name}"?`
        : `Do you want to add "${formData.name}"?`,
      onConfirm: async () => {
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
      },
    });
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="payment-container">
        <h2>💰 Expenditure Management</h2>

        {/* ---------- Form ---------- */}
        <div className="main-card-payment">
          <form className="payment-card" onSubmit={handleSubmit}>
            <h2>📝 Add / Edit Expenditure</h2>
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

            <label>Select Date</label>
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

            <div className="filter-buttons">
              <button type="submit" className="btn btn-primary">
                {editId ? "💾 Update" : "➕ Add"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ name: "", cost: "", date: "", description: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* ---------- Filters ---------- */}
          <div className="payment-card">
            <h2>🔍 Search Expenditure</h2>
            <label>Select Date From</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
            <label>Select Date To</label>
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
            <div className="filter-buttons">
              <button onClick={clearFilter} className="btn btn-primary">
                Clear
              </button>
            </div>
          </div>
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
                .sort((a, b) => new Date(b.date) - new Date(a.date))
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
                          onClick={() => handleDelete(e.id, e.name)}
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

        {/* ---------- Dialog Box ---------- */}
        <DialogBox dialog={dialog} setDialog={setDialog} />
      </div>
    </div>
  );
}

export default ExpenditurePage;

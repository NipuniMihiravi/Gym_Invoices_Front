import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import Header from "../Home/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function ExpenditureAnalytics() {
  const [expenditures, setExpenditures] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    name: "",
  });

  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    try {
      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/expenditures"
      );
      setExpenditures(res.data);
    } catch (err) {
      console.error("Failed to fetch expenditures", err);
    }
  };

  // ✅ Handle filter input change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ Apply filters client-side (like PaymentAnalytics)
  const filteredExpenditures = expenditures.filter((e) => {
    const expDate = new Date(e.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    if (fromDate && expDate < fromDate) return false;
    if (toDate && expDate > toDate) return false;
    if (
      filters.name &&
      !e.name.toLowerCase().includes(filters.name.toLowerCase())
    )
      return false;

    return true;
  });

  // ✅ Total expenditure
  const totalExpenditure = filteredExpenditures.reduce(
    (acc, e) => acc + (e.cost || 0),
    0
  );

  // ✅ Category-wise expenditure
  const categoryWiseExpenditure = filteredExpenditures.reduce((acc, e) => {
    if (!acc[e.name]) acc[e.name] = 0;
    acc[e.name] += e.cost || 0;
    return acc;
  }, {});

  // ✅ Monthly expenditure trend
  const monthlyExpenditure = filteredExpenditures.reduce((acc, e) => {
    const monthKey = e.date ? e.date.slice(0, 7) : "Unknown";
    if (!acc[monthKey]) acc[monthKey] = 0;
    acc[monthKey] += e.cost || 0;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyExpenditure).map(([month, amount]) => ({
    month,
    amount,
  }));

  // ✅ Pie chart data
  const pieData = Object.entries(categoryWiseExpenditure).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#33B5E5",
    "#AA66CC",
  ];

  return (
    <div className="dashboard">
      <Header />

      <div className="payment-container">
        <h2>📊 Expenditure Analytics Dashboard</h2>

        {/* ---------- Filters ---------- */}
        <div className="filters">
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
        </div>

        {/* ---------- Summary Cards ---------- */}
        <div className="analytics-cards">
          <div className="card">
            <h4>Total Expenditure</h4>
            <p>Rs {totalExpenditure.toLocaleString()}</p>
          </div>
          <div className="card">
            <h4>Total Records</h4>
            <p>{filteredExpenditures.length}</p>
          </div>
          <div className="card">
            <h4>Highest Expense</h4>
            <p>
              Rs{" "}
              {Math.max(
                ...filteredExpenditures.map((e) => e.cost || 0),
                0
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ---------- Category Wise Table ---------- */}
        <h3>Category-wise Expenditure</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categoryWiseExpenditure).map(([name, total]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- Pie Chart ---------- */}
        <h3>Expense Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* ---------- Monthly Trend ---------- */}
        <h3>Monthly Expenditure Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FF7043"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenditureAnalytics;

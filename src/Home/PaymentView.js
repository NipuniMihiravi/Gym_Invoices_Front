import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import { useNavigate } from "react-router-dom";
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
  Legend
} from "recharts";

function PaymentAnalytics() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    memberId: "",
    status: ""
  });
  const navigate = useNavigate();

   useEffect(() => {
        const role = sessionStorage.getItem("userRole");
        if (!role) {
          navigate("/"); // redirect to login if no session
        }
      }, [navigate]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("https://gym-invoice-back.onrender.com/api/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filtered payments based on memberId, status and date range
  const filteredPayments = payments.filter((p) => {
    const paymentDate = new Date(p.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    if (fromDate && paymentDate < fromDate) return false;
    if (toDate && paymentDate > toDate) return false;
    if (filters.memberId && !p.memberId.toLowerCase().includes(filters.memberId.toLowerCase())) return false;
    if (filters.status && !p.status.toLowerCase().includes(filters.status.toLowerCase())) return false;

    return true;
  });

  // Analytics calculations
  const totalRevenue = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const paymentsCount = filteredPayments.length;

  // Monthly Revenue
  const monthlyIncome = filteredPayments.reduce((acc, p) => {
    const monthKey = `${p.year}-${p.month}`;
    if (!acc[monthKey]) acc[monthKey] = 0;
    acc[monthKey] += p.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyIncome).map(([month, amount]) => ({
    month,
    amount
  }));

  // Status Pie Data
  const statusCounts = filteredPayments.reduce((acc, p) => {
    if (!acc[p.status]) acc[p.status] = 0;
    acc[p.status]++;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([status, value]) => ({ name: status, value }));

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  const handleLogout = () => navigate("/");

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span className="logo-sub-text-button" onClick={() => navigate("/dashboard-admin")}>
            Admin Panel
          </span>
        </div>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="payment-container">
        <h2>Payment Analytics Dashboard</h2>

        {/* Filters */}
        <div className="filters">
          <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          <input name="memberId" placeholder="Member ID" value={filters.memberId} onChange={handleFilterChange} />
          <input name="status" placeholder="Status" value={filters.status} onChange={handleFilterChange} />
        </div>

        {/* Summary Cards */}
        <div className="analytics-cards">
          <div className="card">
            <h4>Total Revenue</h4>
            <p>Rs {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="card">
            <h4>Total Payments</h4>
            <p>{paymentsCount}</p>
          </div>
          <div className="card">
            <h4>Average Monthly Income</h4>
            <p>Rs { (totalRevenue / Object.keys(monthlyIncome).length || 0).toFixed(2) }</p>
          </div>
        </div>

        {/* Line Chart */}
        <h3>Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Line type="monotone" dataKey="amount" stroke="#008080" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        {/* Pie Chart */}
        <h3>Payment Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#008080"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => `${value} payments`} />
          </PieChart>
        </ResponsiveContainer>

        {/* Payments Table */}
        <h3>Filtered Payments</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Year</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id}>
                <td>{p.memberId}</td>
                <td>{p.year}</td>
                <td>{p.month}</td>
                <td>{p.amount}</td>
                <td>{p.date}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default PaymentAnalytics;

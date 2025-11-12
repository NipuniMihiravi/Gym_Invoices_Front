import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
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
  Legend,
} from "recharts";

function PaymentAnalytics() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    memberId: "",
    status: "",
  });
  const navigate = useNavigate();

  // ✅ Redirect to login if session missing
  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/payments"
      );
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        "https://gym-invoice-back.onrender.com/api/members"
      );
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members", err);
    }
  };

  // ✅ Handle filter input change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ Apply filters to payments
  const filteredPayments = payments.filter((p) => {
    const paymentDate = new Date(p.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    if (fromDate && paymentDate < fromDate) return false;
    if (toDate && paymentDate > toDate) return false;
    if (
      filters.memberId &&
      !p.memberId.toLowerCase().includes(filters.memberId.toLowerCase())
    )
      return false;
    if (
      filters.status &&
      !p.status.toLowerCase().includes(filters.status.toLowerCase())
    )
      return false;

    return true;
  });

  // ✅ Calculate revenues
  const totalPaymentRevenue = filteredPayments.reduce(
    (acc, p) => acc + (p.amount || 0),
    0
  );

  // ✅ Registered member count & reg fee total
  const registeredMembers = members.filter(
    (m) => m.regFee && m.regFee > 0
  );
  const totalRegFee = registeredMembers.reduce(
    (acc, m) => acc + (m.regFee || 0),
    0
  );

  // ✅ Add regFee to total revenue
  const totalRevenue = totalPaymentRevenue + totalRegFee;

  // ✅ Membership-wise revenue
  const membershipWiseRevenue = filteredPayments.reduce((acc, p) => {
    if (!acc[p.membershipType]) acc[p.membershipType] = 0;
    acc[p.membershipType] += p.amount;
    return acc;
  }, {});

  // ✅ Monthly income chart
  const monthlyIncome = filteredPayments.reduce((acc, p) => {
    const monthKey = p.date ? p.date.slice(0, 7) : "Unknown";
    if (!acc[monthKey]) acc[monthKey] = 0;
    acc[monthKey] += p.amount || 0;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyIncome).map(([month, amount]) => ({
    month,
    amount,
  }));

  // ✅ Payment status chart
  const statusCounts = filteredPayments.reduce((acc, p) => {
    if (!acc[p.status]) acc[p.status] = 0;
    acc[p.status]++;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status,
    value,
  }));

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#AA66CC", "#33B5E5"];

  return (
    <div className="dashboard">

           <Header />

      <div className="payment-container">
        <h2>💰Payment Analytics Dashboard</h2>

        {/* Filters */}
        <div className="payment-card">
        <label>Select Date From</label>
          <input
            type="date"
            placeholder="From"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
          <label>Select Date To</label>
          <input
            type="date"
            placeholder="To"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
          <input
            name="memberId"
            placeholder="Member ID"
            value={filters.memberId}
            onChange={handleFilterChange}
          />

        </div>

        {/* Summary Cards */}
        <div className="analytics-cards">
          <div className="card">
            <h4>Total Revenue (Including Reg Fees)</h4>
            <p>Rs {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="card">
            <h4>Total Membership Payments</h4>
            <p>Rs {totalPaymentRevenue.toLocaleString()}</p>
          </div>
          <div className="card">
            <h4>Registered Members</h4>
            <p>{registeredMembers.length}</p>
          </div>
          <div className="card">
            <h4>Total Registration Fees</h4>
            <p>Rs {totalRegFee.toLocaleString()}</p>
          </div>
        </div>

        {/* Membership Wise Revenue */}
        <h3>Membership Wise Revenue</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Membership Type</th>
              <th>Total Revenue (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(membershipWiseRevenue).map(([type, amount]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Monthly Revenue Line Chart */}
        <h3>Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Line type="monotone" dataKey="amount" stroke="#008080" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>


      </div>
    </div>
  );
}

export default PaymentAnalytics;

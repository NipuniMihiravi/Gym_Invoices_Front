import React, { useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [memberId, setMemberId] = useState("");
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState({ amount: "", method: "", date: "" });

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/members/${memberId}/payments`);
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const addPayment = async () => {
    try {
      await axios.post(`http://localhost:8080/api/members/${memberId}/payments`, payment);
      fetchPayments(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <input
        type="text"
        placeholder="Enter Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
      />
      <button onClick={fetchPayments}>Get Payments</button>

      <ul>
        {payments.map((p, i) => (
          <li key={i}>
            {p.date} - Rs.{p.amount} ({p.method})
          </li>
        ))}
      </ul>

      <h3>Add Payment</h3>
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={payment.amount}
        onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
      />
      <input
        type="text"
        name="method"
        placeholder="Payment Method"
        value={payment.method}
        onChange={(e) => setPayment({ ...payment, method: e.target.value })}
      />
      <input
        type="date"
        name="date"
        value={payment.date}
        onChange={(e) => setPayment({ ...payment, date: e.target.value })}
      />
      <button onClick={addPayment}>Add</button>
    </div>
  );
}

export default AdminPanel;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";

function MemberTable() {
  const [members, setMembers] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: "",
    amount: "",
    paymentStatus: ""
  });
  const [showPaymentFormFor, setShowPaymentFormFor] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/register");
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const handleAddPayment = async (memberId) => {
    try {
      await axios.put(`http://localhost:8080/api/register/${memberId}/addPayment`, paymentForm);
      fetchMembers();
      setPaymentForm({ paymentDate: "", amount: "", paymentStatus: "" });
      setShowPaymentFormFor(null);
    } catch (error) {
      console.error("Payment Add Error:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>All Registered Members</h2>
      <table className="member-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Occupation</th>
            <th>Membership Type</th>
            <th>Member ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <React.Fragment key={m.id}>
              <tr>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>{m.address}</td>
                <td>{m.occupation}</td>
                <td>{m.membershipType}</td>
                <td>{m.memberId}</td>
                <td>
                  <button onClick={() => setShowPaymentFormFor(m.id)}>Add Payment</button>
                </td>
              </tr>
              {showPaymentFormFor === m.id && (
                <tr>
                  <td colSpan="8">
                    <div>
                      <h4>Add Payment</h4>
                      <input
                        type="date"
                        name="paymentDate"
                        value={paymentForm.paymentDate}
                        onChange={handlePaymentChange}
                      />
                      <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={paymentForm.amount}
                        onChange={handlePaymentChange}
                      />
                      <select
                        name="paymentStatus"
                        value={paymentForm.paymentStatus}
                        onChange={handlePaymentChange}
                      >
                        <option value="">--Status--</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                      </select>
                      <button onClick={() => handleAddPayment(m.id)}>Submit Payment</button>
                    </div>
                  </td>
                </tr>
              )}
              {m.payments && m.payments.length > 0 && (
                <tr>
                  <td colSpan="8">
                    <strong>Payment History:</strong>
                    <table className="payment-history">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.payments.map((p, idx) => (
                          <tr key={idx}>
                            <td>{p.paymentDate}</td>
                            <td>{p.amount}</td>
                            <td>{p.paymentStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberTable;

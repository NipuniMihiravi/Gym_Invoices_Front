import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import Header from "../Home/Header";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { MdClose } from "react-icons/md";

function PaymentTable() {
  const [payments, setPayments] = useState([]);
  const [viewPayment, setViewPayment] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [modalMessage, setModalMessage] = useState({ type: "", text: "" });
  const [dialog, setDialog] = useState({
    show: false,
    message: "",
    type: "",
    onConfirm: null,
  });

  // 🔍 Filters
  const [searchId, setSearchId] = useState("");
  const [searchBillNo, setSearchBillNo] = useState("");


  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Fetch all payments
  const fetchPayments = async () => {
    try {
      const res = await axios.get("https://gym-invoice-back.onrender.com/api/payments");
      const sorted = res.data.sort((a, b) => {
        const idA = parseInt(a.memberId.replace(/\D/g, ""));
        const idB = parseInt(b.memberId.replace(/\D/g, ""));
        return idB - idA;
      });
      setPayments(sorted);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // ✅ Filter logic
  const filteredPayments = payments.filter(
    (p) =>
      p.memberId?.toLowerCase().includes(searchId.toLowerCase()) &&
      p.billNo?.toLowerCase().includes(searchBillNo.toLowerCase())

  );

  // ✅ Handle input change for edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPayment((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Update payment
  const handleUpdate = async () => {
    if (!editPayment) return;
    if (!editPayment.status || !editPayment.paymentMethod) {
      setModalMessage({
        type: "warning",
        text: "⚠️ Status and Payment Method are required.",
      });
      return;
    }

    try {
      await axios.put(
        `https://gym-invoice-back.onrender.com/api/payments/${editPayment.id}`,
        editPayment
      );
      setModalMessage({ type: "success", text: "✅ Payment updated successfully!" });
      setEditPayment(null);
      fetchPayments();
    } catch (error) {
      console.error("Update failed:", error);
      setModalMessage({ type: "error", text: "❌ Failed to update payment." });
    }
  };

  // ✅ Delete with confirmation dialog
  const handleDelete = (id) => {
    setDialog({
      show: true,
      type: "confirm",
      message: "⚠️ Are you sure you want to delete this payment record?",
      onConfirm: async () => {
        try {
          await axios.delete(`https://gym-invoice-back.onrender.com/api/payments/${id}`);
          fetchPayments();
          setDialog({ show: true, type: "success", message: "✅ Payment deleted successfully!" });
        } catch (error) {
          console.error("Delete failed:", error);
          setDialog({ show: true, type: "error", message: "❌ Failed to delete payment." });
        }
      },
    });
  };

  return (
    <div className="dashboard">
      <Header />

      {/* ✅ Dialog Box */}
      {dialog.show && (
        <div className="dialog-overlay">
          <div className={`dialog-box ${dialog.type}`}>
            <p>{dialog.message}</p>
            <div className="dialog-buttons">
              {dialog.type === "confirm" ? (
                <>
                  <button
                    onClick={() => {
                      dialog.onConfirm && dialog.onConfirm();
                      setDialog({ ...dialog, show: false });
                    }}
                  >
                    Yes
                  </button>
                  <button onClick={() => setDialog({ ...dialog, show: false })}>No</button>
                </>
              ) : (
                <button onClick={() => setDialog({ ...dialog, show: false })}>OK</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="payment-container">
        <h2>SYSTEM MANAGEMENT ➤ PAYMENT DETAILS</h2>

        {/* 🔍 Filters */}
        <div className="payment-card">
        <h2>🔍 Search Details</h2>
          <input
            placeholder="Search by Member ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <input
            placeholder="Search by Bill No"
            value={searchBillNo}
            onChange={(e) => setSearchBillNo(e.target.value)}
          />

        </div>

        {/* ✅ Payment Table */}
        <table className="payment-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Bill No</th>
              <th>Member Name</th>
              <th>Membership Type</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "15px", color: "#555" }}>
                  ✅ No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.memberId}</td>
                  <td>{p.billNo}</td>
                  <td>{p.memberName}</td>
                  <td>{p.membershipType}</td>
                  <td>{p.amount}</td>
                  <td>{p.date}</td>
                  <td>{p.status}</td>
                  <td>
                    <div className="table-action-buttons">
                      <button onClick={() => setViewPayment(p)} className="action-btn view-btn">
                        <MdVisibility size={18} /> View
                      </button>
                      <button onClick={() => setEditPayment(p)} className="action-btn edit-btn">
                        <MdEdit size={18} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="action-btn delete-btn"
                      >
                        <MdDelete size={18} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ View Modal */}
        {viewPayment && (
          <div className="modal1">
            <div className="modal1-content">

              <h4>View Payment Details</h4>
              <div className="modal1-grid">
                <div className="form-row"><label>Member ID</label><input value={viewPayment.memberId} disabled /></div>
                <div className="form-row"><label>Bill No</label><input value={viewPayment.billNo} disabled /></div>
                <div className="form-row"><label>Member Name</label><input value={viewPayment.memberName} disabled /></div>
                <div className="form-row"><label>Member Email</label><input value={viewPayment.memberEmail} disabled /></div>
                <div className="form-row"><label>Membership Type</label><input value={viewPayment.membershipType} disabled /></div>
                <div className="form-row"><label>Joined Date</label><input value={viewPayment.joinedDate} disabled /></div>
                <div className="form-row"><label>Paid Month</label><input value={viewPayment.date} disabled /></div>
                <div className="form-row"><label>Payment Date</label><input value={viewPayment.payDate} disabled /></div>
                <div className="form-row"><label>Amount</label><input value={viewPayment.amount} disabled /></div>
                <div className="form-row"><label>Status</label><input value={viewPayment.status} disabled /></div>
                <div className="form-row"><label>Payment Method</label><input value={viewPayment.paymentMethod} disabled /></div>
              </div>
              <div className="filter-buttons">
                <button onClick={() => setViewPayment(null)} className="btn btn-primary">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Edit Modal */}
        {editPayment && (
          <div className="modal1">
            <div className="modal1-content">


              {modalMessage.text && (
                <div className={`modal-message ${modalMessage.type}`}>
                  {modalMessage.text}
                </div>
              )}
              <h4>Edit Payment Details</h4>
              <div className="modal1-grid">
                <div className="form-row"><label>Member ID</label><input value={editPayment.memberId} readOnly /></div>
                <div className="form-row"><label>Member Name</label><input value={editPayment.memberName} readOnly /></div>

                <div className="form-row"><label>Paid Month</label><input type="date" name="date" value={editPayment.date} readOnly /></div>
                <div className="form-row"><label>Payment Date</label><input type="date" name="payDate" value={editPayment.payDate} readOnly /></div>
                <div className="form-row"><label>Amount</label><input type="number" name="amount" value={editPayment.amount || ""} onChange={handleEditChange} /></div>

               <div className="form-row">
                 <label>Status</label>
                 <select
                   name="status"
                   value={editPayment.status || ""}
                   onChange={handleEditChange}
                 >
                   <option value="">-- Select Status --</option>
                   <option value="Done">Done</option>
                   <option value="Absent">Absent</option>
                 </select>
               </div>

                <div className="form-row">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={editPayment.paymentMethod || ""} onChange={handleEditChange}>
                    <option value="">-- Select Method --</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>

                  </select>
                </div>
              </div>
              <div className="filter-buttons">
                <button onClick={handleUpdate} className="btn btn-primary" >Save</button>
                <button onClick={() => setEditPayment(null)} className="btn btn-primary" >Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentTable;

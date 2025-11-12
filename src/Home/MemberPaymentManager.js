import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const currentYear = new Date().getFullYear();

function MemberPaymentManager() {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [viewMode, setViewMode] = useState("payment");
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().substring(0, 10),
    paymentMethod: "",
  });
  const [feeAmount, setFeeAmount] = useState(0);
  const [dueDate, setDueDate] = useState(null);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [attendanceDates, setAttendanceDates] = useState([]);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) navigate("/");

    const fetchMembershipTypes = async () => {
      try {
        const res = await axios.get(
          "https://gym-invoice-back.onrender.com/api/memberships"
        );
        setMembershipTypes(res.data);
      } catch (error) {
        console.error("Error fetching membership types:", error);
      }
    };
    fetchMembershipTypes();
  }, [navigate]);



      // Fetch payment history
const handleSearch = async () => {
  if (!memberId) return;

  try {
    // Fetch member info
    const res = await axios.get(
      `https://gym-invoice-back.onrender.com/api/members/by-member-id/${memberId}`
    );

    const member = res.data;

    if (!member || member.membershipStatus !== "ACTIVE") {
      setDialogMessage("⚠️ Member is not in ACTIVE status.");
      setShowDialog(true);
      setMemberData(null);
      setPayments([]);
      return;
    }

    setMemberData(member);

    // Fetch payment history
    const pay = await axios.get(
      `https://gym-invoice-back.onrender.com/api/payments/member/${memberId}`
    );
    const paymentHistory = Array.isArray(pay.data) ? pay.data : [];
    setPayments(paymentHistory);

    // ✅ Get last payment date (most recent)
    if (paymentHistory.length > 0) {
      const lastPayment = paymentHistory.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];
      setMemberData({ ...member, lastPaymentDate: lastPayment.date });
    } else {
      setMemberData({ ...member, lastPaymentDate: null });
    }

    // Membership duration mapping
    const plan = {
      "one-one": 1, "one-two": 1,
      "three-one": 3, "three-two": 3,
      "six-one": 6, "six-two": 6,
      "twelve-one": 12, "twelve-two": 12
    };

    // Determine next due date
    let calculatedNextDue;
    if (paymentHistory.length === 0) {
      // ✅ No payments: use joined date
      calculatedNextDue = new Date(member.joinedDate);
    } else {
      // ✅ Payments exist: last payment + membership duration
      const lastPaymentDate = new Date(
        paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
      );
      calculatedNextDue = new Date(lastPaymentDate);
      calculatedNextDue.setMonth(
        calculatedNextDue.getMonth() + (plan[member.membershipType] || 1)
      );
    }

    setDueDate(calculatedNextDue);

    // Get membership fee
    const selectedType = membershipTypes.find(
      (t) => t.type === member.membershipType
    );
    const fee = selectedType ? selectedType.fee : 0;
    setFeeAmount(fee);

    // Set default form values
    setForm({
      amount: fee,
      date: paymentHistory.length === 0
        ? new Date().toISOString().substring(0, 10)
        : calculatedNextDue.toISOString().substring(0, 10),
      paymentMethod: "",
    });

  } catch (err) {
    console.error(err);
    setDialogMessage("❌ Error fetching member or payment data.");
    setShowDialog(true);
    setMemberData(null);
    setPayments([]);
  }
};



// Add this inside your component
useEffect(() => {
  // Fetch attendance whenever memberData changes
  if (memberData) {
    fetchAttendance(memberData.memberId);
  }
}, [memberData]);

const fetchAttendance = async (id) => {
  try {
    const res = await axios.get(
      `https://gym-invoice-back.onrender.com/api/attendance/member/${id}`
    );
    // Convert attendance dates to Date objects
    const dates = (res.data || []).map((a) => new Date(a.date));
    setAttendanceDates(dates);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    setAttendanceDates([]);
  }
};


  const handleScan = (result) => {
    if (result) {
      const memberIdFromQR = result.text.split("MemberID:")[1]?.split("\n")[0]?.trim();
      if (memberIdFromQR) {
        setMemberId(memberIdFromQR);
        handleSearch();
      }
    }
  };

const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("https://gym-invoice-back.onrender.com/api/payments", {
      memberId,
      amount: form.amount || feeAmount,
      date: new Date(dueDate).toISOString().substring(0, 10),  // Next due date
      payDate: form.date,                                       // Actual payment date (YYYY-MM-DD)
      status: "Done",
      paymentMethod: form.paymentMethod,
    });

      setDialogMessage("✅ Payment saved successfully!");
      setShowDialog(true);
      handleSearch(); // refresh member info
    } catch (err) {
      console.error(err);
      setDialogMessage("❌ Payment failed!");
      setShowDialog(true);
    }
  };

  const handleMarkAbsent = async () => {
    if (!memberId) return;

    try {
      await axios.post("https://gym-invoice-back.onrender.com/api/payments", {
        memberId,
        amount: 0,
        date: new Date(dueDate).toISOString().substring(0, 10), // For that month
        payDate: new Date().toISOString().substring(0, 10), // today
        status: "Absent",
        paymentMethod: "Absent",
      });

      setDialogMessage("⚠️ Member marked as Absent for this month!");
      setShowDialog(true);
      handleSearch(); // refresh payment table
    } catch (err) {
      console.error(err);
      setDialogMessage("❌ Failed to mark as absent.");
      setShowDialog(true);
    }
  };


  return (
    <div className="dashboard">

      <Header />

      <div className="payment-wrapper">
        <div className="payment-container">
          <h2> 💵 Member Payments</h2>

          <div className="search-box">
            <input
              type="text"
              id="memberIdInput"
              placeholder="Enter Member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="qr-reader-container">
            <h4>Scan QR Code to Search</h4>
            <button className="scan-toggle-button" onClick={() => setCameraActive(!cameraActive)}>
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </button>
            {cameraActive && (
              <div style={{ width: "300px", marginTop: "10px" }}>
                <BarcodeScannerComponent
                  width={300}
                  height={300}
                  onUpdate={(err, result) => {
                    if (result) handleScan(result);
                    if (err) console.error(err);
                  }}
                />
              </div>
            )}
          </div>

          {memberData && (
            <>
              <table className="member-info-table">
                <tbody>
                  <tr>
                    <td colSpan="2" className="member-name-row">
                      <span className="member-name">{memberData.name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email:</strong> {memberData.email}
                    </td>
                    <td>
                      <strong>Phone No:</strong> {memberData.mobile}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Membership Type:</strong> {memberData.membershipType}
                    </td>
                    <td>
                      <strong>Joined Date:</strong> {new Date(memberData.joinedDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Fee (Rs.):</strong> {feeAmount}
                    </td>

                   <td>
                   <strong>Last Payment Date:</strong>{" "}
                                         {memberData.lastPaymentDate
                                           ? new Date(memberData.lastPaymentDate).toLocaleDateString()
                                           : "-"}

                   </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                       <strong>Next Due:</strong>{" "}
                                           {dueDate ? new Date(dueDate).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Toggle Buttons */}
              <div className="toggle-buttons" style={{ margin: "15px 0" }}>
                <button
                  className={`toggle-button ${viewMode === "payment" ? "active" : ""}`}
                  onClick={() => setViewMode("payment")}
                >
                   Payment
                </button>
                <button
                  className={`toggle-button ${viewMode === "attendance" ? "active" : ""}`}
                  onClick={() => setViewMode("attendance")}
                >
                  Attendance View
                </button>
              </div>

              {/* Conditionally render sections based on viewMode */}
              {viewMode === "payment" && (
                <div className="payment-card">
                  <form onSubmit={handlePaymentSubmit}>
                    <label>Amount (Rs.)</label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                    />

                    <label>Payment Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />

                    <label>Payment Method</label>
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                    </select>

                    <div className="payment-buttons">
                      <button className="pay-button" type="submit">
                        ✅ Submit Payment
                      </button>
                      <button
                        type="button"
                        className="pay-button"
                        onClick={handleMarkAbsent}

                      >
                        🚫 Mark Absent
                      </button>
                    </div>
                  </form>
                </div>
              )}

             {viewMode === "attendance" && (
               <div className="attendance-calendar">
                 <h3>Attendance Calendar</h3>
                 <Calendar
                   tileClassName={({ date, view }) => {
                     if (view === "month") {
                       const attended = attendanceDates.find(
                         (d) =>
                           d.getFullYear() === date.getFullYear() &&
                           d.getMonth() === date.getMonth() &&
                           d.getDate() === date.getDate()
                       );
                       if (attended) return "attended-day"; // class for attended dates
                     }
                   }}
                 />
               </div>
             )}


            </>
          )}
        </div>
      </div>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{dialogMessage}</p>
            <button onClick={() => setShowDialog(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberPaymentManager;

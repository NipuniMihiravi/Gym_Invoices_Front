import React, { useState, useEffect  } from "react";
import axios from "axios";
import "../Home/AppHome.css";
import '../Admin/Admin.css';
import { useNavigate } from 'react-router-dom';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";



const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();

function MemberPaymentManager() {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(null);
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [form, setForm] = useState({
    year: currentYear,
    month: "",
    amount: "",
    date: new Date().toISOString().substring(0, 10),
    status: "Done",
  });
  const [dialogMessage, setDialogMessage] = useState(""); // message to show
  const [showDialog, setShowDialog] = useState(false); // show/hide dialog
  const [cameraActive, setCameraActive] = useState(false);
  const [attendanceDates, setAttendanceDates] = useState([]);

    useEffect(() => {
            const role = sessionStorage.getItem("userRole");
            if (!role) {
              navigate("/"); // redirect to login if no session
            }
          }, [navigate]);


  useEffect(() => {

  const fetchMembershipTypes = async () => {
        try {
          const res = await axios.get("https://gym-invoice-back.onrender.com/api/memberships");
          setMembershipTypes(res.data);
        } catch (error) {
          console.error("Error fetching membership types:", error);
        }
      };
      fetchMembershipTypes();
    }, []);

useEffect(() => {
  if (memberId) {
    document.getElementById("memberIdInput")?.focus();
  }
}, [memberId]);

const fetchAttendance = async (id) => {
  try {
    const res = await axios.get(
      `https://gym-invoice-back.onrender.com/api/attendance//member/{memberId}}`
    );
    // Convert date strings to Date objects
    const dates = (res.data || []).map(a => new Date(a.date));
    setAttendanceDates(dates);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    setAttendanceDates([]);
  }
};

const handleSearch = async () => {
  try {
    const res = await axios.get(
      `https://gym-invoice-back.onrender.com/api/members/by-member-id/${memberId}`
    );

    if (!res.data || res.data.membershipStatus !== "ACTIVE") {
      setDialogMessage("⚠️ Member is not in ACTIVE status.");
      setShowDialog(true);
      setMemberData(null);
      setPayments([]);
      return;
    }

    setMemberData(res.data);

    const paymentRes = await axios.get(
      `https://gym-invoice-back.onrender.com/api/payments/member/${memberId}`
    );
    const data = paymentRes.data;
    setPayments(Array.isArray(data) ? data : []);
  } catch (err) {
    setDialogMessage("❌ Error fetching member or payment data.");
    setShowDialog(true);
    setMemberData(null);
    setPayments([]);
  }
};

 // QR scan callback
const handleScan = (result) => {
  if (result) {
    const qrText = result.text; // get scanned QR text

    // Extract MemberID from QR code text
    const memberIdFromQR = qrText.split("MemberID:")[1]?.split("\n")[0]?.trim();

    if (memberIdFromQR) {
      setMemberId(memberIdFromQR);   // update input field
      handleSearch(memberIdFromQR);  // fetch member details
    }
  }
};



  const handleError = (err) => {
    console.error(err);
  };





const joinedDate = memberData ? new Date(memberData.joinedDate) : null;

const isBeforeJoin = (monthIndex) => {
  if (!joinedDate) return false;
  const joinYear = new Date(joinedDate).getFullYear();
  const joinMonth = new Date(joinedDate).getMonth(); // 0 = Jan

  // If current year is joined year → lock months before joined month
  if (currentYear === joinYear && monthIndex < joinMonth) {
    return true;
  }
  return false;
};


const hasPaid = (month) => {
  return payments.some(
    (p) =>
      p.year === currentYear &&
      p.month === month &&
      (p.status === "Done" || p.status === "Regi & Fee") // ✅ include Regi & Fee
  );
};

const isAbsent = (month) => {
  return payments.some(
    (p) => p.year === currentYear && p.month === month && p.status === "Absent"
  );
};

const getPaidDate = (month) => {
  const payment = payments.find(
    (p) =>
      p.year === currentYear &&
      p.month === month &&
      (p.status === "Done" || p.status === "Regi & Fee") // ✅ include Regi & Fee
  );
  return payment ? payment.date : "-";
};


  const handlePaymentChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const confirmPayment = window.confirm(
      "⚠️ Are you sure you want to mark this member as Payment Done?"
    );
    if (!confirmPayment) return; // ❌ Stop if user clicks Cancel

    try {
      await axios.post("https://gym-invoice-back.onrender.com/api/payments", {
        ...form,
        memberId,
        year: currentYear,
        status: "Done"
      });

      setDialogMessage("✅ Payment saved successfully!");
      setShowDialog(true);
      setShowPaymentForm(null);
      handleSearch(); // Refresh payments
    } catch (err) {
      console.error("Payment save failed:", err);
      setDialogMessage("❌ Payment failed. Please try again.");
      setShowDialog(true);
    }
  };



 const handleAbsentStatus = async () => {
   const confirmAbsent = window.confirm(
     "⚠️ Are you sure you want to mark this member as Absent?"
   );
   if (!confirmAbsent) return; // Stop if user clicks Cancel

   try {
     await axios.post("https://gym-invoice-back.onrender.com/api/payments", {
       memberId,
       year: currentYear,
       month: showPaymentForm,
       amount: 0,
       date: new Date().toISOString().substring(0, 10),
       status: "Absent"
     });

     setDialogMessage("✅ Marked as Absent.");
     setShowDialog(true);
     setShowPaymentForm(null);
     handleSearch(); // Refresh payments
   } catch (err) {
     console.error("Failed to mark as Absent:", err);
     setDialogMessage("❌ Failed to mark as Absent.");
     setShowDialog(true);
   }
 };


  const handleRegiAndFee = async () => {
    const confirmRegiFee = window.confirm(
      "⚠️ Are you sure you want to mark this member as Paid Registration & Fee?"
    );
    if (!confirmRegiFee) return; // Stop if user clicks Cancel

    try {
      await axios.post("https://gym-invoice-back.onrender.com/api/payments", {
        ...form,
        memberId,
        year: currentYear,
        month: showPaymentForm,
        amount: form.amount || 0,
        date: form.date || new Date().toISOString().substring(0, 10),
        status: "Regi & Fee"
      });

      setDialogMessage("✅ Marked as Registration & Monthly Fee Done.");
      setShowDialog(true);
      setShowPaymentForm(null);
      handleSearch(); // Refresh payments
    } catch (err) {
      console.error("Failed to mark as Regi & Fee:", err);
      setDialogMessage("❌ Failed to mark as Registration & Fee.");
      setShowDialog(true);
    }
  };


  const handleLogout = () => {
    navigate('/');
  };



  return (
      <div className="dashboard">
        <header className="header">
          <div className="logo-wrapper">
            <div className="logo-circle">PT</div>
            <span className="logo-text">Pulse Fitness</span>
            <span className="logo-arrow">»</span>
            <span
              className="logo-sub-text-button"
              onClick={() => navigate('/dashboard')}
            >
              Admin Panel
            </span>
          </div>

          <div className="header-right">
            <div className="project-stats">

            </div>

          </div>
        </header>

        <div className="payment-wrapper">
          <div className="payment-container">
            <h2>Manage Member Payments</h2>

            <div className="search-box">
              <input
                type="text"
                placeholder="Enter Member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            <div className="qr-reader-container">
                            <h4>Scan QR Code to Search</h4>

                            {/* Toggle Camera Button */}
                            <button
                              className="scan-toggle-button"
                              onClick={() => setCameraActive((prev) => !prev)}
                            >
                              {cameraActive ? "Stop Camera" : "Start Camera"}
                            </button>

                            {/* Camera Preview */}
                            {cameraActive && (
                              <div style={{ width: "300px", marginTop: "10px" }}>
                                <BarcodeScannerComponent
                                  width={300}
                                  height={300}
                                  onUpdate={(err, result) => {
                                    if (result) {
                                      handleScan(result); // pass the full result object
                                    }
                                    if (err) {
                                      handleError(err);
                                    }
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
                      <td className="member-details-row2">
                        <strong>Email:</strong> {memberData.username}
                      </td>
                      <td className="member-details-row2">
                        <strong>Phone No:</strong> {memberData.phone}
                      </td>
                    </tr>
                    <tr>
                      <td className="member-details-row2">
                        <strong>Membership Type:</strong> {memberData.membershipType}
                      </td>
                      <td className="member-details-row2">
                        <strong>Joined Date:</strong> {memberData.joinedDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="member-details-row2">
                        <strong>Fees (Rs.):</strong>
                        {(() => {
                          const selectedType = membershipTypes.find(
                            (type) => type.type === memberData.membershipType
                          );
                          return selectedType ? selectedType.fee : "N/A";
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="attendance-calendar">
                    <h3>Attendance Calendar</h3>
                    <Calendar
                      tileClassName={({ date, view }) => {
                        if (view === "month") {
                          const found = attendanceDates.find(
                            (d) =>
                              d.getFullYear() === date.getFullYear() &&
                              d.getMonth() === date.getMonth() &&
                              d.getDate() === date.getDate()
                          );
                          if (found) return "attended-day"; // CSS class for attended days
                        }
                      }}
                    />
                  </div>

                <div className="payment-table">
                  <h3>{currentYear} Monthly Payments</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Status</th>
                        <th>Paid Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months.map((month, index) => {
                        const paid = hasPaid(month);
                        const absent = isAbsent(month);
                        const beforeJoin = isBeforeJoin(index);

                        return (
                          <tr key={index}>
                            <td>{month}</td>
                            <td>
                              {beforeJoin ? (
                                <span className="locked-status">Locked</span>
                              ) : absent ? (
                                <span className="absent-status">Absent</span>
                              ) : paid ? (
                                <span className="paid-status">
                                  {payments.find(
                                    (p) =>
                                      p.year === currentYear &&
                                      p.month === month &&
                                      p.status === "Regi & Fee"
                                  )
                                    ? "Regi & Fee"
                                    : "Done"}
                                </span>
                              ) : (
                                <span className="not-paid-status">Pending</span>
                              )}
                            </td>

                            <td>{beforeJoin ? "-" : getPaidDate(month)}</td>
                            <td>
                              {beforeJoin ? (
                                <button className="done-button" disabled>
                                  Locked
                                </button>
                              ) : paid || absent ? (
                                <button className="done-button" disabled>
                                  {absent
                                    ? "Absent"
                                    : payments.find(
                                        (p) =>
                                          p.year === currentYear &&
                                          p.month === month &&
                                          p.status === "Regi & Fee"
                                      )
                                    ? "Regi & Fee"
                                    : "Done"}
                                </button>
                              ) : (
                                <button
                                  className="pay-button"
                                  onClick={() => {
                                    setShowPaymentForm(month);
                                    setForm({
                                      year: currentYear,
                                      month: month,
                                      amount: "",
                                      date: new Date().toISOString().substring(0, 10),
                                      status: "Done",
                                    });
                                  }}
                                >
                                  Make Payment
                                </button>
                              )}

                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {showPaymentForm && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <form className="payment-form" onSubmit={handlePaymentSubmit}>
                          <h4>Make Payment - {showPaymentForm}</h4>
                          <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={form.amount}
                            onChange={handlePaymentChange}
                            required
                            min={0}
                          />
                          <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handlePaymentChange}
                            required
                            min={new Date().toISOString().substring(0, 10)}
                          />
                          <div className="modal-buttons">
                            <button type="submit">Submit Payment</button>
                            <button type="button" onClick={handleAbsentStatus}>
                              Mark as Absent
                            </button>
                            <button
                              type="button"
                              onClick={handleRegiAndFee}
                            >
                              Regi and Fee
                            </button>

                            <button type="button" onClick={() => setShowPaymentForm(null)}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
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



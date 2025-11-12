import React, { useState, useEffect } from 'react';
import './AppHome.css';
import '../Admin/Admin.css';
import Header from "../Home/Header";
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';

const API_URL = 'https://gym-invoice-back.onrender.com/api/memberships';

function MembershipManager() {
  const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState({ type: '', fee: '', duration: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [viewForm, setViewForm] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    date: "",
    description: "",
  });

  const [dialog, setDialog] = useState({
    show: false,
    type: "", // "success", "error", "warning", "confirm"
    message: "",
    onConfirm: null, // optional callback for confirm dialogs
  });

   useEffect(() => {
        const role = sessionStorage.getItem("userRole");
        if (!role) {
          navigate("/"); // redirect to login if no session
        }
      }, [navigate]);


  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setMemberships(response.data);
      })
      .catch((error) => {
        console.error('Error fetching memberships:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Handle fee input with comma separators and decimals (max 2 decimal digits)
  const handleFeeChange = (e) => {
    let value = e.target.value;

    // Remove all commas
    value = value.replace(/,/g, '');

    // Validate: allow digits and one optional decimal point, max 2 decimals
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return; // Ignore invalid input
    }

    // Split integer and decimal parts
    const parts = value.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Add commas to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Recombine formatted fee
    const formatted = decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;

    setForm(prev => ({ ...prev, fee: formatted }));
  };

 const handleAddOrUpdate = () => {
   if (!form.type || !form.fee || !form.duration) {
     setDialog({ show: true, type: "warning", message: "⚠️ All fields are required." });
     return;
   }

   const cleanFee = parseFloat(form.fee.replace(/,/g, ''));
   if (isNaN(cleanFee)) {
     setDialog({ show: true, type: "warning", message: "⚠️ Please enter a valid fee." });
     return;
   }

   const submitData = { ...form, fee: cleanFee };

   if (editIndex !== null) {
     const id = memberships[editIndex].id;
     axios.put(`${API_URL}/${id}`, submitData)
       .then((response) => {
         const updated = [...memberships];
         updated[editIndex] = response.data;
         setMemberships(updated);
         setEditIndex(null);
         setForm({ type: '', fee: '', duration: '' });
         setDialog({ show: true, type: "success", message: "✅ Membership updated successfully!" });
       })
       .catch((error) => {
         console.error("Update error:", error);
         setDialog({ show: true, type: "error", message: "❌ Failed to update membership." });
       });
   } else {
     axios.post(API_URL, submitData)
       .then((response) => {
         setMemberships([...memberships, response.data]);
         setForm({ type: '', fee: '', duration: '' });
         setDialog({ show: true, type: "success", message: "✅ Membership added successfully!" });
       })
       .catch((error) => {
         console.error("Add error:", error);
         setDialog({ show: true, type: "error", message: "❌ Failed to add membership." });
       });
   }
 };


 const handleView = (membership) => {
   setViewForm(membership);
   setDialog({
     show: true,
     type: "success",
     message: `Viewing Membership:\nType: ${membership.type}\nFee: RS ${Number(membership.fee).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}\nDuration: ${membership.duration}`
   });
 };


  const handleEdit = (membership) => {
    const index = memberships.findIndex(m => m.id === membership.id);
    // Format fee with commas and 2 decimals for editing
    const formattedFee = Number(membership.fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setForm({ ...membership, fee: formattedFee });
    setEditIndex(index);
  };

const handleDelete = (id) => {
  setDialog({
    show: true,
    type: "confirm",
    message: "⚠️ Are you sure you want to delete this membership?",
    onConfirm: async () => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMemberships(memberships.filter(m => m.id !== id));
        setDialog({ show: true, type: "success", message: "✅ Membership deleted successfully!" });
      } catch (error) {
        console.error("Delete error:", error);
        setDialog({ show: true, type: "error", message: "❌ Failed to delete membership." });
      }
    },
  });
};


  return (
    <div className="dashboard">

      <Header />


        <div className="payment-container">
          <h2> 📋 MEMBERSHIP</h2>
          <div className="payment-card">
          <h2>📝 Add Membership</h2>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Membership Type"
            />
            <input
              type="text"
              name="fee"
              value={form.fee}
              onChange={handleFeeChange}
              placeholder="Fee (RS)"
            />
            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="duration-select"
            >
              <option value="">Select Duration</option>
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
              <option value="6 months">6 Months</option>
              <option value="12 months">12 Months</option>
            </select>

           <div className="filter-buttons">
             <button className="btn btn-primary" onClick={handleAddOrUpdate}>
               {editIndex !== null ? "💾 Update" : "➕ Add"}
             </button>

             {editIndex !== null && (
               <button
                 type="button"
                 className="btn btn-secondary"
                 onClick={() => {
                   setEditIndex(null); // reset edit state
                   setFormData({
                     name: "",
                     cost: "",
                     date: "",
                     description: "",
                   });
                 }}
               >
                 ❌ Cancel
               </button>
             )}
           </div>


          </div>

<div className="payment-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Fee (Rs.)</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>{membership.type}</td>
                  <td>{Number(membership.fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{membership.duration}</td>
                  <td>
                  <div className="table-action-buttons">
                    <button onClick={() => handleView(membership)} className="action-btn view-btn">
                      <MdVisibility size={20} /> View
                    </button>
                    <button onClick={() => handleEdit(membership)} className="action-btn edit-btn">
                      <MdEdit size={20} /> Edit
                    </button>
                    <button onClick={() => handleDelete(membership.id)} className="action-btn delete-btn">
                      <MdDelete size={20} /> Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           </div>
        </div>
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
                    <button onClick={() => setDialog({ ...dialog, show: false })}>
                      No
                    </button>
                  </>
                ) : (
                  <button onClick={() => setDialog({ ...dialog, show: false })}>OK</button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

  );
}

export default MembershipManager;

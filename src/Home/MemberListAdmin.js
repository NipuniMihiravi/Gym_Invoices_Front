import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import { Link, useNavigate } from 'react-router-dom';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';




function MemberTable() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ new search state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewForm, setViewForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const [membershipTypes, setMembershipTypes] = useState([]);
 const [dialog, setDialog] = useState({
   show: false,
   title: "",
   message: "",
   type: "", // "success", "error", "warning", "confirm"
   onConfirm: null, // optional callback for confirm dialogs
 });

  useEffect(() => {
       const role = sessionStorage.getItem("userRole");
       if (!role) {
         navigate("/"); // redirect to login if no session
       }
     }, [navigate]);


  useEffect(() => {
    fetchMembers();
    fetchMembershipTypes();
  }, []);

  const fetchMembershipTypes = async () => {
    try {
      const res = await axios.get("https://gym-invoice-back.onrender.com/api/memberships");
      setMembershipTypes(res.data);
    } catch (error) {
      console.error("Error fetching membership types:", error);
    }
  };


const fetchMembers = async () => {
  try {
    const res = await axios.get("https://gym-invoice-back.onrender.com/api/members");

    const sorted = res.data.sort((a, b) => {
      const idA = parseInt(a.memberId.replace(/\D/g, "")); // remove non-digits
      const idB = parseInt(b.memberId.replace(/\D/g, ""));
      return idB - idA; // highest first
    });

    setMembers(sorted);
  } catch (error) {
    console.error("Error fetching members:", error);
  }
};




  // Filter logic: match search term in ANY field
  const filteredMembers = members.filter((m) => {
    return Object.values(m).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "membershipType") {
      const selectedType = membershipTypes.find((type) => type.type === value);
      const fee = selectedType ? selectedType.fee : "";
      setEditForm((prevForm) => ({
        ...prevForm,
        membershipType: value,
        fees: fee
      }));
    } else {
      setEditForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleView = (member) => setViewForm(member);

const handleDelete = (id) => {
  setDialog({
    show: true,
    type: "confirm",
    message: "⚠️ Are you sure you want to delete this member?",
    onConfirm: async () => {
      try {
        await axios.delete(`https://gym-invoice-back.onrender.com/api/members/${id}`);
        fetchMembers();
        setDialog({ show: true, type: "success", message: "✅ Member deleted successfully!" });
      } catch (error) {
        console.error("Error deleting member:", error);
        setDialog({ show: true, type: "error", message: "❌ Failed to delete member." });
      }
    },
  });
};


const handleEditClick = (member) => {
  setEditingId(member.id); // using your custom memberId
  setEditForm({ ...member });
    setShowModal(true); // explicitly show modal
};







const handleUpdate = async () => {
  if (!editForm.membershipStatus || !editForm.membershipType || !editForm.joinedDate) {
    setModalMessage({ type: "warning", text: "⚠️ Membership Status, Membership Type, and Joined Date are required." });
    return;
  }

  try {
    await axios.put(
      `https://gym-invoice-back.onrender.com/api/members/${editingId}`,
      editForm
    );

    fetchMembers();

    // Show success message
    setModalMessage({ type: "success", text: "✅ Member updated successfully!" });

    // Close modal after 1.5s
    setTimeout(() => {
      setEditingId(null);
      setEditForm({});
      setModalMessage({ type: "", text: "" });
      setShowModal(false); // close modal
    }, 1500);

  } catch (error) {
    console.error("Update failed:", error);
    setModalMessage({ type: "error", text: "❌ Failed to update member. Please try again." });
  }
};










  const handleLogout = () => navigate('/');




  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span
            className="logo-sub-text-button"
            onClick={() => navigate('/dashboard-admin')}
          >
            Admin Panel
          </span>
        </div>
        <div className="header-right">
         <div className="project-stats">

                  </div>


        </div>
      </header>

      <div className="payment-container">
        <h2>All Registered Members</h2>

        {/* 🔍 Search input */}
        <input
          type="text"
          placeholder="Search by any field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
            maxWidth: "300px",
          }}
        />

        <table className="payment-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Membership Type</th>
              <th>Membership Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m.id}>
                <td>{m.memberId}</td>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.joinedDate}</td>
                <td>{m.membershipType}</td>
                <td>{m.membershipStatus}</td>
               <td>
                     <div className="table-action-buttons">
                       <button onClick={() => handleView(m)} className="action-btn view-btn">
                         <MdVisibility size={20} /> View
                       </button>
                       <button onClick={() => handleEditClick(m)} className="action-btn edit-btn">
                         <MdEdit size={20} /> Edit
                       </button>
                       <button onClick={() => handleDelete(m.id)} className="action-btn delete-btn">
                         <MdDelete size={20} /> Delete
                       </button>
                     </div>
                   </td>
              </tr>
            ))}
          </tbody>
        </table>

      {editingId && (
        <div className="modal1">
          <div className="modal1-content">
           {modalMessage.text && (
                  <div className={`modal-message ${modalMessage.type}`}>
                    {modalMessage.text}
                  </div>
                )}


            <h4>Edit Member Details</h4>
            <div className="modal1-grid">
              <div className="form-row">
                <label>Member ID</label>
                <input name="memberId" value={editForm.memberId || ""} readOnly />
              </div>
              <div className="form-row">
                <label>Full Name</label>
                <input name="name" value={editForm.name || ""} onChange={handleEditChange} />
              </div>

              <div className="form-row">
                          <label>Membership Status</label>
                          <select
                            name="membershipStatus"
                            value={editForm.membershipStatus || ""}
                            onChange={handleEditChange}
                          >
                            <option value="">-- Select Status --</option>
                            <option value="ACTIVE">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

      <div className="form-row">
        <label>Membership Type</label>
        <select
          name="membershipType"
          value={editForm.membershipType || ""}
          onChange={handleEditChange}
        >
          <option value="">Select Membership Type</option>
          {membershipTypes.map((type) => (
            <option key={type._id} value={type.type}>
              {type.type}
            </option>
          ))}
        </select>
      </div>

             <div className="form-row">
                             <label>Phone</label>
                             <input name="phone" value={editForm.phone || ""} onChange={handleEditChange} />
                           </div>

             <div className="form-row">
               <label>Joined Date</label>
               <input
                 type="date"
                 name="joinedDate"
                 value={editForm.joinedDate || ""}
                 onChange={handleEditChange}
               />
             </div>

              <div className="form-row">
                <label>Gender</label>
                <input name="gender" value={editForm.gender || ""} onChange={handleEditChange} />
              </div>


              <div className="form-row">
                <label>Address</label>
                <input name="address" value={editForm.address || ""} onChange={handleEditChange} />
              </div>
              <div className="form-row">
                <label>Occupation</label>
                <input name="occupation" value={editForm.occupation || ""} onChange={handleEditChange} />
              </div>
             <div className="form-row">
               <label>Special Description</label>
               <textarea
                 name="specialDescription"
                 value={editForm.specialDescription || ""}
                 onChange={handleEditChange}
                 rows="4" // You can adjust the number of visible rows
                 cols="50" // Optional: adjust width
               />
             </div>


            </div>
            <div className="form-actions">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => { setEditingId(null); setModalMessage({ type: "", text: "" }); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

       {/* View Modal */}
          {viewForm && (
            <div className="modal1">
              <div className="modal1-content">
                <h4>View Member Details</h4>
                <div className="modal1-grid">
                  <div className="form-row"><label>Member ID</label><input value={viewForm.memberId} disabled /></div>
                  <div className="form-row"><label>Full Name</label><input value={viewForm.name} disabled /></div>
                  <div className="form-row"><label>Phone</label><input value={viewForm.phone} disabled /></div>
                  <div className="form-row"><label>Membership Type</label><input value={viewForm.membershipType} disabled /></div>
                  <div className="form-row"><label>Membership Status</label><input value={viewForm.membershipStatus} disabled /></div>
                  <div className="form-row"><label>Joined Date</label><input value={viewForm.joinedDate} disabled /></div>
                  <div className="form-row"><label>Gender</label><input value={viewForm.gender} disabled /></div>
                  <div className="form-row"><label>Username</label><input value={viewForm.username} disabled /></div>
                  <div className="form-row"><label>Password</label><input value={viewForm.password} disabled /></div>
                  <div className="form-row"><label>Address</label><input value={viewForm.address} disabled /></div>
                  <div className="form-row"><label>Occupation</label><input value={viewForm.occupation} disabled /></div>
                  <div className="form-row"><label>Special Description</label><input value={viewForm.specialDescription} disabled /></div>


                </div>
                <div className="form-actions">
                  <button onClick={() => setViewForm(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

     </div>
{dialog.show && (
  <div className="dialog-overlay">
    <div className={`dialog-box ${dialog.type}`}>
      {dialog.title && <h4>{dialog.title}</h4>}
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
          <button
            onClick={() => {
              if (dialog.onConfirm) {
                dialog.onConfirm();
              } else {
                setDialog({ ...dialog, show: false });
              }
            }}
          >
            OK
          </button>

        )}
      </div>
    </div>
  </div>
)}

     </div>



  );
}

export default MemberTable;

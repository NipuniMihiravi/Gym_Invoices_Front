import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import DialogBox from "../Home/DialogBox";
import { Link, useNavigate } from 'react-router-dom';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { MdClose } from "react-icons/md";


function MemberTable() {
  const [members, setMembers] = useState([]);
  const [searchMembershipType, setSearchMembershipType] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewForm, setViewForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ type: "", text: "" });
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [dialog, setDialog] = useState({
       show: false,
       title: "",
       message: "",
       type: "", // "success", "error", "warning", "confirm"
       onConfirm: null, // optional callback for confirm dialogs
     });
     const showDialog = (type, message, onConfirm = null, title = "") => {
       setDialog({
         show: true,
         type,
         message,
         title,
         onConfirm,
       });
     };

  const navigate = useNavigate();

  // ✅ Ensure user is logged in
  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) navigate("/");
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
        const idA = parseInt(a.memberId.replace(/\D/g, ""));
        const idB = parseInt(b.memberId.replace(/\D/g, ""));
        return idB - idA;
      });
      setMembers(sorted);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

const filteredMembers = members.filter((m) => {
  const idMatch = (m.memberId || "").toLowerCase().includes(searchId.toLowerCase());
  const nameMatch = (m.name || "").toLowerCase().includes(searchName.toLowerCase());
  const phoneMatch = (m.mobile || "").toLowerCase().includes(searchPhone.toLowerCase());
  const typeMatch = (m.membershipType || "").toLowerCase().includes(searchMembershipType.toLowerCase());

  // ✅ Exact match for status or allow "All" (empty)
  const statusMatch = !searchStatus || (m.membershipStatus === searchStatus);

  return idMatch && nameMatch && phoneMatch && typeMatch && statusMatch;
});



  // ✅ Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "membershipType") {
      const selectedType = membershipTypes.find((type) => type.type === value);
      const fee = selectedType ? selectedType.fee : "";
      setEditForm((prev) => ({ ...prev, membershipType: value, fees: fee }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ View modal
  const handleView = (member) => setViewForm(member);

  // ✅ Delete member with confirmation
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

  // ✅ Open edit modal
  const handleEditClick = (member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
    setShowModal(true);
  };

  // ✅ Save edit form
  const handleUpdate = async () => {
    // ✅ Validation
    if (!editForm.membershipStatus || !editForm.membershipType || !editForm.joinedDate) {
      setModalMessage({ type: "warning", text: "⚠️ Membership Status, Type, and Joined Date are required." });
      return;
    }

    try {
      // ✅ Update member
      await axios.put(`https://gym-invoice-back.onrender.com/api/members/${editingId}`, editForm);

      // ✅ Close modal immediately
      setEditingId(null);
      setEditForm({});
      setShowModal(false);

      // ✅ Optional: Show success message via dialog
      setDialog({ show: true, type: "success", message: "✅ Member updated successfully!" });

      // ✅ Refresh member list (preferred way, faster than full page reload)
      fetchMembers();

      // OR, if you want a full page reload instead
      // window.location.reload();

    } catch (error) {
      console.error("Update failed:", error);
      setModalMessage({ type: "error", text: "❌ Failed to update member." });
    }
  };

  const handleLogout = () => navigate('/');

  return (
    <div className="dashboard">
      <Header />

      <div className="payment-container">
        <h2>SYSTEM MANAGEMENT ➤ MEMBER DETAILS</h2>

        {/* 🔍 Search Inputs */}
       <div className="payment-card">
         <h2>🔍 Search Details</h2>

           <div className="filter-row">
             <div className="filter-item">

               <input
                 placeholder="Search by Member ID"
                 value={searchId}
                 onChange={(e) => setSearchId(e.target.value)}
               />
             </div>

             <div className="filter-item">

               <input
                 placeholder="Search by Name"
                 value={searchName}
                 onChange={(e) => setSearchName(e.target.value)}
               />
             </div>
           </div>

           {/* Row 2: Phone + Status + Membership Type */}
           <div className="filter-row">
             <div className="filter-item">

               <input
                 placeholder="Search by Phone"
                 value={searchPhone}
                 onChange={(e) => setSearchPhone(e.target.value)}
               />
             </div>
             </div>

         <div className="filter-row">
           <div className="filter-item">
             <label>Status</label>
             <select
               className="duration-select"
               value={searchStatus}
               onChange={(e) => setSearchStatus(e.target.value)}
             >
               <option value="">ALL STATUS</option>
               <option value="ACTIVE">ACTIVE</option>
               <option value="INACTIVE">INACTIVE</option>
             </select>
           </div>

           <div className="filter-item">
             <label>Membership Type</label>
             <select
               className="duration-select"
               value={searchMembershipType}
               onChange={(e) => setSearchMembershipType(e.target.value)}
             >
               <option value="">ALL TYPES</option>
               <option value="one-one">ONE-ONE</option>
               <option value="one-two">ONE-TWO</option>
               <option value="three-one">THREE-ONE</option>
               <option value="three-two">THREE-TWO</option>
               <option value="six-one">SIX-ONE</option>
               <option value="six-two">SIX-TWO</option>
               <option value="twelve-one">TWELVE-ONE</option>
               <option value="twelve-two">TWELVE-TWO</option>
             </select>
           </div>
         </div>
       </div>


        {/* ✅ Member Table */}
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
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "15px", fontWeight: "bold", color: "#555" }}>
                  ✅ No members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{m.mobile}</td>
                  <td>{m.joinedDate}</td>
                  <td>{m.membershipType}</td>
                  <td>{m.membershipStatus}</td>

                  <td>
                    <div className="table-action-buttons">
                      <button onClick={() => handleView(m)} className="action-btn view-btn"><MdVisibility size={20} /> View</button>
                      <button onClick={() => handleEditClick(m)} className="action-btn edit-btn"><MdEdit size={20} /> Edit</button>
                      <button onClick={() => handleDelete(m.id)} className="action-btn delete-btn"><MdDelete size={20} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ Edit Modal */}
        {editingId && (
          <div className="modal1">
            <div className="modal1-content">

              {modalMessage.text && <div className={`modal-message ${modalMessage.type}`}>{modalMessage.text}</div>}
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
                  <select name="membershipStatus" value={editForm.membershipStatus || ""} onChange={handleEditChange}>
                    <option value="">-- Select Status --</option>
                    <option value="ACTIVE">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Membership Type</label>
                  <select name="membershipType" value={editForm.membershipType || ""} onChange={handleEditChange}>
                    <option value="">Select Membership Type</option>
                    {membershipTypes.map((type) => (
                      <option key={type._id} value={type.type}>{type.type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Joined Date</label>
                  <input type="date" name="joinedDate" value={editForm.joinedDate || ""} onChange={handleEditChange} />
                </div>
                <div className="form-row">
                  <label>Special Description</label>
                  <textarea name="specialDescription" value={editForm.specialDescription || ""} onChange={handleEditChange} rows="4" cols="50" />
                </div>


              </div>
              <div className="filter-buttons">
                <button onClick={handleUpdate}  className="btn btn-primary" >Save</button>
                <button onClick={() => { setEditingId(null); setModalMessage({ type: "", text: "" }); }}  className="btn btn-primary" >Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ View Modal */}
        {viewForm && (
          <div className="modal1">
            <div className="modal1-content">

              <h4>View Member Details</h4>
              <div className="modal1-grid">

                      <div className="form-row"><label>Member ID</label><input value={viewForm.memberId} disabled /></div>
                      <div className="form-row"><label>Full Name</label><input value={viewForm.name} disabled /></div>
                      <div className="form-row"><label>Phone</label><input value={viewForm.mobile} disabled /></div>
                      <div className="form-row"><label>Email</label><input value={viewForm.email} disabled /></div>

                      <div className="form-row"><label>City</label><input value={viewForm.city} disabled /></div>
                      <div className="form-row"><label>Profession</label><input value={viewForm.profession} disabled /></div>

                      <div className="form-row"><label>Membership Type</label><input value={viewForm.membershipType} disabled /></div>
                      <div className="form-row"><label>Membership Status</label><input value={viewForm.membershipStatus} disabled /></div>

                      <div className="form-row"><label>Joined Date</label><input value={viewForm.joinedDate} disabled /></div>
                      <div className="form-row"><label>Weight</label><input value={viewForm.weight} disabled /></div>

                      {/* Emergency Information */}
                      <div className="form-row"><label>Emergency Name</label><input value={viewForm.emergencyName} disabled /></div>
                      <div className="form-row"><label>Relationship</label><input value={viewForm.emergencyRelationship} disabled /></div>
                      <div className="form-row"><label>Emergency Mobile</label><input value={viewForm.emergencyMobile} disabled /></div>
                      <div className="form-row"><label>Emergency Land</label><input value={viewForm.emergencyLand} disabled /></div>

                      <div className="form-row"><label>Special Description</label><input value={viewForm.specialDescription} disabled /></div>
                      <div className="form-row"><label>Registration Status</label><input value={viewForm.regStatus || "-"} disabled /></div>

                    </div>
              <div className="filter-buttons"><button onClick={() => setViewForm(null)}  className="btn btn-primary">Close</button></div>
            </div>
          </div>
        )}


      </div>
       <DialogBox dialog={dialog} setDialog={setDialog} />
    </div>
  );
}

export default MemberTable;

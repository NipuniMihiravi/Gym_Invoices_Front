import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppHome.css";
import '../Admin/Admin.css';
import Header from "../Home/Header";
import DialogBox from "../Home/DialogBox"; // ✅ Import DialogBox
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function MemberTable() {
  const [members, setMembers] = useState([]);
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
    onConfirm: null,
  });

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

  // ✅ Filter members with empty membershipStatus
  const filteredMembers = members.filter((m) => !m.membershipStatus || m.membershipStatus.trim() === "");

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
          fetchMembers(); // Refresh list
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
    if (!editForm.membershipStatus || !editForm.membershipType || !editForm.joinedDate) {
      setModalMessage({ type: "warning", text: "⚠️ Membership Status, Type, and Joined Date are required." });
      return;
    }

    if (!editForm.regFee || editForm.regFee <= 0) {
      setModalMessage({ type: "warning", text: "⚠️ Please enter a valid Registration Fee." });
      return;
    }

    if (!editForm.regStatus || editForm.regStatus.trim() === "") {
      setModalMessage({ type: "warning", text: "⚠️ Please select Registration Status." });
      return;
    }

    try {
      await axios.put(`https://gym-invoice-back.onrender.com/api/members/${editingId}`, editForm);
      setEditingId(null);
      setEditForm({});
      setShowModal(false);
      setDialog({ show: true, type: "success", message: "✅ Member updated successfully!" });
      fetchMembers();
    } catch (error) {
      console.error("Update failed:", error);
      setModalMessage({ type: "error", text: "❌ Failed to update member." });
    }
  };

  return (
    <div className="dashboard">
      <Header />

      <div className="payment-container">
        <h2>📝 Newly Registered Members</h2>

        {/* Member Table */}
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

                      <button onClick={() => handleEditClick(m)} className="action-btn edit-btn"><MdEdit size={20} /> Edit</button>
                      <button onClick={() => handleDelete(m.id)} className="action-btn delete-btn"><MdDelete size={20} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editingId && (
          <div className="modal1">
            <div className="modal1-content">
              <button
                className="modal-close-btn"
                onClick={() => {
                  setEditingId(null);
                  setShowModal(false);
                  setModalMessage({ type: "", text: "" });
                }}
              >
                <MdClose />
              </button>
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
                  <label>Registration Fee</label>
                  <input type="number" name="regFee" value={editForm.regFee || ""} onChange={handleEditChange} />
                </div>
                <div className="form-row">
                  <label>Registration Status</label>
                  <select name="regStatus" value={editForm.regStatus || ""} onChange={handleEditChange}>
                    <option value="">-- Select Status --</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div className="filter-buttons">
                <button onClick={handleUpdate} className="btn btn-primary">Save</button>
                <button onClick={() => { setEditingId(null); setModalMessage({ type: "", text: "" }); }} className="btn btn-primary">Cancel</button>
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
                <div className="form-row"><label>Membership Type</label><input value={viewForm.membershipType} disabled /></div>
                <div className="form-row"><label>Membership Status</label><input value={viewForm.membershipStatus} disabled /></div>
                <div className="form-row"><label>Joined Date</label><input value={viewForm.joinedDate} disabled /></div>
                <div className="form-row"><label>Special Description</label><input value={viewForm.specialDescription} disabled /></div>
                <div className="form-row"><label>Registration Status</label><input value={viewForm.regStatus || "-"} disabled /></div>
              </div>
              <div className="form-actions"><button onClick={() => setViewForm(null)}>Close</button></div>
            </div>
          </div>
        )}

        {/* ✅ Dialog Box */}
        <DialogBox dialog={dialog} setDialog={setDialog} />
      </div>
    </div>
  );
}

export default MemberTable;

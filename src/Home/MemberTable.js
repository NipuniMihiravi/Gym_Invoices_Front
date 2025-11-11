import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import '../Admin/Admin.css';
import Header from "../Home/Header";

export default function Member() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ new search state
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const parqQuestions = [
    "Has your doctor ever said that you have a heart condition and should only do physical activity recommended by a doctor?",
    "Do you feel pain in your chest when you do physical activity?",
    "In the past month, have you had chest pain when you were not doing physical activity?",
    "Do you lose your balance because of dizziness or do you ever lose consciousness?",
    "Do you have a bone or joint problem that could be made worse by a change in your physical activity?",
    "Is your doctor currently prescribing drugs for your blood pressure or heart condition?",
    "Do you know of any other reason why you should not do physical activity?"
  ];

const printRef = useRef();




  const fetchMembers = async () => {
    try {
      const res = await axios.get("https://gym-invoice-back.onrender.com/api/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (m) => {
    setSelectedMember(m);
    setIsEdit(false);
  };

  const handleEdit = (m) => {
    setSelectedMember(m);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this member?")) return;

    await axios.delete(`https://gym-invoice-back.onrender.com/api/members/${id}`);
    fetchMembers();
  };

  const saveChanges = async () => {
    await axios.put(
      `https://gym-invoice-back.onrender.com/api/members/${selectedMember.id}`,
      selectedMember
    );

    setSelectedMember(null);
    fetchMembers(); // ✅ Table refresh — removed if status changes
  };

  const input = (field) => (
    isEdit ? (
      <input
        value={selectedMember[field] || ""}
        onChange={(e) =>
          setSelectedMember({ ...selectedMember, [field]: e.target.value })
        }
      />
    ) : (
      <span>{selectedMember[field]}</span>
    )
  );

  const downloadProfilePDF = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${selectedMember.name}_Profile.pdf`);
  };


    // Filter logic: match search term in ANY field
  const filteredMembers = members.filter((m) => {

    // ✅ Show ONLY new members (membershipStatus not set yet)
    if (m.membershipStatus && m.membershipStatus.trim() !== "") {
      return false;
    }

    // ✅ Search filter
    return Object.values(m).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  return (
    <div className="container">


      <Header />

<div className="payment-container">
        <h2>Registered Member Details</h2>

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
              <th>Name</th>
              <th>Mobile</th>
              <th>Joined Date</th>
              <th>Membership Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
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
                  <button onClick={() => handleEdit(m)}className="action-btn edit-btn"> <MdEdit size={20} /> Edit</button>

                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      {/* ✅ MODAL */}
      {selectedMember && (
        <div className="modal1">
                    <div className="modal1-content" ref={printRef}>

            <h3>{isEdit ? "Edit Member" : "Member Details"}</h3>

            <div>
                   <form className="register-form2">

                     <h2>Membership Application Form</h2>

                     {/* Personal Details */}
                    {/* Personal Details */}
                    <div className="section-title">Personal Details</div>
                    <div className="grid-2">
                      <label>Full Name * {input("name")}</label>
                      <label>Address * {input("residence")}</label>
                      <label>City * {input("city")}</label>
                      <label>Land Phone {input("landPhone")}</label>
                      <label>Mobile * {input("mobile")}</label>
                      <label>Date of Birth * {input("dob")}</label>

                      <label>
                        Gender *
                        {isEdit ? (
                          <select value={selectedMember.gender || ""} onChange={(e) => setSelectedMember({ ...selectedMember, gender: e.target.value })}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        ) : (
                          <span>{selectedMember.gender}</span>
                        )}
                      </label>

                      <label>Civil Status {input("civilStatus")}</label>

                      <label>
                        ID Type *
                        {isEdit ? (
                          <select value={selectedMember.idType || ""} onChange={(e) => setSelectedMember({ ...selectedMember, idType: e.target.value })}>
                            <option value="">Select</option>
                            <option>NIC</option>
                            <option>Driving License</option>
                            <option>Passport</option>
                          </select>
                        ) : (
                          <span>{selectedMember.idType}</span>
                        )}
                      </label>

                      <label>ID Number * {input("idNumber")}</label>
                      <label>Email * {input("email")}</label>
                    </div>

                    {/* Professional */}
                    <div className="section-title">Professional Details</div>
                    <div className="grid-2">
                      <label>Profession {input("profession")}</label>
                      <label>Office Address {input("officeAddress")}</label>
                      <label>Office Mobile {input("officeMobile")}</label>
                    </div>

                    {/* Reasons */}
              <div className="section-title">Reasons for Joining</div>
              <div className="checkbox-row">
                {selectedMember?.reasonEndurance && <span>Endurance ✅</span>}
                {selectedMember?.reasonFitness && <span>Fitness ✅</span>}
                {selectedMember?.reasonWeightLoss && <span>Weight Loss ✅</span>}
                {selectedMember?.reasonStrength && <span>Strength ✅</span>}
                {selectedMember?.reasonMuscle && <span>Muscle ✅</span>}
              </div>

              <div className="section-title">How did you hear about us</div>
              <div className="checkbox-row">
                {selectedMember?.newspaper && <span>Newspaper ✅</span>}
                {selectedMember?.leaflet && <span>Leaflet ✅</span>}
                {selectedMember?.friend && <span>Friend ✅</span>}
                {selectedMember?.member && <span>Existing Member ✅</span>}
                {selectedMember?.facebook && <span>Facebook ✅</span>}
              </div>



                    {/* Emergency */}
                    <div className="section-title">Emergency Contact</div>
                    <div className="grid-2">
                      <label> Name * {input("emergencyName")}</label>
                      <label> Relationship * {input("emergencyRelationship")}</label>
                      <label> Mobile * {input("emergencyMobile")}</label>
                      <label> Land Phone {input("emergencyLand")}</label>
                    </div>

                    {/* PAR-Q */}
                    <div className="section-title">Physical Activity Readiness (PAR-Q)</div>
                    {parqQuestions.map((question, i) => (
                      <div className="parq-row" key={i}>
                        <span className="parq-question">{question}</span>

                        <div className="parq-options">
                          {isEdit ? (
                            <>
                              <label>
                                <input
                                  type="radio"
                                  checked={selectedMember.parq?.[i] === "Yes"}
                                  onChange={() => {
                                    let arr = [...selectedMember.parq];
                                    arr[i] = "Yes";
                                    setSelectedMember({ ...selectedMember, parq: arr });
                                  }}
                                />{" "}
                                Yes
                              </label>

                              <label>
                                <input
                                  type="radio"
                                  checked={selectedMember.parq?.[i] === "No"}
                                  onChange={() => {
                                    let arr = [...selectedMember.parq];
                                    arr[i] = "No";
                                    setSelectedMember({ ...selectedMember, parq: arr });
                                  }}
                                />{" "}
                                No
                              </label>
                            </>
                          ) : (
                            <span>{selectedMember.parq?.[i]}</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Measurements */}
                    <div className="section-title">Measurements</div>
                    <div className="grid-3">
                      <label>Weight (kg) {input("weight")}</label>
                      <label>Height (cm) {input("height")}</label>
                      <label>Fat % {input("fat")}</label>
                    </div>



                    {/* Legal Agreement */}
                              <div className="section-title">Release of Liability & Membership Agreement</div>
                              <div className="liability-terms">
                                <p>In consideration of gaining membership or being allowed to participate in the activities and programs of Power Life Fitness and to use its facilities, equipment, and machinery, I hereby waive, release, and forever discharge Power Life Fitness and its officers, employees, and representatives from any and all liability for injuries or damages resulting from participation or use of equipment in the facility.</p>
                                <p>I understand that strength, flexibility, and aerobic exercise, including the use of gym equipment, may involve risk of injury or even death. I voluntarily participate with full knowledge of these risks.</p>
                                <p>I confirm that I am physically fit and have no medical condition that prevents me from exercise. I acknowledge that I should consult a physician before beginning any exercise program.</p>
                                <p>I declare that I am physically sound and understand the need for a physician's clearance where necessary. I accept full responsibility for my participation and use of equipment.</p>
                                <p>I agree to comply with all gym rules and regulations.</p>
                                <p>I understand that membership fees are non-refundable under any circumstances.</p>
                                <p>I consent to my personal data being collected and stored by Power Life Fitness.</p>
                                <p>I accept that Power Life Fitness will contact me via SMS or email when required.</p>
                              </div>
                    <label>Terms Accepted {input("termsAccepted")}</label>

                    {/* Signature */}
                    <div className="signature-block">
                      <label>Date {input("liabilityDate")}</label>
                      <label>Member Signature {input("memberSignature")}</label>
                    </div>

                    {/* Office Use */}
                    <div className="section-title">Office Use</div>
                    <div className="grid-2">
                      <label>Note {input("note")}</label>
                      <label>Date {input("dateOffice")}</label>
                      <label>Authorized Signature {input("signatureOwner")}</label>
                    </div>


                   </form>
                 </div>
            <div className="modal-btns">
              <button onClick={() => setSelectedMember(null)}>Close</button>

              {!isEdit && <button onClick={downloadProfilePDF}>📄 Export PDF</button>}

              {isEdit && <button onClick={saveChanges}>✅ Save</button>}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

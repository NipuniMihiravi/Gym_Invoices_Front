import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) navigate("/");
  }, [navigate]);

  const [form, setForm] = useState({

    name: "",
    residence: "",
    city: "",
    landPhone: "",
    mobile: "",
    dob: "",
    gender: "",
    civilStatus: "",
    idType: "",
    idNumber: "",
    email: "",
    profession: "",
    officeAddress: "",
    officeMobile: "",
    reasonEndurance: false,
    reasonFitness: false,
    reasonWeightLoss: false,
    reasonStrength: false,
    reasonMuscle: false,
    newspaper: false,
    leaflet: false,
    friend: false,
    member: false,
    facebook: false,
    emergencyName: "",
    emergencyRelationship: "",
    emergencyMobile: "",
    emergencyLand: "",
    parq: [],

    weight: "",
    height: "",
    fat: "",

    termsAccepted: false,
    liabilityDate: "",
    memberSignature: "",
    note: "",
    dateOffice: "",
    signatureOwner: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("parq_")) {
      const index = Number(name.split("_")[1]);
      const newParq = [...form.parq];
      newParq[index] = value;
      return setForm({ ...form, parq: newParq });
    }


    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://gym-invoice-back.onrender.com/api/members/register", form);
      alert("✅ Registration Successful!");
      navigate("/dashboard-admin");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>
          <span className="logo-sub-text-button" onClick={() => navigate("/dashboard-admin")}>
            Admin Panel
          </span>
        </div>
        <div className="header-right">
                    {/* Back Button */}
                    <button className="back-btn" onClick={() => navigate(-1)}>
                      ⬅ Back
                    </button>
                  </div>
      </header>

      <div>
        <form className="register-form" onSubmit={handleSubmit}>
        <img
                          src={`${process.env.PUBLIC_URL}/Images/logo.jpeg`}
                          alt="Logo"
                          className="application-logo"
                        />

          <h2>MEMBERSHIP APPLICATION</h2>

          {/* Personal Details */}
         <div className="section-title">Personal Details</div>
         <div className="grid-2">
           <label>
             Full Name *
             <input name="name" placeholder="Enter full name" required onChange={handleChange} />
           </label>

           <label>
             Address *
             <input name="residence" placeholder="Address" required onChange={handleChange} />
           </label>

           <label>
             City *
             <input name="city" placeholder="City" required onChange={handleChange} />
           </label>

           <label>
             Land Phone
             <input name="landPhone" placeholder="Land Phone" onChange={handleChange} />
           </label>

           <label>
             Mobile *
             <input name="mobile" placeholder="Mobile" required onChange={handleChange} />
           </label>

           <label>
             Date of Birth *
             <input name="dob" type="date" required onChange={handleChange} />
           </label>

           <label>
             Gender *
             <select name="gender" required onChange={handleChange}>
               <option value="">Select Gender</option>
               <option>Male</option>
               <option>Female</option>
             </select>
           </label>

           <label>
             Civil Status
             <select name="civilStatus" onChange={handleChange}>
               <option value="">Select</option>
               <option>Single</option>
               <option>Married</option>
             </select>
           </label>

           <label>
             ID Type *
             <select name="idType" required onChange={handleChange}>
               <option value="">Select ID Type</option>
               <option>NIC</option>
               <option>Driving License</option>
               <option>Passport</option>
             </select>
           </label>

           <label>
             ID Number *
             <input name="idNumber" placeholder="ID Number" required onChange={handleChange} />
           </label>

           <label>
             Email *
             <input name="email" placeholder="Email" required onChange={handleChange} />
           </label>
         </div>


          {/* Professional */}
          <div className="section-title">Professional Details</div>
          <div className="grid-2">
            <label>
              Profession
              <input name="profession" placeholder="Profession" onChange={handleChange} />
            </label>

            <label>
              Office Address
              <input name="officeAddress" placeholder="Office Address" onChange={handleChange} />
            </label>

            <label>
              Office Mobile
              <input name="officeMobile" placeholder="Office Mobile" onChange={handleChange} />
            </label>
          </div>

          {/* Reasons */}
          <div className="section-title">Reasons for Joining</div>
          <div className="checkbox-row">
            <label><input type="checkbox" name="reasonEndurance" onChange={handleChange}/> Endurance</label>
            <label><input type="checkbox" name="reasonFitness" onChange={handleChange}/> Fitness</label>
            <label><input type="checkbox" name="reasonWeightLoss" onChange={handleChange}/> Toning & Weight Loss</label>
            <label><input type="checkbox" name="reasonStrength" onChange={handleChange}/> Strength & Size</label>
            <label><input type="checkbox" name="reasonMuscle" onChange={handleChange}/> Muscle & Power</label>
          </div>

          {/* Heard about */}
          <div className="section-title">How did you hear about us</div>
          <div className="checkbox-row">
            <label><input type="checkbox" name="newspaper" onChange={handleChange}/> Newspaper</label>
            <label><input type="checkbox" name="leaflet" onChange={handleChange}/> Leaflet</label>
            <label><input type="checkbox" name="friend" onChange={handleChange}/> Friend</label>
            <label><input type="checkbox" name="member" onChange={handleChange}/> Existing Member</label>
            <label><input type="checkbox" name="facebook" onChange={handleChange}/> Facebook</label>
          </div>

          {/* Emergency */}
        <div className="section-title">Emergency Contact</div>
        <div className="grid-2">
          <label>
            Name *
            <input name="emergencyName" placeholder="Name" required onChange={handleChange} />
          </label>

          <label>
            Relationship *
            <input name="emergencyRelationship" placeholder="Relationship" required onChange={handleChange} />
          </label>

          <label>
            Mobile *
            <input name="emergencyMobile" placeholder="Mobile" required onChange={handleChange} />
          </label>

          <label>
            Land Phone
            <input name="emergencyLand" placeholder="Land Phone" onChange={handleChange} />
          </label>
        </div>


          {/* PAR-Q */}
          <div className="section-title">Physical Activity Readiness Questionnaire (PAR-Q)</div>
          {[
            "Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by your doctor?",
            "Do you feel pain in your chest when you perform physical activity?",
            "In the past month, have you had chest pain when you were not doing physical activity?",
            "Do you lose your balance because of dizziness, or do you ever lose consciousness?",
            "Do you have a bone or joint problem that could be made worse by physical activity?",
            "Is your doctor currently prescribing medication for your blood pressure or heart condition?",
            "Do you know of any other reason why you should not do physical activity?"
          ].map((q, i) => (
            <div className="parq-row" key={i}>
              <span className="parq-question">{i + 1}. {q}</span>
              <div className="parq-options">
                <label>
                  <input type="radio" name={`parq_${i}`} value="Yes" onChange={handleChange}/> Yes
                </label>
                <label>
                  <input type="radio" name={`parq_${i}`} value="No" onChange={handleChange}/> No
                </label>
              </div>
            </div>
          ))}

          {/* Measurements */}
          <div className="section-title">Measurements</div>
          <div className="grid-3">
            <label>
              Weight (kg)
              <input name="weight" placeholder="Weight (kg)" onChange={handleChange} />
            </label>

            <label>
              Height (cm)
              <input name="height" placeholder="Height (cm)" onChange={handleChange} />
            </label>

            <label>
              Fat %
              <input name="fat" placeholder="Fat %" onChange={handleChange} />
            </label>
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

         <div className="agree-block">
           <label>
             <input type="checkbox" name="termsAccepted" required onChange={handleChange} />
             &nbsp; I have read and agree to all terms and conditions. *
           </label>
         </div>

          {/* Signature */}
          <div className="signature-block">
            <div>
              <label>Date *</label>
              <input type="date" name="liabilityDate" required onChange={handleChange} />
            </div>

            <div>
              <label>Member Signature (Full Name) *</label>
              <input type="text" name="memberSignature" placeholder="Type Your Name" required onChange={handleChange} />
            </div>
          </div>

          {/* Office Use */}
          <div className="section-title">Office Use</div>
          <div className="grid-2">
            <label>
              Note
              <input name="note" placeholder="Note" onChange={handleChange} />
            </label>

            <label>
              Date
              <input name="dateOffice" placeholder="Date" onChange={handleChange} />
            </label>

            <label>
              Authorized Signature
              <input name="signatureOwner" placeholder="Authorized Signature" onChange={handleChange} />
            </label>
          </div>

          <button type="submit" className="submit-btn">SUBMIT THE APPLICATION</button>
        </form>
      </div>
    </div>
  );
}

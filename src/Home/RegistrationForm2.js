import React, { useState } from "react";
import axios from "axios";
import "./AppHome.css";
import "../Admin/Admin.css";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    username: "",
    phone: "",
    address: "",
    occupation: "",
  });

  const [dialog, setDialog] = useState({ show: false, message: "", memberId: "" });

  const bgStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL + "/Images/gym.jpg"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const handleChange = (e) => {
    let value = e.target.value;

    // Restrict phone input to integers
    if (e.target.name === "phone") {
      value = value.replace(/\D/g, "");
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to home/login
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Full Name is required.";
    if (!form.gender) return "Please select Gender.";
    if (!form.username.trim()) return "Username is required.";

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.username)) return "Please enter a valid email address.";

   if (!form.phone.trim()) return "Phone is required.";

     // Check phone contains only numbers
     const phoneRegex = /^[0-9]+$/;
     if (!phoneRegex.test(form.phone)) return "Phone must contain only numbers.";

    if (!form.address.trim()) return "Address is required.";
    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert("⚠️ " + error);
      return;
    }

    try {
      const response = await axios.post(
        "https://gym-invoice-back.onrender.com/api/members/register",
        form
      );
      const memberId = response.data.memberId;

      // Show dialog instead of alert
      setDialog({
        show: true,
        message: `✅ Registered successfully! Your Member ID is ${memberId}. Do you want to clear the form?`,
        memberId,
      });
    } catch (error) {
      alert(
        "❌ Registration failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDialogYes = () => {
    setForm({
      name: "",
      gender: "",
      username: "",
      phone: "",
      address: "",
      occupation: "",
    });
    setDialog({ show: false, message: "", memberId: "" });
  };

  const handleDialogNo = () => {
    setDialog({ show: false, message: "", memberId: "" });
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo-wrapper">
          <div className="logo-circle">PT</div>
          <span className="logo-text">Pulse Fitness</span>
          <span className="logo-arrow">»</span>

        </div>



      </header>

      <div className="form-container" style={bgStyle}>
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Pulse Fitness<br /> Gym Membership Registration</h2>

          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="username">Email</label>
          <input
            id="username"
            type="email"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <label htmlFor="occupation">Occupation</label>
          <input
            id="occupation"
            type="text"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>
      </div>

      {/* Dialog Box */}
      {dialog.show && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{dialog.message}</p>
            <div className="dialog-actions">
              <button onClick={handleDialogYes}>Yes</button>
              <button onClick={handleDialogNo}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppHome.css";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // ✅ success / error
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  // Basic validation
  if (!username || !password) {
    setMessage("⚠️ Please fill in all fields.");
    setMessageType("error");
    return;
  }

  // Check credentials and navigate
  if (username === "admin" && password === "admin123") {
    sessionStorage.setItem("userRole", "admin");
    setMessage("✅ Login successful! Redirecting...");
    setMessageType("success");

    setTimeout(() => {
      navigate("/dashboard-admin");
    }, 1000);

  } else if (username === "assistant" && password === "assist123") {
    sessionStorage.setItem("userRole", "assistant");
    setMessage("✅ Login successful! Redirecting...");
    setMessageType("success");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);

  } else {
    setMessage("❌ Invalid username or password.");
    setMessageType("error");
  }
};


  return (
    <div className="login-container2">
      <div className="login-container">
        <img
                  src={`${process.env.PUBLIC_URL}/Images/logo.jpeg`}
                  alt="Logo"
                  className="login-logo"
                />
        <form className="login-form" onSubmit={handleLogin}>


          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {message && (
          <p
            className={`message ${messageType === "success" ? "success" : "error"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

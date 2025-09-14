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

    if (role === "admin" && username === "admin" && password === "admin123") {
      sessionStorage.setItem("userRole", "admin");
      setMessage("✅ Login successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/dashboard-admin");
      }, 1000);

    } else if (role === "assistant" && username === "assistant" && password === "assist123") {
      sessionStorage.setItem("userRole", "assistant");
      setMessage("✅ Login successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } else {
      setMessage("❌ Invalid username, password, or role.");
      setMessageType("error");
    }
  };

  return (
    <div className="login-container2">
      <div className="login-container">
        <h1 className="title">Pulse Fitness</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="admin">Admin</option>
            <option value="assistant">Assistant</option>
          </select>

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

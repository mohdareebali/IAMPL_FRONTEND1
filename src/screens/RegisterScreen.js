// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png"; // ✅ same logo as LoginScreen

function RegisterScreen() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Register Handler (calls backend API)
  const handleRegister = async () => {
    if (!companyName || !email || !companyId || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, companyId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration successful!");
        navigate("/employee-setup");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // ✅ Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const headingStyle = {
    color: "#0d47a1",
    marginBottom: "20px",
  };

  const logoStyle = {
    width: "150px",
    marginBottom: "30px",
    opacity: 0.9,
  };

  const inputStyle = {
    width: "280px",
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const buttonStyle = {
    width: "280px",
    padding: "12px",
    margin: "15px 0",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "white",
    color: "#007bff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  };

  return (
    <div style={containerStyle}>
      {/* ✅ Logo */}
      <img src={logo} alt="Company Logo" style={logoStyle} />

      <h2 style={headingStyle}>Create Your Account</h2>

      <input
        style={inputStyle}
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <input
        style={inputStyle}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={inputStyle}
        type="text"
        placeholder="Company ID"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}

export default RegisterScreen;

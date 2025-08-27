// src/screens/RegisterScreen.js
import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // ✅ After register success, go to employee setup screen
    navigate("/employee-setup");
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Register</h2>
        <input style={inputStyle} type="text" placeholder="Company Name" />
        <input style={inputStyle} type="email" placeholder="Email" />
        <input style={inputStyle} type="text" placeholder="Company ID" />
        <input style={inputStyle} type="password" placeholder="Password" />

        <button style={btnStyle} onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f1f5f9",
};

const cardStyle = {
  width: "400px",
  padding: "30px",
  borderRadius: "12px",
  background: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "100%",
  marginBottom: "10px",
};

const btnStyle = {
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%",
  cursor: "pointer",
};

export default RegisterScreen;

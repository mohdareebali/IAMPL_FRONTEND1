import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png"; // ✅ update path as needed

function ForgotPasswordScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  };

  const logoStyle = {
    width: "160px",
    marginBottom: "20px",
    opacity: 0.9,
  };

  const headingStyle = {
    marginBottom: "20px",
    color: "#0056b3",
    fontSize: "22px",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "100%",
    maxWidth: "300px",
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    maxWidth: "320px",
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4a90e2",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  };

  const handleGetOtp = () => {
    if (!employeeId) {
      alert("Please enter your Employee ID");
      return;
    }
    if (!email) {
      alert("Please enter your email");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    navigate("/forgot-password/otp", { state: { employeeId, email, newPassword } });
  };

  return (
    <div style={containerStyle}>
      {/* ✅ Logo */}
      <img src={logo} alt="Company Logo" style={logoStyle} />

      {/* ✅ Heading */}
      <h2 style={headingStyle}>Reset Password</h2>

      {/* ✅ Inputs */}
      <input
        style={inputStyle}
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <input
        style={inputStyle}
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* ✅ Buttons */}
      <button
        style={buttonStyle}
        onClick={handleGetOtp}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#3a78c2")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
      >
        Get OTP
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#5a6268")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
        onClick={() => navigate(-1)}
      >
        Back to Login
      </button>
    </div>
  );
}

export default ForgotPasswordScreen;

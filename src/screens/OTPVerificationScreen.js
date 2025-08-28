import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OTPVerificationScreen() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { employeeId, newPassword } = location.state || {};

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  };

  const inputStyle = {
    width: "250px",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "6px"
  };

  const buttonStyle = {
    width: "260px",
    padding: "10px",
    margin: "10px 0",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    // Here you would verify OTP with backend
    alert(`OTP verified! Password for Employee ID ${employeeId} is now changed.`);

    // Navigate back to login
    navigate("/login", { state: { role: "manager" } });
  };

  return (
    <div style={containerStyle}>
      <h2>Enter OTP</h2>
      <p>We sent an OTP to Employee ID: <strong>{employeeId}</strong></p>
      <input
        style={inputStyle}
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button style={buttonStyle} onClick={handleVerifyOtp}>
        Verify OTP
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
}

export default OTPVerificationScreen;
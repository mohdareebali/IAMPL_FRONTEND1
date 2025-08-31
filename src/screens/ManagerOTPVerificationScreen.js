// src/screens/ManagerOTPVerificationScreen.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ManagerOTPVerificationScreen() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { companyId, newPassword } = location.state || {};

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

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      // Call backend to verify OTP and reset password
      const response = await fetch("http://localhost:5000/api/manager/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, otp, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Redirect to manager login after successful password reset
        navigate("/login", { state: { role: "manager" } });
      } else {
        alert(data.error || "OTP verification failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Manager OTP Verification</h2>
      <p>We sent an OTP to Company ID: <strong>{companyId}</strong></p>
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

export default ManagerOTPVerificationScreen;

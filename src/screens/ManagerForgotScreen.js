// src/screens/ManagerForgotScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png";
import axios from "axios";

function ManagerForgotScreen() {
  const [identifier, setIdentifier] = useState(""); // Either Company ID or Email
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const logoStyle = { width: "160px", marginBottom: "20px", opacity: 0.9 };
  const headingStyle = { marginBottom: "20px", color: "#0056b3", fontSize: "22px", fontWeight: "bold" };
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

  // Strong password validation
  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!identifier) return alert("Please enter Company ID or Email");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    if (!isStrongPassword(newPassword)) {
      return alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (!@#$%^&*)");
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/manager/forgot-password", {
        identifier, // Send as identifier
      });
      alert(response.data.message);
      setStep(2); // Move to OTP verification
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter OTP");

    if (!isStrongPassword(newPassword)) {
      return alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (!@#$%^&*)");
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/manager/reset-password", {
        identifier,
        otp,
        newPassword,
      });
      alert(response.data.message);
      navigate("/login", { state: { role: "manager" } }); // Redirect to manager login
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <img src={logo} alt="Company Logo" style={logoStyle} />
      <h2 style={headingStyle}>Reset Password</h2>

      {step === 1 && (
        <>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter Company ID or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
          <button style={buttonStyle} onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button style={buttonStyle} onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP & Reset Password"}
          </button>
        </>
      )}

      <button
        style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
        onClick={() => navigate(-1)}
      >
        Back to Login
      </button>
    </div>
  );
}

export default ManagerForgotScreen;
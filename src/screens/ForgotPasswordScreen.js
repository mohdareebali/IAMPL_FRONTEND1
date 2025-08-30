import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png";
import axios from "axios";

function ForgotPasswordScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP
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

  const handleSendOtp = async () => {
    if (!employeeId) return alert("Please enter your Employee ID");
    if (!email) return alert("Please enter your email");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/employees/forgot-password", {
        employee_id: employeeId,
        email: email,
      });
      alert(response.data.message);
      setStep(2); // Move to OTP verification step
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter OTP");

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/employees/reset-password", {
        employee_id: employeeId,
        otp,
        newPassword,
      });
      alert(response.data.message);
      navigate("/login"); // Redirect to login after successful reset
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
          <button
            style={buttonStyle}
            onClick={handleSendOtp}
            disabled={loading}
          >
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
          <button
            style={buttonStyle}
            onClick={handleVerifyOtp}
            disabled={loading}
          >
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

export default ForgotPasswordScreen;

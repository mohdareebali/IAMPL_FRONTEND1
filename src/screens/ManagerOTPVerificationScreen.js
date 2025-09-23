// src/screens/ManagerOTPVerificationScreen.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png";

function ManagerOTPVerificationScreen() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // ✅ inline feedback
  const [messageType, setMessageType] = useState("info"); // "success" | "error" | "info"

  const location = useLocation();
  const navigate = useNavigate();

  const { companyId, newPassword } = location.state || {};

  // Styles
  const page = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "linear-gradient(90deg, #ffffff 0%, #f6fbff 100%)",
    fontFamily: "Arial, sans-serif",
  };

  const card = {
    width: "100%",
    maxWidth: 520,
    padding: 32,
    borderRadius: 10,
    background: "#fff",
    border: "2px dashed rgba(0,0,0,0.12)",
    boxShadow: "0 8px 28px rgba(13,71,161,0.03)",
    textAlign: "center",
  };

  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d0d0d0",
    fontSize: 14,
    marginBottom: 12,
    boxSizing: "border-box",
  };

  const primaryBtn = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#184f9b",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  };

  const secondaryBtn = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#6c757d",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 10,
  };

  const msgBox = {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 6,
    fontSize: 14,
    textAlign: "center",
  };

  const getMsgStyle = () => {
    switch (messageType) {
      case "success":
        return { ...msgBox, background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7" };
      case "error":
        return { ...msgBox, background: "#ffebee", color: "#c62828", border: "1px solid #ef9a9a" };
      default:
        return { ...msgBox, background: "#e3f2fd", color: "#1565c0", border: "1px solid #90caf9" };
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessageType("error");
      setMessage("Please enter OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/manager/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage(data.message || "Password reset successful!");
        setTimeout(() => {
          navigate("/login", { state: { role: "manager" } });
        }, 1200); // auto-redirect after 1.2s
      } else {
        setMessageType("error");
        setMessage(data.error || "OTP verification failed.");
      }
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!companyId) {
      setMessageType("error");
      setMessage("Company ID unavailable to resend OTP.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/api/manager/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: companyId }),
      });
      const json = await resp.json();
      setMessageType("success");
      setMessage(json.message || "OTP resent successfully.");
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <img src={logo} alt="Company Logo" style={{ width: 84, marginBottom: 12 }} />
        <h2 style={{ fontSize: 20, fontWeight: "700", color: "#263245" }}>Manager OTP Verification</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>
          Enter the one-time password sent to your registered contact.
        </p>
        <p style={{ fontSize: 13, color: "#444" }}>
          We sent an OTP for <strong>{companyId || "N/A"}</strong>
        </p>

        <input
          style={input}
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          inputMode="numeric"
          maxLength={8}
        />

        <button
          style={primaryBtn}
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          style={secondaryBtn}
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <p style={{ fontSize: 13, marginTop: 14 }}>
          Didn't receive OTP?{" "}
          <button
            onClick={handleResend}
            style={{
              background: "transparent",
              border: "none",
              color: "#1565c0",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
            }}
          >
            Resend
          </button>
        </p>

        {message && <div style={getMsgStyle()}>{message}</div>}
      </div>
    </div>
  );
}

export default ManagerOTPVerificationScreen;

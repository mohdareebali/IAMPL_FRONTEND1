// src/screens/ForgotPasswordScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState(""); // Employee ID or Email
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0); // countdown in seconds
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  // Strong password validation
  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!identifier) return alert("Please enter your Employee ID or Email");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    if (!isStrongPassword(newPassword)) {
      return alert(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (!@#$%^&*)"
      );
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/employees/forgot-password", {
        identifier,
      });
      alert(response.data.message || "OTP sent");
      setStep(2);
      setOtpSent(true);
      setTimeLeft(60); // 60s countdown
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
      return alert(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (!@#$%^&*)"
      );
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/employees/reset-password", {
        identifier,
        otp,
        newPassword,
      });
      alert(response.data.message || "Password reset successful");
      navigate("/login", { state: { role: "employee" } });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    await handleSendOtp();
  };

  // ---------- Styles ----------
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
    background: "linear-gradient(90deg, #ffffff 0%, #f6fbff 100%)",
    fontFamily: "Arial, sans-serif",
    color: "#222",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 520,
    padding: 36,
    borderRadius: 8,
    background: "#fff",
    border: "2px dashed rgba(0,0,0,0.12)",
    boxShadow: "0 8px 28px rgba(13,71,161,0.03)",
    boxSizing: "border-box",
    textAlign: "center",
  };

  const logoStyle = { width: 120, display: "block", margin: "6px auto 12px" };
  const titleStyle = { fontSize: 20, fontWeight: 700, margin: "6px 0 4px", color: "#263245" };
  const subtitleStyle = { fontSize: 13, color: "#6b6b6b", marginBottom: 14 };

  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d0d0d0",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const inputWrapper = { width: "100%", marginTop: 12, textAlign: "left" };
  const labelStyle = { fontSize: 13, color: "#333", marginBottom: 6, display: "block" };

  const primaryBtn = {
    marginTop: 16,
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

  const mutedBtn = {
    marginTop: 12,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#6c757d",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  };

  const resendBtn = {
    marginTop: 10,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#f39c12",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  };

  const smallText = { fontSize: 13, color: "#333", marginTop: 10, textAlign: "center" };

  const responsiveCss = `
    @media (max-width: 560px) {
      .fp-card { padding: 20px; }
      .fp-title { font-size: 18px; }
    }
  `;

  return (
    <div style={pageStyle}>
      <style>{responsiveCss}</style>

      <div style={cardStyle} className="fp-card" role="main" aria-labelledby="fp-title">
        {/* ✅ Updated IAMPL Logo */}
        <img
          src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.webp"
          alt="IAMPL Logo"
          style={logoStyle}
        />
        <div id="fp-title" style={titleStyle}>
          Reset Password
        </div>
        <div style={subtitleStyle}>Use OTP to verify and set a new password</div>

        {step === 1 && (
          <>
            <div style={inputWrapper}>
              <label style={labelStyle}>Employee ID or Email</label>
              <input
                style={input}
                type="text"
                placeholder="Enter Employee ID or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div style={inputWrapper}>
              <label style={labelStyle}>New Password</label>
              <input
                style={input}
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={inputWrapper}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                style={input}
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button style={primaryBtn} onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={inputWrapper}>
              <label style={labelStyle}>Enter OTP</label>
              <input
                style={input}
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button style={primaryBtn} onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP & Reset Password"}
            </button>

            {otpSent && timeLeft > 0 ? (
              <div style={smallText}>⏳ Resend OTP in {timeLeft}s</div>
            ) : (
              <button style={resendBtn} onClick={handleResendOtp} disabled={loading}>
                Resend OTP
              </button>
            )}
          </>
        )}

        <button style={mutedBtn} onClick={() => navigate(-1)}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordScreen;

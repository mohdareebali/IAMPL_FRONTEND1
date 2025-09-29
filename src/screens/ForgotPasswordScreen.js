// src/screens/ForgotPasswordScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState(""); // Email or Employee ID
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "success" | "error" | "info"
  const navigate = useNavigate();

  const showMessage = (text, type = "info", timeout = 6000) => {
    setMessage(text);
    setMessageType(type);
    if (timeout) setTimeout(() => setMessage(""), timeout);
  };

  const handleSendCode = async () => {
    const value = identifier.trim();
    if (!value) {
      showMessage("Please enter your Email Address or Employee ID", "error");
      return;
    }

    setLoading(true);
    try {
      // Request backend to send OTP only if identifier exists
      // Expected backend behavior:
      //  - 200 OK + { message, email? } -> OTP sent
      //  - 4xx -> identifier not found or validation error
      const res = await axios.post("http://localhost:5000/api/employees/forgot-password", {
        identifier: value,
      });

      // Show success message
      showMessage(res.data.message || "Verification code sent to your email", "success", 4000);

      // Prefer email returned by backend
      let emailToPass = res.data?.email || "";

      // If backend didn't return an email and identifier is not an email,
      // try to resolve the employee's email via GET /api/employees as a fallback.
      // (Your backend exposes /api/employees that returns the list.)
      if (!emailToPass && value && !value.includes("@")) {
        try {
          const empRes = await axios.get("http://localhost:5000/api/employees");
          const list = empRes.data || [];
          const found = list.find(
            (it) =>
              (it.employee_id && it.employee_id.toString() === value.toString()) ||
              (it.email && it.email.toString() === value.toString())
          );
          if (found && found.email) {
            emailToPass = found.email;
          }
        } catch (errFetch) {
          // ignore error - we'll fallback to showing identifier
          console.warn("Failed to resolve email for identifier:", errFetch);
        }
      }

      // Navigate to OTP verification screen, pass identifier and email if resolved by backend or lookup
      navigate("/forgot-password/otp", {
        state: { identifier: value, email: emailToPass || value },
      });
    } catch (err) {
      console.error("Forgot password error:", err);

      // Prefer backend error message when available
      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.response?.status === 404
          ? "No account found with that identifier."
          : "Failed to send code. Please try again.");

      showMessage(errMsg, "error", 7000);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Styles (match the provided screenshot) ----------
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
    background: "#fff",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 520,
    padding: 36,
    borderRadius: 8,
    background: "#fff",
    border: "2px dashed rgba(15,23,42,0.25)",
    boxShadow: "0 8px 28px rgba(13,71,161,0.03)",
    boxSizing: "border-box",
    textAlign: "center",
  };

  const iconWrapper = { display: "block", margin: "0 auto 12px" };
  const titleStyle = { fontSize: 20, fontWeight: 700, margin: "6px 0 6px", color: "#0f172a" };
  const subtitleStyle = {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 18,
    maxWidth: 440,
    marginLeft: "auto",
    marginRight: "auto",
  };

  const inputWrapper = { width: "100%", marginTop: 6, textAlign: "left" };
  const labelStyle = { fontSize: 14, color: "#0f172a", marginBottom: 6, display: "block" };
  const redAsterisk = { color: "#ef4444", marginRight: 6 };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d0d0d0",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const primaryBtn = {
    marginTop: 18,
    width: "100%",
    padding: "14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#184f9b",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.9 : 1,
  };

  const backBtn = {
    marginTop: 14,
    background: "transparent",
    border: "none",
    color: "#1d4ed8",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: 14,
  };

  const msgBase = {
    marginTop: 14,
    padding: "10px",
    borderRadius: 6,
    fontSize: 14,
    textAlign: "center",
  };
  const msgStyles = {
    info: { ...msgBase, background: "#eef6ff", color: "#084b9b", border: "1px solid #cfe6ff" },
    success: { ...msgBase, background: "#e6f4ea", color: "#1b7a3a", border: "1px solid #b7e0bf" },
    error: { ...msgBase, background: "#fff1f0", color: "#a11", border: "1px solid #f5c6c6" },
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle} role="main" aria-labelledby="fp-title">
        <div style={iconWrapper} aria-hidden>
          {/* lock icon */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            style={{ display: "block", margin: "0 auto" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="10" width="12" height="8" rx="1.5" stroke="#374151" strokeWidth="1.5" fill="none" />
            <path d="M8 10V8a4 4 0 018 0v2" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="14" r="0.8" fill="#374151" />
          </svg>
        </div>

        <h1 id="fp-title" style={titleStyle}>
          Forgot Password
        </h1>

        <p style={subtitleStyle}>
          Enter the email address with your account and we’ll send an email with confirmation to reset your password.
        </p>

        <div style={inputWrapper}>
          <label style={labelStyle}>
            <span style={redAsterisk}>*</span>Email Address
          </label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter your Email Address"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            aria-label="Email or Employee ID"
          />
        </div>

        <button style={primaryBtn} onClick={handleSendCode} disabled={loading}>
          {loading ? "Sending..." : "Send Code"}
        </button>

        <button style={backBtn} onClick={() => navigate("/login", { state: { role: "employee" } })}>
          ‹ Back to Login
        </button>

        {message && <div aria-live="polite" style={msgStyles[messageType] || msgStyles.info}>{message}</div>}
      </div>
    </div>
  );
}

export default ForgotPasswordScreen;

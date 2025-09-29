// src/screens/ResetPassword.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // identifier (employee_id or email) + optional otp passed from OTP screen
  const identifier = location.state?.identifier || "";
  const passedOtp = location.state?.otp ?? null;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "success" | "error"

  useEffect(() => {
    if (!identifier) {
      setMessage("Missing identifier. Redirecting to Forgot Password.", "error");
      setTimeout(() => navigate("/forgot-password"), 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMsg = (txt, type = "info", ms = 5000) => {
    setMessage(txt);
    setMessageType(type);
    if (ms) setTimeout(() => setMessage(""), ms);
  };

  // validation rules
  const rules = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    case: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
  };

  const allGood = Object.values(rules).every(Boolean) && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMsg("Passwords do not match", "error");
      return;
    }

    if (!Object.values(rules).every(Boolean)) {
      showMsg("Password does not meet the requirements", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = { identifier, otp: passedOtp, newPassword };
      const res = await axios.post("http://localhost:5000/api/employees/reset-password", payload);

      showMsg(res.data.message || "Password reset successful", "success", 4000);

      setTimeout(() => {
        navigate("/login", { state: { role: "employee" } });
      }, 900);
    } catch (err) {
      console.error("Reset error:", err);
      const errMsg = err?.response?.data?.error || "Failed to reset password";
      showMsg(errMsg, "error", 6000);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Styles ----------
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "#fff",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 640,
    padding: 36,
    borderRadius: 8,
    background: "#fff",
    border: "2px dashed rgba(15,23,42,0.25)",
    boxShadow: "0 8px 28px rgba(13,71,161,0.03)",
    textAlign: "left",
    boxSizing: "border-box",
  };

  const center = { display: "flex", justifyContent: "center" };
  const titleStyle = { fontSize: 20, fontWeight: 700, margin: "6px 0", color: "#0f172a", textAlign: "center" };
  const subtitleStyle = { fontSize: 14, color: "#6b7280", marginBottom: 18, textAlign: "center" };

  const label = { marginBottom: 8, display: "block", fontSize: 14, color: "#0f172a" };
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const btnPrimary = {
    marginTop: 18,
    width: "100%",
    padding: "14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#184f9b",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: allGood && !loading ? "pointer" : "not-allowed",
    opacity: allGood && !loading ? 1 : 0.75,
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

  const checklistItem = (ok) => ({
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: ok ? "#1b7a3a" : "#374151",
    marginBottom: 6,
  });

  const msgBase = { marginTop: 14, padding: "10px", borderRadius: 6, fontSize: 14, textAlign: "center" };
  const msgStyles = {
    info: { ...msgBase, background: "#eef6ff", color: "#084b9b", border: "1px solid #cfe6ff" },
    success: { ...msgBase, background: "#e6f4ea", color: "#1b7a3a", border: "1px solid #b7e0bf" },
    error: { ...msgBase, background: "#fff1f0", color: "#a11", border: "1px solid #f5c6c6" },
  };

  const eyeBtnStyle = {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
  };

  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="20" width="20" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 
           0 8.268 2.943 9.542 7-1.274 4.057-5.065 
           7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeSlashIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="20" width="20" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 
           0-8.268-2.943-9.542-7a9.956 
           9.956 0 012.262-3.592m3.873-2.471A9.953 
           9.953 0 0112 5c4.477 0 8.268 
           2.943 9.542 7a9.956 9.956 
           0 01-4.132 5.411M15 12a3 3 
           0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M3 3l18 18" />
    </svg>
  );

  // The requested small rounded rectangle with three dots icon (used for header)
  const ThreeDotsRoundedRect = (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="28" viewBox="0 0 34 28" fill="none" aria-hidden>
      {/* rounded rect outline */}
      <rect x="1.2" y="1.2" width="31.6" height="25.6" rx="5" stroke="#374151" strokeWidth="1.8" fill="none" />
      {/* three dots centered horizontally */}
      <circle cx="11.5" cy="14" r="1.6" fill="#374151" />
      <circle cx="17" cy="14" r="1.6" fill="#374151" />
      <circle cx="22.5" cy="14" r="1.6" fill="#374151" />
    </svg>
  );

  return (
    <div style={pageStyle}>
      <div style={cardStyle} role="main" aria-labelledby="rp-title">
        <div style={center}>
          <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            {/* Header icon: small rounded rectangle with three dots */}
            <div aria-hidden>{ThreeDotsRoundedRect}</div>
          </div>
        </div>

        <h1 id="rp-title" style={titleStyle}>Create New Password</h1>
        <p style={subtitleStyle}>This password should be different from the previous password.</p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={{ marginBottom: 12 }}>
            <label style={label}><span style={{ color: "#ef4444", marginRight: 6 }}>*</span>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={inputStyle}
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={eyeBtnStyle}
                aria-label="Toggle new password visibility"
              >
                {showNew ? EyeIcon : EyeSlashIcon}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 12 }}>
            <label style={label}><span style={{ color: "#ef4444", marginRight: 6 }}>*</span>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={inputStyle}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={eyeBtnStyle}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? EyeIcon : EyeSlashIcon}
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ marginTop: 6, marginLeft: 6 }}>
            <div style={checklistItem(rules.length)}> <span>✔</span> At least 8 characters</div>
            <div style={checklistItem(rules.number)}> <span>✔</span> At least 1 number</div>
            <div style={checklistItem(rules.special)}> <span>✔</span> At least 1 special character</div>
            <div style={checklistItem(rules.case)}> <span>✔</span> Both upper and lower case letters</div>
          </div>

          {message && <div style={msgStyles[messageType] || msgStyles.info}>{message}</div>}

          <button style={btnPrimary} type="submit" disabled={!allGood || loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <button style={backBtn} onClick={() => navigate("/login", { state: { role: "employee" } })}>
            ‹ Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

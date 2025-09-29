// src/screens/ManagerOTPVerificationScreen.js
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ManagerOTPVerificationScreen
 *
 * - Expects location.state = { identifier, email }
 * - POST /api/manager/verify-otp  -> { message }
 * - POST /api/manager/resend-otp  -> { message }
 * - On successful verify -> navigate to /manager-reset-password with { identifier, otp, email }
 *
 * Styling intentionally mirrors ManagerForgotScreen for consistency.
 */

function ManagerOTPVerificationScreen() {
  const DIGITS = 5; // OTP length
  const [otp, setOtp] = useState(Array(DIGITS).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "success" | "error"

  const location = useLocation();
  const navigate = useNavigate();

  // identifier + email come from previous screen
  const identifier = location.state?.identifier || "";
  const email = location.state?.email || identifier;

  // input refs for focus management
  const inputRefs = useRef([]);
  if (!inputRefs.current) inputRefs.current = [];

  useEffect(() => {
    // if user somehow lands here without identifier, send them back
    if (!identifier) {
      navigate("/manager-forgot", { replace: true });
      return;
    }

    // focus first empty input
    setTimeout(() => {
      const firstEmpty = otp.findIndex((d) => !d);
      const focusIdx = firstEmpty === -1 ? DIGITS - 1 : firstEmpty;
      const el = inputRefs.current[focusIdx];
      if (el && typeof el.focus === "function") el.focus();
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier, navigate]);

  const showMessage = (text, type = "info", timeout = 6000) => {
    setMessage(text);
    setMessageType(type);
    if (timeout) setTimeout(() => setMessage(""), timeout);
  };

  const handleChange = (val, idx) => {
    // allow only single digit numbers or empty
    const digit = val.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);

    if (digit && idx < DIGITS - 1) {
      const nextEl = inputRefs.current[idx + 1];
      if (nextEl && typeof nextEl.focus === "function") nextEl.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otp[idx]) {
        // clear current
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        // move to previous and clear it
        const prevEl = inputRefs.current[idx - 1];
        if (prevEl && typeof prevEl.focus === "function") prevEl.focus();
        const copy = [...otp];
        copy[idx - 1] = "";
        setOtp(copy);
      }
      e.preventDefault();
      return;
    }

    if (key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1] && inputRefs.current[idx - 1].focus();
      e.preventDefault();
      return;
    }
    if (key === "ArrowRight" && idx < DIGITS - 1) {
      inputRefs.current[idx + 1] && inputRefs.current[idx + 1].focus();
      e.preventDefault();
      return;
    }
  };

  // handle paste of full OTP
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("Text") || "";
    const digits = pasted.replace(/\D/g, "").slice(0, DIGITS).split("");
    if (digits.length === 0) return;
    const next = Array(DIGITS).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtp(next);

    setTimeout(() => {
      const firstEmpty = next.findIndex((d) => !d);
      const idx = firstEmpty === -1 ? DIGITS - 1 : firstEmpty;
      const el = inputRefs.current[idx];
      if (el && typeof el.focus === "function") el.focus();
    }, 0);

    e.preventDefault();
  };

  const isComplete = otp.join("").length === DIGITS;

  const handleVerify = async () => {
    if (!isComplete) {
      showMessage(`Please enter the complete ${DIGITS}-digit code.`, "error");
      return;
    }

    const code = otp.join("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/manager/verify-otp", {
        identifier,
        otp: code,
      });

      showMessage(res.data?.message || "OTP verified successfully.", "success", 2000);

      // navigate to the manager reset-password screen and pass identifier + otp + email
      setTimeout(() => {
        navigate("/manager-reset-password", { state: { identifier, otp: code, email } });
      }, 500);
    } catch (err) {
      console.error("OTP verify error:", err);
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || "Invalid code. Please try again.";
      showMessage(errMsg, "error", 6000);

      // clear inputs and focus first
      setOtp(Array(DIGITS).fill(""));
      setTimeout(() => {
        const first = inputRefs.current[0];
        if (first && typeof first.focus === "function") first.focus();
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/manager/resend-otp", { identifier });
      showMessage(res.data?.message || "Verification code resent.", "success", 4000);

      // clear inputs and focus first
      setOtp(Array(DIGITS).fill(""));
      setTimeout(() => {
        const first = inputRefs.current[0];
        if (first && typeof first.focus === "function") first.focus();
      }, 0);
    } catch (err) {
      console.error("Resend OTP error:", err);
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || "Failed to resend code. Please try again.";
      showMessage(errMsg, "error", 6000);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Styles (match ManagerForgotScreen) ---------- */
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
    maxWidth: 520,
    padding: 36,
    borderRadius: 8,
    background: "#fff",
    border: "2px dashed rgba(15,23,42,0.25)",
    boxShadow: "0 8px 28px rgba(13,71,161,0.03)",
    textAlign: "center",
  };

  const titleStyle = { fontSize: 20, fontWeight: 700, margin: "6px 0", color: "#0f172a" };
  const subtitleStyle = { fontSize: 14, color: "#6b7280", marginBottom: 18, maxWidth: 420, marginLeft: "auto", marginRight: "auto" };

  const otpBoxWrapper = { display: "flex", justifyContent: "center", gap: 10, marginBottom: 12 };
  const otpBox = {
    width: 48,
    height: 48,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 18,
    lineHeight: "48px",
    padding: 0,
  };

  const linkStyle = {
    color: "#1d4ed8",
    fontSize: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
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
    cursor: isComplete && !loading ? "pointer" : "not-allowed",
    opacity: isComplete && !loading ? 1 : 0.75,
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

  const msgBase = { marginTop: 14, padding: "10px", borderRadius: 6, fontSize: 14, textAlign: "center" };
  const msgStyles = {
    info: { ...msgBase, background: "#eef6ff", color: "#084b9b", border: "1px solid #cfe6ff" },
    success: { ...msgBase, background: "#e6f4ea", color: "#1b7a3a", border: "1px solid #b7e0bf" },
    error: { ...msgBase, background: "#fff1f0", color: "#a11", border: "1px solid #f5c6c6" },
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div aria-hidden style={{ marginBottom: 12 }}>
          {/* Envelope icon */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16v12H4z" stroke="#374151" strokeWidth="1.5" fill="none" />
            <path d="M4 6l8 6 8-6" stroke="#374151" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <h1 style={titleStyle}>OTP Code Verification</h1>
        <p style={subtitleStyle}>
          A verification code was sent to <strong>{email}</strong>. Enter the {DIGITS}-digit code below to continue.
        </p>

        <div style={otpBoxWrapper} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              ref={(el) => (inputRefs.current[i] = el)}
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={otpBox}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
          Didn’t receive the code?{" "}
          <button style={linkStyle} onClick={handleResend} disabled={loading} aria-disabled={loading}>
            Resend code
          </button>
        </div>

        <button
          style={primaryBtn}
          onClick={handleVerify}
          disabled={!isComplete || loading}
          aria-disabled={!isComplete || loading}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <button style={backBtn} onClick={() => navigate("/login", { state: { role: "manager" } })}>
          ‹ Back to Login
        </button>

        {message && <div aria-live="polite" style={msgStyles[messageType] || msgStyles.info}>{message}</div>}
      </div>
    </div>
  );
}

export default ManagerOTPVerificationScreen;

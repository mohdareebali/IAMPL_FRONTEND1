// src/screens/OTPVerificationScreen.js
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OTPVerificationScreen() {
  const DIGITS = 5;
  const [otp, setOtp] = useState(Array(DIGITS).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "success" | "error"

  const location = useLocation();
  const navigate = useNavigate();

  // identifier passed from previous screen (email or employee id)
  const identifier = location.state?.identifier || "";

  // prefer explicit email passed in state; otherwise try to resolve it
  const initialEmail = location.state?.email || "";
  const [displayEmail, setDisplayEmail] = useState(initialEmail);

  // useRef for storing input elements; make defensive to avoid undefined
  const inputRefs = useRef(null);
  if (inputRefs.current == null) {
    inputRefs.current = [];
  }

  useEffect(() => {
    // if we already have an email (passed in state or identifier is an email), use that
    if (initialEmail) {
      setDisplayEmail(initialEmail);
      return;
    }
    if (identifier && identifier.includes("@")) {
      // identifier itself is an email
      setDisplayEmail(identifier);
      return;
    }

    // otherwise attempt to fetch the employee record and find the email
    // fallback: GET /api/employees returns all employees (your backend has this endpoint)
    // then match employee.employee_id === identifier (or email === identifier)
    let mounted = true;
    const resolveEmail = async () => {
      if (!identifier) return;
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        if (!mounted) return;
        const list = res.data || [];
        const found = list.find(
          (item) =>
            (item.employee_id && item.employee_id.toString() === identifier.toString()) ||
            (item.email && item.email.toString() === identifier.toString())
        );
        if (found && found.email) {
          setDisplayEmail(found.email);
        } else {
          // nothing found, leave blank so fallback will display identifier
          setDisplayEmail("");
        }
      } catch (err) {
        // ignore errors (network or CORS); we'll fallback to identifier
        setDisplayEmail("");
      }
    };
    resolveEmail();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  useEffect(() => {
    // focus first empty input after mount (use setTimeout to allow refs to attach)
    setTimeout(() => {
      const firstEmpty = otp.findIndex((d) => !d);
      const idx = firstEmpty === -1 ? DIGITS - 1 : firstEmpty;
      const el = inputRefs.current && inputRefs.current[idx];
      if (el && typeof el.focus === "function") el.focus();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (text, type = "info", ms = 5000) => {
    setMessage(text);
    setMessageType(type);
    if (ms) setTimeout(() => setMessage(""), ms);
  };

  const handleChange = (val, idx) => {
    // allow only digits or empty
    if (val && !/^\d$/.test(val)) return;

    const next = [...otp];
    next[idx] = val;
    setOtp(next);

    if (val && idx < DIGITS - 1) {
      const nextEl = inputRefs.current && inputRefs.current[idx + 1];
      if (nextEl && typeof nextEl.focus === "function") nextEl.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otp[idx]) {
        // if current has value, clear it
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        // move focus to previous and clear it
        const prevEl = inputRefs.current && inputRefs.current[idx - 1];
        if (prevEl && typeof prevEl.focus === "function") {
          prevEl.focus();
          const copy = [...otp];
          copy[idx - 1] = "";
          setOtp(copy);
        }
      }
      e.preventDefault();
      return;
    }

    // left / right arrow navigation
    if (key === "ArrowLeft" && idx > 0) {
      inputRefs.current && inputRefs.current[idx - 1] && inputRefs.current[idx - 1].focus();
      e.preventDefault();
      return;
    }
    if (key === "ArrowRight" && idx < DIGITS - 1) {
      inputRefs.current && inputRefs.current[idx + 1] && inputRefs.current[idx + 1].focus();
      e.preventDefault();
      return;
    }
  };

  // handle paste (allow pasting full code)
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("Text").trim();
    if (!pasted) return;
    const digits = pasted.replace(/\D/g, "").slice(0, DIGITS).split("");
    if (digits.length === 0) return;
    const next = Array(DIGITS).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtp(next);
    // focus next empty or last
    setTimeout(() => {
      const firstEmpty = next.findIndex((d) => !d);
      const idx = firstEmpty === -1 ? DIGITS - 1 : firstEmpty;
      const el = inputRefs.current && inputRefs.current[idx];
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
      // backend endpoint: /api/employees/verify-otp
      const res = await axios.post("http://localhost:5000/api/employees/verify-otp", {
        identifier,
        otp: code,
      });

      showMessage(res.data.message || "OTP verified successfully.", "success", 2000);

      // on success, navigate to create new password page and pass identifier
      setTimeout(() => {
        navigate("/reset-password", { state: { identifier, otp: code } });
      }, 600);
    } catch (err) {
      console.error("OTP verify error:", err);
      const errMsg = err?.response?.data?.error || "Invalid code. Please try again.";
      showMessage(errMsg, "error", 6000);
      // clear inputs for security / usability
      setOtp(Array(DIGITS).fill(""));
      // focus first input again (allow refs to be present)
      setTimeout(() => {
        const first = inputRefs.current && inputRefs.current[0];
        if (first && typeof first.focus === "function") first.focus();
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/employees/forgot-password", { identifier });
      showMessage("A new code has been sent to your email.", "success");
      // clear inputs
      setOtp(Array(DIGITS).fill(""));
      setTimeout(() => {
        const first = inputRefs.current && inputRefs.current[0];
        if (first && typeof first.focus === "function") first.focus();
      }, 0);
    } catch (err) {
      console.error("Resend error:", err);
      showMessage("Failed to resend code. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Styles (same look as screenshot) ----------
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

  const iconWrapper = { display: "block", margin: "0 auto 12px" };
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
        <div style={iconWrapper} aria-hidden>
          {/* Envelope Icon */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16v12H4z" stroke="#374151" strokeWidth="1.5" fill="none" />
            <path d="M4 6l8 6 8-6" stroke="#374151" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <h1 style={titleStyle}>OTP Code Verification</h1>
        <p style={subtitleStyle}>
          A verification code was sent to <strong>{displayEmail || identifier}</strong>. Enter the {DIGITS}-digit code below to continue.
        </p>

        <div style={otpBoxWrapper} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              ref={(el) => {
                inputRefs.current = inputRefs.current || [];
                inputRefs.current[i] = el;
              }}
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value.replace(/\D/g, ""), i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={otpBox}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
          Didn’t receive any code?{" "}
          <button style={linkStyle} onClick={handleResend} disabled={loading}>
            Resend code
          </button>
        </div>

        <button
          style={primaryBtn}
          onClick={handleVerify}
          disabled={!isComplete || loading}
          aria-disabled={!isComplete || loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button style={backBtn} onClick={() => navigate("/login", { state: { role: "employee" } })}>
          ‹ Back to Login
        </button>

        {message && <div style={msgStyles[messageType] || msgStyles.info}>{message}</div>}
      </div>
    </div>
  );
}

export default OTPVerificationScreen;

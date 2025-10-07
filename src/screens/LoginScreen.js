// src/screens/LoginScreen.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// ✅ Import Material UI eye icons
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function LoginScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authorize, setAuthorize] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "employee";

  const handleLogin = async () => {
    if (!authorize) {
      setMessage("⚠️ Please authorize before login");
      setMessageType("error");
      return;
    }

    if (!id || !password) {
      setMessage("⚠️ Please enter ID or Email and Password");
      setMessageType("error");
      return;
    }

    try {
      let endpoint = "";
      let payload = {};

      if (role === "manager") {
        endpoint = "http://localhost:5000/api/login";
        payload = { id, password };
      } else {
        endpoint = "http://localhost:5000/api/employees/login";
        payload = { identifier: id, password };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "✅ Login successful!");
        setMessageType("success");

        setTimeout(() => {
          if (role === "manager") {
            navigate("/dashboard/manager", { state: { company: data.company } });
          } else {
            navigate("/dashboard/employee", { state: { employee: data.employee } });
          }
        }, 800);
      } else {
        setMessage(data.error || "❌ Invalid credentials");
        setMessageType("error");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    }
  };

  const handleRegister = () => {
    if (role === "manager") {
      navigate("/register", { state: { role: "manager" } });
    } else {
      setMessage("Only managers can register new companies!");
      setMessageType("error");
    }
  };

  const handleForgotPassword = () => {
    if (role === "manager") {
      navigate("/manager-forgot", { state: { role: "manager" } });
    } else {
      navigate("/forgot-password", { state: { role: "employee" } });
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={card}>
        {/* Role-specific icon */}
        <img
          src={role === "manager" ? "/manager-1.png" : "/employee-1.png"}
          alt={role === "manager" ? "Manager Icon" : "Employee Icon"}
          style={roleIconStyle}
        />

        <h2 style={title}>
          {role === "employee" ? "Employee Login" : "Manager Login"}
        </h2>
        <p style={subtitle}>Sign in to your account</p>

        {/* ID / Email */}
        <label style={label}>
          <span style={asterisk}>*</span>{" "}
          {role === "employee" ? "Employee ID/ Email Address" : "Company ID/ Email Address"}
        </label>
        <div style={inputWrap}>
          <input
            style={input}
            type="text"
            placeholder={`Enter your ${
              role === "employee" ? "Employee ID/ Email Address" : "company ID/ Email Address"
            }`}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        {/* Password */}
        <label style={{ ...label, marginTop: 6 }}>
          <span style={asterisk}>*</span> Password
        </label>
        <div style={inputWrap}>
          <input
            style={{ ...input, paddingRight: 44 }}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 👁️ Eye toggle (MUI icons) */}
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            style={eyeBtn}
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon style={{ fontSize: 20, color: "#374151" }} />
            ) : (
              <VisibilityOutlinedIcon style={{ fontSize: 20, color: "#374151" }} />
            )}
          </button>
        </div>

        {/* Forgot password aligned right */}
        <div style={forgotWrap}>
          <button style={forgotLink} onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        </div>

        {/* Authorize checkbox */}
        <div style={authorizeWrap}>
          <label style={authorizeLabel}>
            <input
              type="checkbox"
              checked={authorize}
              onChange={() => setAuthorize((v) => !v)}
              style={checkbox}
            />
            <span style={{ marginLeft: 8 }}>
              Authorize {role === "employee" ? "Employee" : "Manager"}
            </span>
          </label>
        </div>

        {/* Login button */}
        <button
          style={{
            ...loginBtn,
            backgroundColor: authorize ? "#184f9b" : "#9ca3af",
            cursor: authorize ? "pointer" : "not-allowed",
          }}
          onClick={handleLogin}
          disabled={!authorize}
        >
          Login
        </button>

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: 12,
              padding: "10px",
              borderRadius: 6,
              fontSize: 14,
              textAlign: "center",
              background: messageType === "error" ? "#fee2e2" : "#dcfce7",
              color: messageType === "error" ? "#b91c1c" : "#166534",
              border: `1px solid ${messageType === "error" ? "#fca5a5" : "#86efac"}`,
            }}
          >
            {message}
          </div>
        )}

        {role === "manager" && (
          <p style={{ marginTop: 8, textAlign: "center" }}>
            Don’t have an account?{" "}
            <button style={link} onClick={handleRegister}>
              Sign Up
            </button>
          </p>
        )}

        {/* Back button */}
        <div style={backWrap}>
          <button onClick={handleBack} style={backContainer}>
            <span style={backArrow}>‹</span>
            <span style={backText}>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#fff",
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  padding: 20,
};

const card = {
  width: 380,
  padding: 28,
  border: "1px dashed #9ca3af", // ✅ dashed border
  borderRadius: 8,
  background: "#fff",
  textAlign: "left",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
};

const roleIconStyle = {
  display: "block",
  margin: "0 auto 12px",
  width: 56,
  height: 56,
  objectFit: "contain",
};

const title = { textAlign: "center", margin: "6px 0 4px", color: "#0f172a", fontSize: 18, fontWeight: 700 };
const subtitle = {
  textAlign: "center",
  margin: "0 0 18px",
  fontSize: 14,
  color: "#6b7280",
};

const label = { fontSize: 14, marginBottom: 6, display: "block", color: "#0f172a" };
const asterisk = { color: "#ef4444", marginRight: 4, fontWeight: 700 };

const inputWrap = { position: "relative", marginBottom: 12 };
const input = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const eyeBtn = {
  position: "absolute",
  right: 8,
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

const forgotWrap = { display: "flex", justifyContent: "flex-end", marginBottom: 8 };
const forgotLink = {
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  color: "#111827",
  fontSize: 13,
  cursor: "pointer",
};

const authorizeWrap = { display: "flex", alignItems: "center", margin: "8px 0 12px" };
const authorizeLabel = { display: "flex", alignItems: "center", cursor: "pointer", color: "#0f172a", fontSize: 14 };
const checkbox = { width: 16, height: 16 };

const loginBtn = {
  width: "100%",
  padding: "14px 18px",
  color: "#fff",
  fontWeight: 700,
  fontSize: 16,
  border: "none",
  borderRadius: 8,
  marginTop: 6,
};

const link = {
  background: "transparent",
  border: "none",
  color: "#1d4ed8",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 13,
};

const backWrap = { marginTop: 14, textAlign: "center" };
const backContainer = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  border: "none",
  cursor: "pointer",
};
const backArrow = { color: "#1f2937", fontSize: 18 };
const backText = { color: "#1d4ed8", fontSize: 14, textDecoration: "underline" };

export default LoginScreen;

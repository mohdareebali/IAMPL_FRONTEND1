// src/screens/LoginScreen.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LoginScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "employee";

  // 🔹 Logic unchanged
  const handleLogin = async () => {
    if (!id || !password) {
      alert("Please enter ID or Email and Password");
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
        alert(data.message);
        if (role === "manager") {
          navigate("/dashboard/manager", { state: { company: data.company } });
        } else {
          navigate("/dashboard/employee", { state: { employee: data.employee } });
        }
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleRegister = () => {
    if (role === "manager") {
      navigate("/register", { state: { role: "manager" } });
    } else {
      alert("Only managers can register new companies!");
    }
  };

  const handleForgotPassword = () => {
    if (role === "manager") {
      navigate("/manager-forgot", { state: { role: "manager" } });
    } else {
      navigate("/forgot-password", { state: { role: "employee" } });
    }
  };

  return (
    <div style={pageStyle}>
      <div style={card}>
        {/* ✅ IAMPL Logo from public folder */}
        {/* ✅ IAMPL Logo from public folder (JPG) */}
    <img
        src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg"
        alt="IAMPL Logo"
        style={logoStyle}
      />


        <h2 style={title}>
          {role === "employee" ? "Employee Login" : "Manager Login"}
        </h2>
        <p style={subtitle}>Sign in to your account</p>

        {/* 🔹 ID OR Email field */}
        <label style={label}>
          * {role === "employee" ? "Employee ID or Email" : "Company ID or Email"}
        </label>
        <input
          style={input}
          type="text"
          placeholder={`Enter your ${
            role === "employee" ? "employee ID or email" : "company ID or email"
          }`}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        {/* Password */}
        <label style={label}>* Password</label>
        <input
          style={input}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Buttons */}
        <button style={loginBtn} onClick={handleLogin}>
          Login
        </button>

        <div style={{ marginTop: "10px" }}>
          <span style={link} onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </div>

        {role === "manager" && (
          <p style={{ marginTop: "8px" }}>
            Don’t have an account?{" "}
            <span style={link} onClick={handleRegister}>
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#fff",
  fontFamily: "Arial, sans-serif",
};

const card = {
  width: "380px",
  padding: "30px",
  border: "1px dashed #cbd5e1",
  borderRadius: "8px",
  background: "#fff",
  textAlign: "left",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const logoStyle = {
  display: "block",
  margin: "0 auto 12px",
  width: "100px",
  objectFit: "contain",
};

const title = { textAlign: "center", margin: "10px 0 4px", color: "#111827" };
const subtitle = {
  textAlign: "center",
  margin: "0 0 20px",
  fontSize: "14px",
  color: "#6b7280",
};

const label = {
  fontSize: "13px",
  marginBottom: "4px",
  display: "block",
  color: "#111827",
};

const input = {
  width: "100%",
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  marginBottom: "14px",
  fontSize: "14px",
  outline: "none",
};

const loginBtn = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1e3a8a",
  color: "white",
  fontWeight: "bold",
  fontSize: "15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "6px",
};

const link = {
  color: "#1d4ed8",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "13px",
};

export default LoginScreen;

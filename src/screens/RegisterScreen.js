// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pwd
    );
  };

  const handleRegister = async () => {
    if (!companyName || !email || !companyId || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters long and include:\n- Uppercase letter\n- Lowercase letter\n- Number\n- Special character (@$!%*?&)"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, companyId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration successful!");
        navigate("/employee-setup");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // ---------- Styles ----------
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(90deg, #ffffff 0%, #f6fbff 100%)",
    fontFamily: "Arial, sans-serif",
    padding: 20,
    boxSizing: "border-box",
  };

  const card = {
    width: "100%",
    maxWidth: 540,
    padding: 36,
    borderRadius: 6,
    background: "#fff",
    boxSizing: "border-box",
    border: "2px dashed rgba(0,0,0,0.12)",
    boxShadow: "0 8px 28px rgba(13,71,161,0.03)",
    textAlign: "center",
  };

  // ✅ Updated IAMPL logo (jpg version from public folder)
  const logoStyle = { width: 120, margin: "6px auto 10px", display: "block" };
  const titleStyle = {
    fontSize: 20,
    margin: "6px 0 6px",
    fontWeight: 700,
    color: "#263245",
  };
  const subtitleStyle = { fontSize: 13, color: "#6b6b6b", marginBottom: 14 };

  const formGroup = { width: "100%", marginTop: 10, textAlign: "left" };
  const label = {
    display: "block",
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  };
  const requiredStar = { color: "#b71c1c", marginRight: 6 };

  const input = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 6,
    border: "1px solid #cfcfcf",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const passwordWrapper = { position: "relative" };
  const eyeBtn = {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 6,
  };

  const registerBtn = {
    marginTop: 18,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#184f9b",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  };

  const smallNote = {
    marginTop: 12,
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  };

  const responsiveCss = `
    @media (max-width: 520px) {
      .rs-card { padding: 20px; }
      .rs-title { font-size: 18px; }
    }
  `;

  return (
    <div style={pageStyle}>
      <style>{responsiveCss}</style>

      <div style={card} className="rs-card">
        {/* ✅ IAMPL Logo */}
        <img
          src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg"
          alt="IAMPL Logo"
          style={logoStyle}
        />

        <div style={{ textAlign: "center" }}>
          <div style={titleStyle}>Create Your Account</div>
          <div style={subtitleStyle}>Register your company to get started</div>
        </div>

        <div style={formGroup}>
          <label style={label}>
            <span style={requiredStar}>*</span>
            <span>Company Name</span>
          </label>
          <input
            style={input}
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>
            <span style={requiredStar}>*</span>
            <span>Email</span>
          </label>
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>
            <span style={requiredStar}>*</span>
            <span>Company ID</span>
          </label>
          <input
            style={input}
            type="text"
            placeholder="Company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>
            <span style={requiredStar}>*</span>
            <span>Password</span>
          </label>
          <div style={passwordWrapper}>
            <input
              style={{ ...input, paddingRight: 44 }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              style={eyeBtn}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="#555"
                    strokeWidth="1.2"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                    stroke="#555"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 7L7 17"
                    stroke="#555"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            Password must be at least 8 characters and include uppercase,
            lowercase, number, and special character.
          </div>
        </div>

        <button
          style={registerBtn}
          onClick={handleRegister}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0f4a85")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#184f9b")
          }
        >
          Register
        </button>

        <div style={smallNote}>
          Already have an account?{" "}
          <span
            style={{
              color: "#1565c0",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/login", { state: { role: "manager" } })}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;

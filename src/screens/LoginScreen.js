import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png"; // ✅ update path to your logo

function LoginScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "guest";

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #e3f2fd, #bbdefb)", // light blue gradient
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const headingStyle = {
    color: "#0d47a1", // ✅ deep blue, contrasts well with light background
    marginBottom: "20px",
  };

  const logoStyle = {
    width: "150px",
    marginBottom: "30px",
  };

  const inputStyle = {
    width: "280px",
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const buttonStyle = {
    width: "280px",
    padding: "12px",
    margin: "15px 0",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "white", // ✅ button stands out
    color: "#007bff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  };

  const linkStyle = {
    color: "#1565c0", // ✅ darker medium blue, looks clickable
    textDecoration: "underline",
    cursor: "pointer",
    marginTop: "5px",
    display: "inline-block",
  };

  const handleLogin = async () => {
  if (!id || !password) {
    alert("Please enter ID and Password");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      // ✅ Redirect based on role
      if (role === "manager") {
        navigate("/dashboard/manager", { state: { company: data.company } });
      } else {
        navigate("/dashboard/employee", { state: { company: data.company } });
      }
    } else {
      alert(data.error);
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
    navigate("/forgot-password");
  };

  return (
    <div style={containerStyle}>
      {/* ✅ Logo at top */}
      <img src={logo} alt="Company Logo" style={logoStyle} />

      <h2 style={headingStyle}>
  Login as {role.charAt(0).toUpperCase() + role.slice(1)}
</h2>


      <input
        style={inputStyle}
        type="text"
        placeholder="Enter ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        style={buttonStyle}
        onClick={handleLogin}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#e6e6e6";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "white";
        }}
      >
        Login
      </button>

      {/* Forgot Password Link */}
      <p>
        <span style={linkStyle} onClick={handleForgotPassword}>
          Forgot Password?
        </span>
      </p>

      {/* Register Link for manager */}
      {role === "manager" && (
        <p>
          Don’t have an account?{" "}
          <span style={linkStyle} onClick={handleRegister}>
            Register
          </span>
        </p>
      )}
    </div>
  );
}

export default LoginScreen;

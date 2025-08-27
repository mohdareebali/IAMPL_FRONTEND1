import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LoginScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "guest";

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  };

  const inputStyle = {
    width: "250px",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "6px"
  };

  const buttonStyle = {
    width: "260px",
    padding: "10px",
    margin: "10px 0",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  };

  const handleLogin = () => {
    if (id && password) {
      if (role === "manager") {
        navigate("/dashboard/manager");
      } else if (role === "employee") {
        navigate("/dashboard/employee");
      } else {
        alert("Invalid role");
      }
    } else {
      alert("Please enter ID and Password");
    }
  };

  const handleRegister = () => {
    if (role === "manager") {
      navigate("/register", { state: { role: "manager" } });
    } else {
      alert("Only managers can register new companies!");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
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
      <button style={buttonStyle} onClick={handleLogin}>
        Login
      </button>

      {role === "manager" && (
        <p>
          Don’t have an account?{" "}
          <a href="#" onClick={handleRegister}>
            Register
          </a>
        </p>
      )}
    </div>
  );
}

export default LoginScreen;

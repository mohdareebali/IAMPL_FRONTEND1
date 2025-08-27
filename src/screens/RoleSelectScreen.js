import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelectScreen() {
  const navigate = useNavigate();

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

  const buttonGroupStyle = {
    display: "flex",
    gap: "20px",
    marginTop: "20px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  };

  const handleRoleSelect = (role) => {
    navigate("/login", { state: { role } });
  };

  return (
    <div style={containerStyle}>
      <h2>Be a part of us as</h2>
      <div style={buttonGroupStyle}>
        <button style={buttonStyle} onClick={() => handleRoleSelect("manager")}>
          Manager
        </button>
        <button style={buttonStyle} onClick={() => handleRoleSelect("employee")}>
          Employee
        </button>
      </div>
    </div>
  );
}

export default RoleSelectScreen;

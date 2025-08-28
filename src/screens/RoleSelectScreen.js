import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png"; // correct import

function RoleSelectScreen() {
  const navigate = useNavigate();

  const containerStyle = {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg, #e9f1ff, #f8fbff)", // soft background
    fontFamily: "Arial, sans-serif",
  };

  const leftPanelStyle = {
    flex: 1,
    backgroundImage: `url(${logo})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    opacity: 0.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const rightPanelStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  };

  const boxStyle = {
    background: "white",
    padding: "50px 40px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  };

  const titleStyle = {
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a2a6c",
  };

  const buttonGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const handleRoleSelect = (role) => {
    navigate("/login", { state: { role } });
  };

  return (
    <div style={containerStyle}>
      {/* Left Logo Panel */}
      <div style={leftPanelStyle}></div>

      {/* Right Content Panel */}
      <div style={rightPanelStyle}>
        <div style={boxStyle}>
          <h2 style={titleStyle}>Be a part of us as</h2>
          <div style={buttonGroupStyle}>
            <button
              style={buttonStyle}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#007bff")
              }
              onClick={() => handleRoleSelect("manager")}
            >
              Manager
            </button>
            <button
              style={buttonStyle}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#007bff")
              }
              onClick={() => handleRoleSelect("employee")}
            >
              Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectScreen;

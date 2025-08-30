// src/screens/ManagerDashboardScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation

function ManagerDashboardScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // ✅ navigation hook

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: "240px",
            background: "linear-gradient(180deg, #1e293b, #0f172a)", // darker gradient
            color: "#f1f5f9",
            padding: "20px 15px",
            transition: "all 0.3s ease-in-out",
            boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              marginBottom: "35px",
              fontSize: "18px",
              textAlign: "center",
              fontWeight: "600",
              letterSpacing: "0.5px",
              color: "#e2e8f0",
            }}
          >
            Manager Menu
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
             <button
                style={menuBtnStyle}
                onClick={() => navigate("/employee-setup")}
              >
                Create Employee
              </button>
            <button
              style={menuBtnStyle}
              onClick={() => navigate("/employee-fairs-done")} // ✅ navigate
            >
              FAIRs Done
            </button>
            <button style={menuBtnStyle} onClick={() => navigate("/manager-fairs-in-progress")}>FAIRs in Progress</button>
            <button style={menuBtnStyle}>New FAIR</button>
            <button style={menuBtnStyle} onClick={() => navigate("/employee-info")}>Employee Info</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(to right, #f8fafc, #e0f2fe)",
        }}
      >
        {/* Top Navbar */}
        <div
          style={{
            height: "60px",
            background: "#0f172a", // deep navy
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              cursor: "pointer",
              marginRight: "20px",
              userSelect: "none",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </span>
          <h1
            style={{
              fontSize: "20px",
              margin: 0,
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            Manager Dashboard
          </h1>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: "30px" }}>
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginBottom: "12px", color: "#1e293b" }}>
              Welcome to the Manager Dashboard 
            </h2>
            <p style={{ color: "#475569", fontSize: "15px" }}>
              Select an option from the left menu to continue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable style for menu buttons
const menuBtnStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "none",
  color: "#f8fafc",
  textAlign: "left",
  fontSize: "15px",
  cursor: "pointer",
  padding: "12px 14px",
  borderRadius: "10px",
  transition: "all 0.25s ease",
};

export default ManagerDashboardScreen;
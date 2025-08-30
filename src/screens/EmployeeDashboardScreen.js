// src/screens/EmployeeDashboardScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function EmployeeDashboardScreen() {
    const navigate = useNavigate(); 
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: "220px",
            background: "#1e293b", // dark slate
            color: "white",
            padding: "20px 10px",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <h2 style={{ marginBottom: "30px", fontSize: "18px", textAlign: "center" }}>
            Employee Menu
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button style={menuBtnStyle} onClick={() => navigate("/employee-fairs-in-progress")}>FAIRs in Progress</button>
            <button style={menuBtnStyle} onClick={() => navigate("/employee-fairs-done")}>FAIRs Done</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, background: "#f8fafc" }}>
        {/* Top Navbar */}
        <div
          style={{
            height: "60px",
            background: "#0f172a", // dark navy
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              cursor: "pointer",
              marginRight: "20px",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </span>
          <h1 style={{ fontSize: "20px", margin: 0 }}>Employee Dashboard</h1>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: "20px" }}>
          <h2>Welcome to the Employee Dashboard</h2>
          <p>Select an option from the left menu to continue.</p>
        </div>
      </div>
    </div>
  );
}

// Reusable style for menu buttons
const menuBtnStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "16px",
  cursor: "pointer",
  padding: "10px",
  borderRadius: "8px",
  transition: "0.2s",
};

export default EmployeeDashboardScreen;
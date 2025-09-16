// src/screens/EmployeeDashboardScreen.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EmployeeDashboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ Employee data from login
  const employee = location.state?.employee || {};

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: "220px",
            background: "#1e293b",
            color: "white",
            padding: "20px 10px",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <h2 style={{ marginBottom: "30px", fontSize: "18px", textAlign: "center" }}>
            Employee Menu
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button
              style={menuBtnStyle}
              onClick={() => navigate("/employee-fairs-in-progress")}
            >
              FAIRs in Progress
            </button>
            <button
              style={menuBtnStyle}
              onClick={() => navigate("/employee-fairs-done")}
            >
              FAIRs Done
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, background: "#f8fafc" }}>
        {/* Top Navbar */}
        <div
          style={{
            height: "60px",
            background: "#0f172a",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
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

          {/* ✅ Profile Icon */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {employee.email ? employee.email[0].toUpperCase() : "E"}
            </div>

            {/* ✅ Dropdown */}
            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  background: "white",
                  color: "#0f172a",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "15px",
                  width: "250px",
                  zIndex: 100,
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#0f172a" }}>
                  👤 Employee Profile
                </h4>
                <p><b>Email:</b> {employee.email || "N/A"}</p>
                <p><b>Employee ID:</b> {employee.employee_id || "N/A"}</p>
                <p><b>Company ID:</b> {employee.company_id || "N/A"}</p>
                <p>
                  <b>Created At:</b>{" "}
                  {employee.created_at
                    ? new Date(employee.created_at).toLocaleString()
                    : "N/A"}
                </p>
                <button
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/")}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
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

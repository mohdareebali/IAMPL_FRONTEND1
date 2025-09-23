// src/screens/EmployeeInfoScreen.js
import React, { useEffect, useState } from "react";
import logo from "../assets/Innovascape-logo.png";

function EmployeeInfoScreen() {
  const [employees, setEmployees] = useState([]);

  // Fetch employees from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else if (data) {
          setEmployees([data]);
        } else {
          setEmployees([]);
        }
      })
      .catch((err) => console.error("❌ Error fetching employees:", err));
  }, []);

  return (
    <div style={page}>
      <div style={card}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <h2 style={title}>Employee Information</h2>
        <p style={subtitle}>
          View all registered employees, their credentials, and account activity.
        </p>

        {employees.length === 0 ? (
          <div style={empty}>No employees found.</div>
        ) : (
          <div style={listWrapper}>
            {employees.map((emp, index) => (
              <div key={index} style={empCard}>
                <div style={empRow}><b>ID:</b> {emp.employee_id}</div>
                <div style={empRow}><b>Email:</b> {emp.email}</div>
                <div style={empRow}><b>Current Password:</b> {emp.password}</div>
                <div style={empRow}><b>Company ID:</b> {emp.company_id}</div>
                <div style={empRow}>
                  <b>Created At:</b>{" "}
                  {emp.created_at
                    ? new Date(emp.created_at).toLocaleString()
                    : "N/A"}
                </div>

                {emp.password_changed_at && (
                  <div style={changedPwd}>
                    🔑 Password changed on{" "}
                    {new Date(emp.password_changed_at).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: 24,
  background: "linear-gradient(90deg,#ffffff 0%, #f6fbff 100%)",
  fontFamily: "Arial, sans-serif",
};

const card = {
  width: "100%",
  maxWidth: 800,
  background: "#fff",
  border: "2px dashed rgba(0,0,0,0.12)",
  borderRadius: 10,
  boxShadow: "0 6px 20px rgba(13,71,161,0.05)",
  padding: 28,
  textAlign: "center",
};

const logoStyle = { width: 80, margin: "0 auto 12px" };
const title = { fontSize: 22, fontWeight: 700, color: "#0d47a1", marginBottom: 6 };
const subtitle = { fontSize: 14, color: "#475569", marginBottom: 20 };

const empty = { color: "#6b7280", fontSize: 15, textAlign: "center" };

const listWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  maxHeight: "60vh",
  overflowY: "auto",
  paddingRight: 6,
};

const empCard = {
  textAlign: "left",
  background: "#f9fafb",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: 14,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const empRow = { marginBottom: 6, fontSize: 14, color: "#1e293b" };

const changedPwd = {
  marginTop: 8,
  color: "green",
  fontWeight: "bold",
  fontSize: 14,
};

export default EmployeeInfoScreen;

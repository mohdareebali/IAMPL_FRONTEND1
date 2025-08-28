// src/screens/EmployeeSetupScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// helper to generate strong password
const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

function EmployeeSetupScreen() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (newEmployee.id.trim() !== "") {
      setNewEmployee({ ...newEmployee, password: generatePassword() });
    }
  };

  const handleAdd = () => {
    if (newEmployee.id && newEmployee.email && newEmployee.password) {
      setEmployees([...employees, newEmployee]);
      setNewEmployee({ id: "", email: "", password: "" });
    }
  };

  const handleShare = (emp) => {
    alert(
      `Shared credentials:\nID: ${emp.id}\nPassword: ${emp.password}\nSent to: ${emp.email}`
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Employee Credentials</h2>

      <input
        style={inputStyle}
        type="text"
        name="id"
        placeholder="Employee ID"
        value={newEmployee.id}
        onChange={handleChange}
        onBlur={handleGenerate}
      />
      <input
        style={inputStyle}
        type="email"
        name="email"
        placeholder="Employee Email"
        value={newEmployee.email}
        onChange={handleChange}
      />
      <input
        style={inputStyle}
        type="text"
        placeholder="Generated Password"
        value={newEmployee.password}
        readOnly
      />

      <button style={btnStyle} onClick={handleAdd}>
        ➕ Add Employee
      </button>

      <div style={{ marginTop: "20px", width: "100%", maxWidth: "500px" }}>
        <h3 style={listHeading}>Employee List</h3>
        {employees.map((emp, index) => (
          <div key={index} style={empCard}>
            <p>
              <b>ID:</b> {emp.id}
            </p>
            <p>
              <b>Email:</b> {emp.email}
            </p>
            <p>
              <b>Password:</b> {emp.password}
            </p>
            <button style={shareBtn} onClick={() => handleShare(emp)}>
              📤 Share
            </button>
          </div>
        ))}
      </div>

      <button
        style={dashboardBtn}
        onClick={() => navigate("/dashboard/manager")}
      >
        ⬅ Go to Dashboard
      </button>
    </div>
  );
}

// ==== Styles ====

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  minHeight: "100vh", // ✅ allows scroll
  background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
  overflowY: "auto", // ✅ makes content scrollable
  padding: "20px",
};

const headingStyle = {
  color: "#0d47a1",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  width: "280px",
  marginBottom: "12px",
  outline: "none",
};

const btnStyle = {
  padding: "12px",
  background: "white",
  color: "#007bff",
  border: "none",
  borderRadius: "8px",
  width: "280px",
  cursor: "pointer",
  marginBottom: "15px",
  fontSize: "16px",
  fontWeight: "500",
  transition: "0.3s",
};

const listHeading = {
  color: "#0d47a1",
  marginBottom: "10px",
};

const empCard = {
  padding: "12px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  marginBottom: "12px",
  background: "#f8fafc",
  textAlign: "left",
};

const shareBtn = {
  padding: "6px 12px",
  background: "#38b000",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.2s",
};

const dashboardBtn = {
  padding: "12px",
  background: "white",
  color: "#007bff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  width: "280px",
  cursor: "pointer",
  marginTop: "20px",
  fontWeight: "500",
};

export default EmployeeSetupScreen;

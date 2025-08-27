// src/screens/EmployeeSetupScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// helper to generate strong password
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

function EmployeeSetupScreen() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ id: "", email: "", password: "" });
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
    // Here you’d integrate with backend + email API like nodemailer
    alert(`Shared credentials:\nID: ${emp.id}\nPassword: ${emp.password}\nSent to: ${emp.email}`);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Create Employee Credentials</h2>

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
          Add Employee
        </button>

        <div style={{ marginTop: "20px" }}>
          <h3>Employee List</h3>
          {employees.map((emp, index) => (
            <div key={index} style={empCard}>
              <p><b>ID:</b> {emp.id}</p>
              <p><b>Email:</b> {emp.email}</p>
              <p><b>Password:</b> {emp.password}</p>
              <button style={shareBtn} onClick={() => handleShare(emp)}>Share</button>
            </div>
          ))}
        </div>

        <button style={dashboardBtn} onClick={() => navigate("/dashboard/manager")}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f1f5f9",
};

const cardStyle = {
  width: "500px",
  padding: "30px",
  borderRadius: "12px",
  background: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "100%",
  marginBottom: "10px",
};

const btnStyle = {
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  width: "100%",
  cursor: "pointer",
  marginBottom: "10px",
};

const empCard = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginBottom: "10px",
};

const shareBtn = {
  padding: "5px 10px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const dashboardBtn = {
  padding: "12px",
  background: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  width: "100%",
  cursor: "pointer",
  marginTop: "15px",
};

export default EmployeeSetupScreen;

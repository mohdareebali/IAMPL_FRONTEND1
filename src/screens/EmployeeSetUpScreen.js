// src/screens/EmployeeSetupScreen.js
import React, { useState, useEffect } from "react";
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
    employee_id: "",
    email: "",
    password: "",
    company_id: "", // ✅ Added company_id
  });
  const [idError, setIdError] = useState(""); // ✅ error state for duplicate IDs
  const navigate = useNavigate();

  // Fetch employees by company_id
  useEffect(() => {
    if (!newEmployee.company_id) return; // wait until company_id is entered

    fetch(`http://localhost:5000/api/employees/${newEmployee.company_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      })
      .catch((err) => console.error("❌ Error fetching employees:", err));
  }, [newEmployee.company_id]); // 🔑 fetch when company_id changes

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (newEmployee.employee_id.trim() !== "") {
      // ✅ Check if employee_id already exists
      const exists = employees.some(
        (emp) => emp.employee_id === newEmployee.employee_id
      );
      if (exists) {
        setIdError("❌ Employee ID already exists!");
        setNewEmployee({ ...newEmployee, password: "" });
        return;
      }
      setIdError(""); // clear error if unique
      setNewEmployee({ ...newEmployee, password: generatePassword() });
    }
  };

  // Add employee to backend database
  const handleAdd = async () => {
    if (idError) {
      alert("Please use a unique Employee ID");
      return;
    }

    if (
      !newEmployee.employee_id ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.company_id
    ) {
      alert("Please fill all fields including Company ID and generate password");
      return;
    }

    try {
      const employeePayload = { ...newEmployee };

      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeePayload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setEmployees((prev) => [
          ...prev,
          { ...employeePayload, created_at: new Date() },
        ]);
        setNewEmployee({
          employee_id: "",
          email: "",
          password: "",
          company_id: newEmployee.company_id, // keep same company_id for new entries
        });
      } else {
        alert(data.error || "Failed to add employee");
      }
    } catch (err) {
      console.error("❌ Error adding employee:", err);
      alert("Server error, please try again");
    }
  };

  // Share credentials via backend
  const handleShare = async (emp) => {
    try {
      const payload = {
        employee_id: emp.employee_id,
        email: emp.email,
        password: emp.password,
      };

      const res = await fetch("http://localhost:5000/api/employees/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.error || "Failed to send email");
      }
    } catch (err) {
      console.error("❌ Error sharing credentials:", err);
      alert("Server error, please try again");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Employee Credentials</h2>

      <input
        style={inputStyle}
        type="text"
        name="employee_id"
        placeholder="Employee ID"
        value={newEmployee.employee_id}
        onChange={handleChange}
        onBlur={handleGenerate}
      />
      {idError && <p style={{ color: "red" }}>{idError}</p>}

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
        name="company_id"
        placeholder="Company ID"
        value={newEmployee.company_id}
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
        <h3 style={listHeading}>Employee List (Filtered by Company)</h3>
        {employees.length === 0 ? (
          <p>No employees found for this company.</p>
        ) : (
          employees.map((emp, index) => (
            <div key={index} style={empCard}>
              <p><b>ID:</b> {emp.employee_id}</p>
              <p><b>Email:</b> {emp.email}</p>
              <p><b>Company ID:</b> {emp.company_id}</p>
              <p><b>Password:</b> {emp.password}</p>
              <button style={shareBtn} onClick={() => handleShare(emp)}>
                📤 Share
              </button>
            </div>
          ))
        )}
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
  minHeight: "100vh",
  background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
  overflowY: "auto",
  padding: "20px",
};

const headingStyle = { color: "#0d47a1", marginBottom: "20px" };
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
const listHeading = { color: "#0d47a1", marginBottom: "10px" };
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
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  width: "280px",
  cursor: "pointer",
  marginTop: "20px",
  fontWeight: "500",
};

export default EmployeeSetupScreen;

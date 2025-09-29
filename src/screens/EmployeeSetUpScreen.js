// src/screens/EmployeeSetupScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Use IAMPL logo from public folder (jpg)
function EmployeeSetupScreen() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    email: "",
    password: "",
    company_id: "",
  });
  const [idError, setIdError] = useState("");
  const [message, setMessage] = useState(""); // inline feedback text
  const [messageType, setMessageType] = useState("info"); // "success" | "error" | "info"
  const navigate = useNavigate();

  // helper to generate strong password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    return Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  useEffect(() => {
    if (!newEmployee.company_id) {
      setEmployees([]);
      return;
    }

    fetch(`http://localhost:5000/api/employees/${newEmployee.company_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEmployees(data);
        else setEmployees([]);
      })
      .catch((err) => {
        console.error("❌ Error fetching employees:", err);
        setMessageType("error");
        setMessage("Failed to fetch employees for this company.");
      });
  }, [newEmployee.company_id]);

  // helper to show messages inline and auto-clear after n seconds
  const showMessage = (text, type = "info", ttl = 5000) => {
    setMessageType(type);
    setMessage(text);
    if (ttl > 0) {
      setTimeout(() => {
        setMessage("");
      }, ttl);
    }
  };

  const handleChange = (e) =>
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });

  const handleGenerate = () => {
    if (newEmployee.employee_id.trim() !== "") {
      const exists = employees.some(
        (emp) => emp.employee_id === newEmployee.employee_id
      );
      if (exists) {
        setIdError("❌ Employee ID already exists!");
        setNewEmployee({ ...newEmployee, password: "" });
        showMessage("Employee ID already exists. Please choose another.", "error");
        return;
      }
      setIdError("");
      const pwd = generatePassword();
      setNewEmployee({ ...newEmployee, password: pwd });
      showMessage("Password generated.", "success", 2500);
    }
  };

  const handleAdd = async () => {
    if (idError) {
      showMessage("Please use a unique Employee ID", "error");
      return;
    }

    if (
      !newEmployee.employee_id ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.company_id
    ) {
      showMessage(
        "Please fill all fields including Company ID and generate password",
        "error"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage(data.message || "Employee added successfully", "success");
        setEmployees((prev) => [
          ...prev,
          { ...newEmployee, created_at: new Date() },
        ]);
        setNewEmployee({
          employee_id: "",
          email: "",
          password: "",
          company_id: newEmployee.company_id,
        });
        setIdError("");
      } else {
        showMessage(data.error || "Failed to add employee", "error");
      }
    } catch (err) {
      console.error("❌ Error adding employee:", err);
      showMessage("Server error, please try again", "error");
    }
  };

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
        showMessage(data.message || "Credentials shared successfully", "success");
      } else {
        showMessage(data.error || "Failed to send email", "error");
      }
    } catch (err) {
      console.error("❌ Error sharing credentials:", err);
      showMessage("Server error, please try again", "error");
    }
  };

  /* ---------- Message box styling helper ---------- */
  const msgBoxBase = {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 760,
  };
  const getMsgStyle = () => {
    switch (messageType) {
      case "success":
        return {
          ...msgBoxBase,
          background: "#e6ffef",
          color: "#065f46",
          border: "1px solid #a7f3d0",
        };
      case "error":
        return {
          ...msgBoxBase,
          background: "#fff1f2",
          color: "#9b1c1c",
          border: "1px solid #fecaca",
        };
      default:
        return {
          ...msgBoxBase,
          background: "#eef2ff",
          color: "#0f172a",
          border: "1px solid #dbeafe",
        };
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* ✅ Updated IAMPL Logo (jpg from public folder) */}
        <img
          src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg"
          alt="IAMPL Logo"
          style={logoStyle}
        />
        <h2 style={titleStyle}>Create Employee Credentials</h2>
        <p style={subtitleStyle}>
          Generate and manage employee login credentials
        </p>

        <div style={formRow}>
          <label style={labelStyle}>Employee ID</label>
          <input
            style={inputStyle}
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={newEmployee.employee_id}
            onChange={handleChange}
            onBlur={handleGenerate}
          />
          {idError && <div style={errorStyle}>{idError}</div>}
        </div>

        <div style={formRow}>
          <label style={labelStyle}>Employee Email</label>
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Employee Email"
            value={newEmployee.email}
            onChange={handleChange}
          />
        </div>

        <div style={formRow}>
          <label style={labelStyle}>Company ID</label>
          <input
            style={inputStyle}
            type="text"
            name="company_id"
            placeholder="Company ID"
            value={newEmployee.company_id}
            onChange={handleChange}
          />
        </div>

        <div style={formRow}>
          <label style={labelStyle}>Generated Password</label>
          <input
            style={{ ...inputStyle, background: "#f3f4f6" }}
            type="text"
            placeholder="Generated Password"
            value={newEmployee.password}
            readOnly
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={primaryBtn} onClick={handleAdd}>
            ➕ Add Employee
          </button>
          <button
            style={altBtn}
            onClick={() =>
              setNewEmployee({
                employee_id: "",
                email: "",
                password: "",
                company_id: "",
              })
            }
          >
            Reset
          </button>
        </div>

        {/* Inline message under primary controls */}
        {message ? <div style={getMsgStyle()}>{message}</div> : null}
      </div>

      <div style={listCard}>
        <h3 style={listTitle}>Employee List (Filtered by Company)</h3>
        {employees.length === 0 ? (
          <div style={emptyList}>No employees found for this company.</div>
        ) : (
          <div style={listWrapper}>
            {employees.map((emp, index) => (
              <div key={index} style={empRow}>
                <div style={empDetails}>
                  <div>
                    <strong>ID:</strong> {emp.employee_id}
                  </div>
                  <div>
                    <strong>Email:</strong> {emp.email}
                  </div>
                  <div>
                    <strong>Company ID:</strong> {emp.company_id}
                  </div>
                  <div>
                    <strong>Password:</strong> {emp.password}
                  </div>
                </div>
                <div style={empActions}>
                  <button
                    style={shareBtn}
                    onClick={() => handleShare(emp)}
                    title={`Share credentials for ${emp.employee_id}`}
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button style={backBtn} onClick={() => navigate("/dashboard/manager")}>
        ⬅ Go to Dashboard
      </button>
    </div>
  );
}

/* ---------- Styles (same as before) ---------- */
const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 28,
  boxSizing: "border-box",
  background: "linear-gradient(90deg,#ffffff,#f6fbff)",
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  color: "#0f172a",
};

const cardStyle = {
  width: "100%",
  maxWidth: 640,
  padding: 28,
  borderRadius: 12,
  background: "#fff",
  border: "1px solid #e6eefc",
  boxShadow: "0 8px 24px rgba(12,24,48,0.04)",
  marginBottom: 20,
};
const logoStyle = { width: 92, display: "block", margin: "6px auto 12px" };
const titleStyle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#0d47a1",
  margin: "6px 0 6px",
  textAlign: "center",
};
const subtitleStyle = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 16,
  textAlign: "center",
};

const formRow = { marginBottom: 12 };
const labelStyle = {
  display: "block",
  fontSize: 13,
  color: "#374151",
  marginBottom: 6,
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};
const errorStyle = { color: "#b91c1c", fontSize: 13, marginTop: 6 };

const primaryBtn = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#184f9b",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};
const altBtn = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#0f172a",
  fontSize: 15,
  cursor: "pointer",
};

const listCard = { width: "100%", maxWidth: 760, marginBottom: 12 };
const listTitle = { fontSize: 18, color: "#0d47a1", marginBottom: 12, textAlign: "left" };
const emptyList = { color: "#475569" };
const listWrapper = { display: "flex", flexDirection: "column", gap: 12 };
const empRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  border: "1px solid #e6eefc",
  padding: 12,
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(13,71,161,0.02)",
};
const empDetails = { display: "flex", flexDirection: "column", gap: 6, color: "#0f172a" };
const empActions = { display: "flex", gap: 8, alignItems: "center" };
const shareBtn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#0f9d58",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};
const backBtn = {
  marginTop: 18,
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  background: "#6c757d",
  color: "#fff",
  fontSize: 15,
  cursor: "pointer",
};

export default EmployeeSetupScreen;

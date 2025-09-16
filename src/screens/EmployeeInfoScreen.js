// src/screens/EmployeeInfoScreen.js
import React, { useEffect, useState } from "react";

function EmployeeInfoScreen() {
  const [employees, setEmployees] = useState([]);

  // Fetch employees from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => {
        // ✅ Ensure data is always an array
        if (Array.isArray(data)) {
          setEmployees(data);
        } else if (data) {
          setEmployees([data]); // wrap single object in array
        } else {
          setEmployees([]); // fallback empty
        }
      })
      .catch((err) => console.error("❌ Error fetching employees:", err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(to right, #f8fafc, #e0f2fe)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#0d47a1", marginBottom: "20px" }}>
        Employee Information
      </h2>

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {employees.map((emp, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <p><b>ID:</b> {emp.employee_id}</p>
              <p><b>Email:</b> {emp.email}</p>
              <p><b>Current Password:</b> {emp.password}</p>
              <p><b>Company ID:</b> {emp.company_id}</p>
              <p>
                <b>Created At:</b>{" "}
                {emp.created_at
                  ? new Date(emp.created_at).toLocaleString()
                  : "N/A"}
              </p>

              {/* ✅ Highlight if password was changed */}
              {emp.password_changed_at && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  🔑 Password was changed on{" "}
                  {new Date(emp.password_changed_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeInfoScreen;

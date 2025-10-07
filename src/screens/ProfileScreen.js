// src/screens/ProfileScreen.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use employee passed from dashboard if available, else fallback demo data
  const employee = location.state?.employee || {
    firstName: "Ramesh",
    lastName: "Sharma",
    name: "Ramesh Sharma",
    role: "Employee - Quality Assurance",
    city: "Mumbai",
    email: "ramesh.sharma@company.com",
    employeeId: "00000001",
    phone: "+91 - 9087689808",
    department: "Quality Assurance",
    profile: "Employee",
    avatar: "/avatar-ramesh.jpg", // put an image at public/avatar-ramesh.jpg (or change path)
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>My Profile</h1>
      <p style={styles.subtitle}>
        View and update your personal details to keep your profile up to date.
      </p>

      {/* Header: avatar + name + role + city + Edit picture */}
      <div style={styles.headerRow}>
        <img
          src={employee.avatar}
          alt={employee.name}
          style={styles.avatar}
          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/96"; }}
        />
        <div style={{ flex: 1 }}>
          <div style={styles.empName}>{employee.name}</div>
          <div style={styles.empRole}>{employee.role}</div>
          <div style={styles.empCity}>{employee.city}</div>

          <button
            style={styles.linkBtn}
            onClick={() => alert("Open image picker (wire up later)")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
              <path d="M12 5v14M5 12h14" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Edit Profile Picture
          </button>
        </div>
      </div>

      {/* Personal Information Card */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Personal Information</span>
          <button style={styles.ghostIconBtn} onClick={() => alert("Edit personal info")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
              <path d="M4 21h4l11-11a2.828 2.828 0 10-4-4L4 17v4z"
                stroke="#184f9b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit
          </button>
        </div>

        <div style={styles.gridTwo}>
          <Field label="First Name" value={employee.firstName || "--"} />
          <Field label="Last Name" value={employee.lastName || "--"} />
          <Field label="Location" value={employee.city || "--"} />
          <Field label="Employee ID" value={employee.employeeId || "--"} />
          <Field label="Email Address" value={employee.email || "--"} />
          <Field label="Phone" value={employee.phone || "--"} />
          <Field label="Profile" value={employee.profile || "--"} />
          <Field label="Department" value={employee.department || "--"} />
        </div>
      </section>

      {/* Address Card */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Address</span>
          <button style={styles.ghostIconBtn} onClick={() => alert("Add address")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
              <path d="M12 5v14M5 12h14" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Add Address
          </button>
        </div>

        <div style={styles.gridTwo}>
          <Field label="Street" value="--" />
          <Field label="Road" value="--" />
          <Field label="City" value="--" />
          <Field label="State" value="--" />
          <Field label="Country" value="--" />
          <Field label="Postal Code" value="--" />
        </div>
      </section>

      {/* Logout Button */}
      <button style={styles.logoutBtn} onClick={() => navigate("/")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="#b91c1c" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 17l5-5-5-5M15 12H3" stroke="#b91c1c" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Logout
      </button>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.fieldValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: { padding: 24, background: "#fff" },
  h1: { margin: 0, fontSize: 28, color: "#0f172a" },
  subtitle: { color: "#64748b", marginTop: 6 },

  headerRow: {
    display: "flex", alignItems: "center", gap: 16, marginTop: 18, marginBottom: 6,
  },
  avatar: { width: 96, height: 96, borderRadius: "50%", objectFit: "cover" },
  empName: { fontSize: 20, fontWeight: 800, color: "#0f172a" },
  empRole: { color: "#64748b", marginTop: 2 },
  empCity: { color: "#0f172a", marginTop: 2 },

  linkBtn: {
    marginTop: 10, border: "none", background: "transparent", color: "#184f9b",
    fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center",
  },

  card: {
    border: "1px solid #e6eefc", borderRadius: 8, padding: 16, marginTop: 16,
    background: "#fff",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontWeight: 800, color: "#0f172a" },

  ghostIconBtn: {
    display: "inline-flex", alignItems: "center", border: "1px solid #cfe0f8",
    background: "#fff", color: "#0f172a", borderRadius: 8, padding: "6px 10px",
    cursor: "pointer", fontSize: 14,
  },

  gridTwo: {
    display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 24, rowGap: 10,
  },
  fieldLabel: { fontSize: 12, color: "#94a3b8", marginBottom: 4 },
  fieldValue: { color: "#0f172a", fontWeight: 600 },

  logoutBtn: {
    marginTop: 18, borderRadius: 8, padding: "10px 14px",
    border: "1px solid #fca5a5", background: "#fff", color: "#b91c1c",
    display: "inline-flex", alignItems: "center", cursor: "pointer", fontWeight: 600,
  },
};

export default ProfileScreen;

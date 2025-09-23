// src/screens/RoleSelectScreen.js
import React from "react";
import { useNavigate } from "react-router-dom";
import footerLogo from "../assets/Innovascape-logo.png";

// Material UI icons (outline person + star / person + pencil)
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

function RoleSelectScreen() {
  const navigate = useNavigate();

  const handleContinue = (role) => {
    navigate("/login", { state: { role } });
  };

  return (
    <div style={page}>
      <div style={wrap}>
        {/* Header */}
        <header style={header}>
          {/* Use public JPG logo from your path (public folder) */}
          <img
            src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg"
            alt="IAMPL logo"
            style={logo}
          />
          <h1 style={title}>FAIR Portal</h1>
          <p style={subtitle}>
            Streamline FAIR FORM entries through search and autofill, extract and insert,
            voice or key entries with accuracy and speed.
          </p>
        </header>

        {/* Role Cards */}
        <section style={cardsRow} aria-label="Role selection">
          {/* Manager */}
          <article style={card}>
            <div style={cardInner}>
              {/* Person outline with small star overlay (top-right) */}
              <div style={iconWrap}>
                <PersonOutlineIcon style={personIcon} />
                <GradeOutlinedIcon style={starIcon} />
              </div>

              <h2 style={cardTitle}>Manager Portal</h2>
              <p style={cardDesc}>
                Oversee team operations, assign forms, and monitor progress.
              </p>

              <ul style={featureList}>
                <li>Manage team members and assignments</li>
                <li>Track form completion status</li>
                <li>Access analytics and reports</li>
                <li>Approve employee registrations</li>
              </ul>
            </div>

            <div style={cardFooter}>
              <button
                style={cta}
                onClick={() => handleContinue("manager")}
                aria-label="Continue as Manager"
              >
                Continue as Manager
              </button>
            </div>
          </article>

          {/* Employee */}
          <article style={card}>
            <div style={cardInner}>
              {/* Person outline with small pencil overlay (top-right) */}
              <div style={iconWrap}>
                <PersonOutlineIcon style={personIcon} />
                <EditNoteOutlinedIcon style={penIcon} />
              </div>

              <h2 style={cardTitle}>Employee</h2>
              <p style={cardDesc}>Complete assigned forms and track progress.</p>

              <ul style={featureList}>
                <li>Fill assigned forms efficiently</li>
                <li>Upload supporting documents</li>
                <li>Track submission status</li>
                <li>Easy Entry — auto fill or extract, voice or key entries.</li>
              </ul>
            </div>

            <div style={cardFooter}>
              <button
                style={cta}
                onClick={() => handleContinue("employee")}
                aria-label="Continue as Employee"
              >
                Continue as Employee
              </button>
            </div>
          </article>
        </section>

        {/* Footer */}
        <footer style={footer}>
          <span style={{ color: "#64748b" }}>Created by</span>
          <img src={footerLogo} alt="Innovascape" style={footerLogoStyle} />
        </footer>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#ffffff",
  padding: 20,
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
};

const wrap = {
  width: "100%",
  maxWidth: 780,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 24,
};

const header = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
};

const logo = { width: 100, height: "auto", objectFit: "contain" };
const title = { fontSize: 26, margin: 6, fontWeight: 800, color: "#0d47a1" };
const subtitle = {
  maxWidth: 640,
  textAlign: "center",
  color: "#6b7280",
  fontSize: 13,
  lineHeight: 1.4,
  margin: 0,
};

const cardsRow = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  flexWrap: "wrap",
};

const card = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: 360,
  background: "#fff",
  borderRadius: 8,
  border: "2px dashed rgba(15,23,42,0.12)",
  padding: 16,
  boxSizing: "border-box",
};

const cardInner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
};

const iconWrap = {
  position: "relative",
  width: 56,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 4,
};

const personIcon = {
  fontSize: 46,
  color: "#374151",
};

const starIcon = {
  position: "absolute",
  top: -6,
  right: -6,
  fontSize: 20,
  color: "#f59e0b", // gold
  background: "#fff",
  borderRadius: 999,
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  transform: "translate(30%, -20%)",
};

const penIcon = {
  position: "absolute",
  top: -6,
  right: -6,
  fontSize: 20,
  color: "#ef4444", // red-ish
  background: "#fff",
  borderRadius: 6,
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  transform: "translate(30%, -20%)",
};

const cardTitle = { fontSize: 18, fontWeight: 700, color: "#0f172a" };
const cardDesc = {
  fontSize: 13.5,
  color: "#6b7280",
  textAlign: "center",
  marginBottom: 6,
};

const featureList = {
  textAlign: "left",
  paddingLeft: 16,
  marginTop: 6,
  color: "#1f2937",
  lineHeight: 1.5,
  fontSize: 13,
  flex: 1,
};

const cardFooter = { marginTop: "auto", width: "100%" };

const cta = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#184f9b",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const footer = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
};

const footerLogoStyle = { height: 20, objectFit: "contain" };

export default RoleSelectScreen;

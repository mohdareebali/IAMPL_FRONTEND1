import React from "react";

/**
 * EmployeeFairsDoneScreen
 * - UI polished, unchanged logic.
 */

function EmployeeFairsDoneScreen() {
  const fairsDone = [
    { id: 1, name: "FW1176", date: "2025-09-10", vendor: "HAL" },
    { id: 2, name: "NQ7598", date: "2025-08-15", vendor: "RR" },
  ];

  return (
    <div style={containerStyle}>
      <div style={headerWrap}>
        <h2 style={titleStyle}>FAIRs Done</h2>
        <p style={subtitleStyle}>Here is a list of FAIRs you have completed successfully.</p>
      </div>

      <div style={cardContainerStyle}>
        {fairsDone.map((fair) => (
          <div key={fair.id} style={cardStyle}>
            <h3 style={fairNameStyle}>{fair.name}</h3>
            <p style={fairInfoStyle}><strong>Date:</strong> {fair.date}</p>
            <p style={fairInfoStyle}><strong>Vendor:</strong> {fair.vendor}</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={detailsBtn}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = { padding: 28, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial", background: "#f8fafc", minHeight: "100vh" };
const headerWrap = { maxWidth: 1100, margin: "0 auto 18px" };
const titleStyle = { color: "#0f172a", fontSize: 26, marginBottom: 6 };
const subtitleStyle = { color: "#64748b", fontSize: 14, marginBottom: 18 };
const cardContainerStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" };
const cardStyle = { background: "#fff", padding: 18, borderRadius: 10, boxShadow: "0 8px 24px rgba(12,24,48,0.04)" };
const fairNameStyle = { fontSize: 18, color: "#0f172a", marginBottom: 8 };
const fairInfoStyle = { color: "#475569", marginBottom: 10, fontSize: 14 };
const detailsBtn = { padding: "8px 14px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 };

export default EmployeeFairsDoneScreen;

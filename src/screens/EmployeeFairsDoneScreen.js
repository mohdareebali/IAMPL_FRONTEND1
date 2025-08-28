// src/screens/EmployeeFairsDoneScreen.js
import React from "react";

function EmployeeFairsDoneScreen() {
  const fairsDone = [
    { id: 1, name: "FW1176", date: "2025-09-10", vendor: "HAL" },
    { id: 2, name: "NQ7598", date: "2025-08-15", vendor: "RR" },
    
  ];

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Fairs Done</h2>
      <p style={subtitleStyle}>Here is a list of fairs you have completed successfully.</p>

      <div style={cardContainerStyle}>
        {fairsDone.map((fair) => (
          <div key={fair.id} style={cardStyle}>
            <h3 style={fairNameStyle}>{fair.name}</h3>
            <p style={fairInfoStyle}><strong>Date:</strong> {fair.date}</p>
            <p style={fairInfoStyle}><strong>Vendor:</strong> {fair.vendor}</p>
            <button style={detailsBtn}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  padding: "30px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f4f6f8",
  minHeight: "100%",
};

const titleStyle = { color: "#0f172a", fontSize: "28px", marginBottom: "5px" };
const subtitleStyle = { color: "#475569", fontSize: "16px", marginBottom: "25px" };
const cardContainerStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" };
const cardStyle = { background: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)", transition: "transform 0.2s, box-shadow 0.2s" };
const fairNameStyle = { fontSize: "20px", color: "#1e293b", marginBottom: "10px" };
const fairInfoStyle = { color: "#475569", marginBottom: "8px", fontSize: "14px" };
const detailsBtn = { padding: "8px 15px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "10px", transition: "background-color 0.2s" };

export default EmployeeFairsDoneScreen;

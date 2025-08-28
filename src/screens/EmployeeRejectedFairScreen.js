// src/screens/EmployeeRejectedFairScreen.js
import React from "react";

function EmployeeRejectedFairScreen() {
  const rejectedFairs = [
    { id: 1, name: "AL8136", vendor: "HAL" , reason:"1.The Part Number is missmatching"},
  ];

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Rejected Fairs</h2>
      <p style={subtitleStyle}>These fairs were rejected and not approved for participation.</p>

      <div style={cardContainerStyle}>
        {rejectedFairs.map((fair) => (
          <div key={fair.id} style={cardStyle}>
            <h3 style={fairNameStyle}>{fair.name}</h3>
            <p style={fairInfoStyle}><strong>Vendor:</strong> {fair.vendor}</p>
            <p style={fairInfoStyle}><strong>Reasons:</strong> {fair.reason}</p>
            <button style={detailsBtn}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
const detailsBtn = { padding: "8px 15px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "10px", transition: "background-color 0.2s" };

export default EmployeeRejectedFairScreen;

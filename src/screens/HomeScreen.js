import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Innovascape-logo.png"; // <-- adjust path to your logo

function HomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/role");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    position: "relative",
  };

  const footerStyle = {
    position: "absolute",
    bottom: "20px",
    fontSize: "14px",
    color: "#555",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  };

  const logoStyle = {
    height: "40px", // adjust size as needed
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to Our Platform</h1>
      <p>Loading...</p>
      <div style={footerStyle}>
        <span>Created by</span>
        <img src={logo} alt="Innovascape Logo" style={logoStyle} />
      </div>
    </div>
  );
}

export default HomeScreen;

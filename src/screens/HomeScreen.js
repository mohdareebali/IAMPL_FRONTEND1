import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    position: "relative"
  };

  const footerStyle = {
    position: "absolute",
    bottom: "20px",
    fontSize: "14px",
    color: "#555"
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to Our Platform</h1>
      <p>Loading...</p>
      <div style={footerStyle}>Created by Innovascape</div>
    </div>
  );
}

export default HomeScreen;

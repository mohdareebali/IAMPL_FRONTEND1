import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import iamplLogo from "../assets/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.webp";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const SIDEBAR_WIDTH = sidebarOpen ? 220 : 72;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: SIDEBAR_WIDTH,
          background: "linear-gradient(180deg,#071028,#0f172a)",
          color: "#fff",
          transition: "width 0.3s ease",
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 50,
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <img src={iamplLogo} alt="IAMPL" style={{ width: 40, background: "#fff", borderRadius: 6 }} />
          {sidebarOpen && <span style={{ fontWeight: "bold" }}>IAMPL FAIR Portal</span>}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 20 }}>
          <NavItem label="Create Employee" active={location.pathname.includes("employee-setup")} onClick={() => navigate("/dashboard/employee-setup")} />
          <NavItem label="FAIRs Done" active={location.pathname.includes("fairs-done")} onClick={() => navigate("/dashboard/employee-fairs-done")} />
          <NavItem label="FAIRs in Progress" active={location.pathname.includes("fairs-in-progress")} onClick={() => navigate("/dashboard/manager-fairs-in-progress")} />
          <NavItem label="Employee Info" active={location.pathname.includes("employee-info")} onClick={() => navigate("/dashboard/employee-info")} />
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, transition: "margin-left 0.3s ease" }}>
        {/* Topbar */}
        <header style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 20px", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
          <span style={{ marginRight: 20 }}>🔔</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>I</div>
            <div>
              <div style={{ fontWeight: "bold" }}>John Doe</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Employee</div>
            </div>
          </div>
        </header>

        {/* Page Content (EmployeeSetupScreen, etc.) */}
        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 8,
        border: "none",
        background: active ? "#1d4ed8" : "transparent",
        color: active ? "#fff" : "#cbd5e1",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {label}
    </button>
  );
}

export default DashboardLayout;

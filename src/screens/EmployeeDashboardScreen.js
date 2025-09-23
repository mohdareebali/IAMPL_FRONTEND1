// src/screens/EmployeeDashboardScreen.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import iamplLogo from "../assets/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.webp";

/**
 * EmployeeDashboardScreen
 * - Visual parity with Manager dashboard (sidebar, topbar, centered content)
 * - Sidebar collapsed by default, expands on hover, collapses on leave
 * - Click logo (brand) to navigate to /dashboard/employee
 * - Keeps all your existing navigation and employee usage unchanged
 */

function EmployeeDashboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state?.employee || {};

  // hoverOpen controls temporary expanded state (collapsed by default)
  const [hoverOpen, setHoverOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const EXPANDED = 220;
  const COLLAPSED = 72;
  const sidebarOpen = hoverOpen; // visual open if hovered
  const SIDEBAR_WIDTH = sidebarOpen ? EXPANDED : COLLAPSED;

  // helper initials
  const initials = employee.email ? employee.email[0].toUpperCase() : "E";

  return (
    <div style={styles.appRoot}>
      {/* Sidebar */}
      <aside
        aria-label="Employee sidebar"
        style={{ ...styles.sidebar, width: SIDEBAR_WIDTH }}
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => setHoverOpen(false)}
      >
        <div style={styles.sidebarInner}>
          <div
            style={styles.brandRow}
            onClick={() => navigate("/dashboard/employee")}
            role="button"
            title="Go to Employee Dashboard"
          >
            <img src={iamplLogo} alt="IAMPL" style={styles.sidebarLogo} />
            {sidebarOpen && <div style={styles.brandText}>IAMPL FAIR Portal</div>}
          </div>

          <nav style={styles.nav}>
            <NavButton
              open={sidebarOpen}
              label="FAIRs in Progress"
              onClick={() => navigate("/dashboard/employee")}
            />
            <NavButton
              open={sidebarOpen}
              label="FAIRs Done"
              onClick={() => navigate("/employee-fairs-done")}
            />
            <NavButton
              open={sidebarOpen}
              label="NEW FAIRs"
              onClick={() => navigate("/folder-upload")}
            />
          </nav>

          <div style={{ flex: 1 }} />

          <div style={styles.sidebarFooter}>
            {sidebarOpen ? <div style={styles.footerText}>Need help? Contact support</div> : <div style={styles.footerIcon}>?</div>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ ...styles.main, marginLeft: SIDEBAR_WIDTH }}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div style={styles.topbarCenter}>
            <input
              aria-label="Search forms, employees, or data..."
              placeholder="Search forms, employees, or data..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.topbarRight}>
            <button aria-label="Notifications" style={styles.iconButton} onClick={() => navigate("/notifications")}>
              🔔
            </button>

            <div style={{ position: "relative" }}>
              <button
                aria-haspopup="true"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((p) => !p)}
                style={styles.profileButton}
                title="Open profile"
              >
                {initials}
              </button>

              {profileOpen && (
                <div style={styles.profileDropdown} role="menu" aria-label="Profile menu">
                  <div style={styles.profileHeader}>
                    <div style={styles.profileAvatarLarge}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>
                        {employee.email ? employee.email.split("@")[0] : "Employee"}
                      </div>
                      <div style={{ fontSize: 13, color: "#475569" }}>
                        {employee.email || "No email"}
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: "none", height: 1, background: "#eef2ff", margin: "10px 0" }} />

                  <div style={styles.profileInfo}>
                    <ProfileRow label="Employee ID" value={employee.employee_id || "N/A"} />
                    <ProfileRow label="Company ID" value={employee.company_id || "N/A"} />
                    <ProfileRow label="Created" value={employee.created_at ? new Date(employee.created_at).toLocaleString() : "N/A"} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button style={styles.logoutBtn} onClick={() => navigate("/")}>🚪 Logout</button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: 12 }} />

            <div style={{ textAlign: "left" }}>
              
              <div style={{ fontSize: 12, color: "#64748b" }}>Employee</div>
            </div>
          </div>
        </header>

        {/* Content wrapper — centers inner content */}
        <main style={styles.mainInnerWrap}>
          <div style={styles.mainInner}>
            <section style={styles.hero}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>Welcome to the Employee Dashboard</h2>
                <p style={{ marginTop: 8, color: "#6b7280" }}>
                  Select an option from the left menu to continue.
                </p>
              </div>

              <div style={styles.heroActions}>
                <button style={styles.primaryAction} onClick={() => navigate("/folder-upload")}>+ New FAIR</button>
                <button style={styles.secondaryAction} onClick={() => navigate("/employee-fairs-in-progress")}>FAIRs in Progress</button>
              </div>
            </section>

            {/* keep space for additional cards or lists similar to manager dashboard */}
          </div>
        </main>
      </div>
    </div>
  );
}

/* small presentational components */
function NavButton({ open, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: "none",
        background: "transparent",
        color: "#cfe7ff",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        fontSize: 15,
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#60a5fa" }} />
      {open && <span>{label}</span>}
    </button>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#344154", margin: "6px 0" }}>
      <div style={{ color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* styles */
const styles = {
  appRoot: { display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },

  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    background: "linear-gradient(180deg,#071028,#0f172a)",
    color: "#e6eefc",
    transition: "width 200ms ease",
    zIndex: 60,
    overflow: "hidden",
  },
  sidebarInner: { display: "flex", flexDirection: "column", height: "100%", padding: 16, gap: 14 },
  brandRow: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  sidebarLogo: { width: 44, height: 36, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 4 },
  brandText: { fontWeight: 700, color: "#e6eefc" },

  nav: { display: "flex", flexDirection: "column", gap: 8, marginTop: 6 },

  sidebarFooter: { paddingTop: 8, color: "#94a3b8", fontSize: 13 },
  footerText: { color: "#cbd5e1" },
  footerIcon: { color: "#94a3b8" },

  main: { flex: 1, minHeight: "100vh", transition: "margin-left 200ms ease", background: "#f8fafc" },

  topbar: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    borderBottom: "1px solid #eef2ff",
    background: "#fff",
    zIndex: 30,
  },

  topbarCenter: { flex: 1, display: "flex", justifyContent: "center", padding: "0 18px" },
  searchInput: {
    width: "60%",
    maxWidth: 760,
    minWidth: 320,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e6eefc",
    boxShadow: "none",
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },

  topbarRight: { display: "flex", alignItems: "center", gap: 10, minWidth: 220, justifyContent: "flex-end" },

  iconButton: { border: "none", background: "transparent", cursor: "pointer", fontSize: 18 },

  profileButton: { width: 36, height: 36, borderRadius: "50%", background: "#1e293b", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },

  profileDropdown: {
    position: "absolute",
    right: 0,
    top: 46,
    width: 300,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 8px 28px rgba(12,24,48,0.12)",
    padding: 12,
    zIndex: 80,
    textAlign: "left",
  },

  profileHeader: { display: "flex", gap: 12, alignItems: "center" },
  profileAvatarLarge: { width: 48, height: 48, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 },

  profileInfo: { marginTop: 8 },
  logoutBtn: { width: "100%", padding: 10, border: "none", borderRadius: 8, background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 700 },

  mainInnerWrap: { flex: 1, display: "flex", justifyContent: "center", paddingTop: 24, paddingBottom: 40, paddingLeft: 28, paddingRight: 28, boxSizing: "border-box", background: "linear-gradient(180deg,#f8fbff,#f7f9fb)" },

  mainInner: {
    width: "100%",
    maxWidth: 1100,
    transition: "all 220ms ease",
    padding: 28,
    borderRadius: 12,
    background: "linear-gradient(90deg,#ffffff,#f6fbff)",
    boxShadow: "0 10px 30px rgba(12,24,48,0.04)",
    border: "1px dashed rgba(17,24,39,0.06)",
  },

  hero: { background: "linear-gradient(90deg,#ffffff,#f6fbff)", padding: 18, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 6px 18px rgba(12,24,48,0.04)" },

  heroActions: { display: "flex", gap: 10 },
  primaryAction: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#0d47a1", color: "#fff", fontWeight: 700, cursor: "pointer" },
  secondaryAction: { padding: "10px 16px", borderRadius: 8, border: "1px solid #cfe3ff", background: "#fff", color: "#0d47a1", fontWeight: 700, cursor: "pointer" },
};

export default EmployeeDashboardScreen;

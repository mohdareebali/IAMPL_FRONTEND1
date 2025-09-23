// src/screens/ManagerDashboardScreen.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import iamplLogo from "../assets/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.webp";

/**
 * ManagerDashboardScreen
 * - Sidebar supports:
 *   - pinned open/closed via toggle button
 *   - temporary open on hover when unpinned (collapsed)
 * - Keeps all navigation logic unchanged (navigate/goto).
 */

function ManagerDashboardScreen() {
  // pinned: user toggled open/closed (true => pinned open)
  const [pinned, setPinned] = useState(true);
  // hoverOpen: temporary open while mouse is over the rail when not pinned
  const [hoverOpen, setHoverOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const company = location.state?.company || {};

  const initials = company.company_name
    ? company.company_name.split(" ").map((s) => s[0]).slice(0, 2).join("")
    : "MG";

  // computed: actual visual open state
  const sidebarOpen = pinned || hoverOpen;

  // widths for expanded / collapsed
  const EXPANDED = 220;
  const COLLAPSED = 72;
  const SIDEBAR_WIDTH = sidebarOpen ? EXPANDED : COLLAPSED;

  const goto = (path, opts = {}) => navigate(path, opts);

  // handlers for hover behavior
  const handleMouseEnter = () => {
    if (!pinned) setHoverOpen(true);
  };
  const handleMouseLeave = () => {
    if (!pinned) setHoverOpen(false);
  };

  // toggle pinned state (user click)
  const handleTogglePin = () => {
    // when user pins open, keep it open; when unpin, collapse immediately
    const newPinned = !pinned;
    setPinned(newPinned);
    if (!newPinned) {
      // user unpinned, ensure hoverOpen is false until they hover again
      setHoverOpen(false);
    }
  };

  return (
    <div style={styles.appRoot}>
      <style>{responsiveCss}</style>

      {/* Sidebar */}
      <aside
        aria-label="Manager sidebar"
        style={{
          ...styles.sidebar,
          width: SIDEBAR_WIDTH,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={styles.sidebarInner}>
          {/* Brand row */}
          <div style={styles.brandRow}>
            <img src={iamplLogo} alt="IAMPL" style={styles.sidebarLogo} />
            {sidebarOpen && <div style={styles.brandText}>IAMPL FAIR Portal</div>}

            {/* Collapse/expand toggle */}
            <button
              aria-label={pinned ? "Collapse sidebar (pin)" : "Expand sidebar (pin)"}
              onClick={handleTogglePin}
              style={styles.collapseBtn}
              title={pinned ? "Collapse / Unpin" : "Expand / Pin"}
            >
              {/* chevron indicates action; rotate when pinned */}
              <span style={{ transform: pinned ? "rotate(180deg)" : "none", display: "inline-block" }}>
                ⟨
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav style={styles.nav} aria-label="Sidebar navigation">
            <SideNavItem
              open={sidebarOpen}
              label="Create Employee"
              title="Create Employee"
              icon={IconUserPlus}
              onClick={() => goto("/employee-setup")}
            />
            <SideNavItem
              open={sidebarOpen}
              label="FAIRs Done"
              title="FAIRs Done"
              icon={IconCheck}
              onClick={() => goto("/employee-fairs-done")}
            />
            <SideNavItem
              open={sidebarOpen}
              label="FAIRs in Progress"
              title="FAIRs in Progress"
              icon={IconClock}
              onClick={() => goto("/manager-fairs-in-progress")}
            />
            <SideNavItem
              open={sidebarOpen}
              label="Employee Info"
              title="Employee Info"
              icon={IconInfo}
              onClick={() => goto("/employee-info")}
            />
          </nav>

          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={styles.sidebarFooter}>
            {sidebarOpen ? (
              <div style={styles.footerText}>Need help? Contact support</div>
            ) : (
              <div style={styles.footerIcon} aria-hidden>
                ?
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Expand handle (when collapsed and not pinned) — still allow hover, but keep handle for extra discoverability */}
      {!pinned && !hoverOpen && (
        <button
          aria-label="Open sidebar"
          title="Open sidebar"
          onMouseEnter={() => setHoverOpen(true)}
          style={styles.expandHandle}
        >
          ⟩
        </button>
      )}

      {/* Main content */}
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
            <button aria-label="Notifications" style={styles.iconBtn} onClick={() => goto("/notifications")}>
              🔔
            </button>

            <div style={{ width: 12 }} />

            <div style={{ position: "relative" }}>
              <button
                aria-haspopup="true"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((p) => !p)}
                style={styles.avatarBtn}
                title="Open profile"
              >
                {initials}
              </button>

              {profileOpen && (
                <div style={styles.profileDropdown} role="menu" aria-label="Profile menu">
                  <div style={styles.profileHeader}>
                    <div style={styles.profileAvatarLarge}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{company.company_name || "Manager"}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>{company.email || "No email"}</div>
                    </div>
                  </div>

                  <hr style={{ border: "none", height: 1, background: "#eef2ff", margin: "10px 0" }} />

                  <div style={styles.profileInfo}>
                    <ProfileRow label="Company ID" value={company.company_id || "N/A"} />
                    <ProfileRow label="Created" value={company.created_at ? new Date(company.created_at).toLocaleString() : "N/A"} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button style={styles.logoutBtn} onClick={() => navigate("/")}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            

            <div style={{ textAlign: "left" }}>
              
              <div style={{ fontSize: 12, color: "#64748b" }}>Manager</div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main style={styles.content}>
          <section style={styles.hero}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>Welcome, {company.company_name || "Manager"}</h2>
              <p style={{ marginTop: 8, color: "#6b7280" }}>Use the left menu to manage employees and FAIR forms.</p>
            </div>

            <div style={styles.heroActions}>
              <button style={styles.primaryBtn} onClick={() => navigate("/employee-setup")}>+ Create Employee</button>
              <button style={styles.ghostBtn} onClick={() => navigate("/manager-fairs-in-progress")}>View FAIRs in Progress</button>
            </div>
          </section>

          {/* other content unchanged */}
        </main>
      </div>
    </div>
  );
}

/* ---------- Small components ---------- */

function SideNavItem({ open, label, title, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      title={!open ? title : undefined}
      style={{
        ...styles.navItem,
        justifyContent: open ? "flex-start" : "center",
      }}
      aria-label={title}
    >
      <div style={{ width: 28, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Icon size={18} />
      </div>
      {open && <span style={{ marginLeft: 8 }}>{label}</span>}
    </button>
  );
}

/* inline SVG icon components */
function IconUserPlus({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 14a4 4 0 10-6 0" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11v6" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6a3 3 0 116 0 3 3 0 01-6 0z" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClock({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="#60a5fa" strokeWidth="1.6" />
      <path d="M12 8v5l3 2" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconInfo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#60a5fa" strokeWidth="1.6" />
      <path d="M12 8h.01" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.75 12h.5v4h-.5z" fill="#60a5fa" />
    </svg>
  );
}

/* ProfileRow helper */
function ProfileRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", margin: "6px 0" }}>
      <div style={{ color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* ---------- styles ---------- */
const styles = {
  appRoot: { display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },

  /* Sidebar */
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    background: "linear-gradient(180deg,#071028,#0f172a)",
    color: "#e6eefc",
    transition: "width 200ms ease",
    zIndex: 40,
    overflow: "hidden",
  },
  sidebarInner: { display: "flex", flexDirection: "column", height: "100%", padding: 18, gap: 16 },
  brandRow: { display: "flex", alignItems: "center", gap: 10 },
  sidebarLogo: { width: 44, height: 36, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 4 },
  brandText: { fontWeight: 700, color: "#e6eefc", fontSize: 15 },
  collapseBtn: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 14,
    padding: "6px 8px",
    borderRadius: 6,
  },

  /* Expand handle (visible only when unpinned and not hovered) */
  expandHandle: {
    position: "fixed",
    left: 8,
    top: "50%",
    transform: "translateY(-50%)",
    width: 36,
    height: 48,
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    zIndex: 60,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(2,6,23,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Nav */
  nav: { marginTop: 12, display: "flex", flexDirection: "column", gap: 8 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 8px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#cfe7ff",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    fontSize: 15,
  },

  /* footer */
  sidebarFooter: { paddingTop: 12, color: "#94a3b8", fontSize: 13 },
  footerText: { color: "#cbd5e1" },
  footerIcon: { color: "#94a3b8" },

  /* Main */
  main: { flex: 1, minHeight: "100vh", transition: "margin-left 200ms ease", background: "#f8fafc" },

  /* Topbar */
  topbar: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 22px",
    borderBottom: "1px solid #eef2ff",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  topbarCenter: { flex: 1, display: "flex", justifyContent: "center", padding: "0 18px" },
  searchInput: {
    width: "60%",
    maxWidth: 760,
    minWidth: 320,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e6eefc",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 10, minWidth: 220, justifyContent: "flex-end" },
  iconBtn: { border: "none", background: "transparent", cursor: "pointer", fontSize: 18 },
  avatarBtn: { width: 40, height: 40, borderRadius: "50%", background: "#183043", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 },

  profileDropdown: {
    position: "absolute",
    right: 0,
    top: 48,
    width: 300,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    padding: 12,
    zIndex: 80,
  },
  profileHeader: { display: "flex", gap: 12, alignItems: "center" },
  profileAvatarLarge: { width: 48, height: 48, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 },
  profileInfo: { marginTop: 8 },
  logoutBtn: { width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 700 },

  /* Content */
  content: { padding: 28 },
  hero: {
    background: "linear-gradient(90deg,#ffffff,#f6fbff)",
    padding: 18,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    boxShadow: "0 8px 20px rgba(12,24,48,0.04)",
  },
  heroActions: { display: "flex", gap: 10 },
  primaryBtn: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#0d47a1", color: "#fff", fontWeight: 700, cursor: "pointer" },
  ghostBtn: { padding: "10px 16px", borderRadius: 8, border: "1px solid #cfe3ff", background: "#fff", color: "#0d47a1", fontWeight: 700, cursor: "pointer" },
};

/* responsive tweaks */
const responsiveCss = `
  @media (max-width: 980px) {
    aside[aria-label="Manager sidebar"] { width: 72px !important; }
    div[style*="margin-left"] { margin-left: 72px !important; }
    input[aria-label="Search forms, employees, or data..."] { width: 70% !important; min-width: 180px !important; }
  }
`;

export default ManagerDashboardScreen;

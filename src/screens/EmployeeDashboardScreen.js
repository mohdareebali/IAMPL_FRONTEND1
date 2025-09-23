// src/screens/EmployeeDashboardScreen.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * EmployeeDashboardScreen — IAMPL FAIR Portal style (full file)
 *
 * - White left sidebar (collapsed by default, expands on hover)
 * - Click brand/logo navigates to manager dashboard
 * - Topbar: centered search, notifications, profile dropdown
 * - Main area: Overview / My FAIR Forms / Completed / Help sections (UI only)
 *
 * NOTE: Place the IAMPL logo at:
 *   public/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg
 */

function EmployeeDashboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state?.employee || {
    name: "John Doe",
    role: "Employee",
    email: "john.doe@example.com",
  };

  // UI state
  const [activePage, setActivePage] = useState("overview"); // overview | forms | completed | help
  const [collapsed, setCollapsed] = useState(true); // collapsed by default, expands on hover
  const [profileOpen, setProfileOpen] = useState(false);

  // hover handlers: expand when mouse enters, collapse when leaves
  const handleSidebarMouseEnter = () => setCollapsed(false);
  const handleSidebarMouseLeave = () => setCollapsed(true);

  // click brand -> manager dashboard
  const onBrandClick = () => {
    navigate("/dashboard/manager");
  };

  // close profile when page changes
  useEffect(() => {
    setProfileOpen(false);
  }, [activePage]);

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          width: collapsed ? 80 : 260,
        }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        aria-label="Main navigation"
      >
        <div
          style={styles.brand}
          onClick={onBrandClick}
          role="button"
          tabIndex={0}
          aria-label="Go to manager dashboard"
        >
          {/* ✅ Updated logo reference */}
          <img
            src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg"
            alt="IAMPL FAIR Portal"
            style={styles.brandLogo}
          />
          {!collapsed && <div style={styles.brandText}>IAMPL FAIR Portal</div>}
        </div>

        <nav style={styles.menu} aria-label="Sidebar menu">
          <SideItem
            open={!collapsed}
            active={activePage === "overview"}
            label="Overview"
            onClick={() => setActivePage("overview")}
            icon="▣"
          />
          <SideItem
            open={!collapsed}
            active={activePage === "forms"}
            label="My FAIR Forms"
            onClick={() => setActivePage("forms")}
            icon="📋"
          />
          <SideItem
            open={!collapsed}
            active={activePage === "completed"}
            label="Completed Forms"
            onClick={() => setActivePage("completed")}
            icon="✅"
          />
          <SideItem
            open={!collapsed}
            active={activePage === "help"}
            label="Help"
            onClick={() => setActivePage("help")}
            icon="❓"
          />
        </nav>

        <div style={{ flex: 1 }} />

        <div style={styles.sidebarFooter}>
          {!collapsed ? "Need help? Contact support" : <span style={styles.footerIcon}>?</span>}
        </div>
      </aside>

      {/* Main column */}
      <div style={{ ...styles.main, marginLeft: collapsed ? 80 : 260 }}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div style={styles.topbarLeft} />

          <div style={styles.topbarCenter}>
            <input
              aria-label="Search forms, employees, or data..."
              placeholder="Search forms, employees, or data..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.topbarRight}>
            <button aria-label="Notifications" style={styles.iconBtn} onClick={() => navigate("/notifications")}>
              🔔
            </button>

            <div style={{ width: 12 }} />

            <div style={{ position: "relative" }}>
              <button
                aria-haspopup="true"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((p) => !p)}
                style={styles.profileBtn}
                title="Open profile"
              >
                {employee.name ? employee.name[0].toUpperCase() : "E"}
              </button>

              {profileOpen && (
                <div style={styles.profileDropdown} role="menu" aria-label="Profile menu">
                  <div style={styles.profileHeader}>
                    <div style={styles.profileAvatarLarge}>
                      {employee.name ? employee.name[0].toUpperCase() : "E"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{employee.name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{employee.role}</div>
                    </div>
                  </div>

                  <hr style={{ border: "none", height: 1, background: "#eef2ff", margin: "10px 0" }} />

                  <div style={styles.profileInfo}>
                    <ProfileRow label="Email" value={employee.email || "N/A"} />
                    <ProfileRow label="Employee ID" value={employee.employee_id || "N/A"} />
                    <ProfileRow label="Company ID" value={employee.company_id || "N/A"} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button
                      style={styles.logoutBtn}
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={styles.content}>
          {activePage === "overview" && <Overview employee={employee} />}
          {activePage === "forms" && <MyForms />}
          {activePage === "completed" && <CompletedForms />}
          {activePage === "help" && <HelpPage />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function SideItem({ open, label, onClick, active, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: open ? "12px 14px" : "12px 8px",
        borderRadius: 8,
        border: "none",
        background: active ? "#e6f0ff" : "transparent",
        color: active ? "#184f9b" : "#0b2540",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        fontSize: 15,
      }}
      aria-current={active ? "page" : undefined}
    >
      <div style={{ width: 28, textAlign: "center", color: active ? "#184f9b" : "#64748b" }}>{icon}</div>
      {open && <span>{label}</span>}
    </button>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", margin: "6px 0" }}>
      <div style={{ color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* ---------------- Pages ---------------- */

function Overview({ employee }) {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Welcome back, {employee.name || "John Doe"}!</h1>
      <p style={{ color: "#64748b", marginTop: 8 }}>Complete your assigned FAIR forms easily and effectively. Track your progress too.</p>

      <div style={{ marginTop: 18 }}>
        <div style={kpiStyles.strip}>
          <KpiItem icon="time" value="12hrs" title="Time Saved" />
          <KpiDivider />
          <KpiItem icon="forms" value="32" title="Forms Completion" />
          <KpiDivider />
          <KpiItem icon="fta" value="23" title="FTA" />
          <KpiDivider />
          <KpiItem icon="past" value="7" title="Past Due Date" />
          <KpiDivider />
          <KpiItem icon="inprogress" value="7" title="Forms In-Progress" />
          <KpiDivider />
          <KpiItem icon="total" value="40" title="Total Forms" />
        </div>
      </div>

      <h3 style={{ marginTop: 28 }}>My Tasks and Progress</h3>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <button style={styles.filterPill}>Part Number | ABC123 ▾</button>
        <button style={styles.filterPill}>Customer | RR ▾</button>
      </div>

      <table style={styles.table}>
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th style={styles.th}>Part Number</th>
            <th style={styles.th}>Customer Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Due Date</th>
            <th style={styles.th}>Priority</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          <TaskRow part="ABC123" customer="RR" type="Initial Submission" status="In-Progress" due="01/02/2025" priority="High" />
          <TaskRow part="XYZ124" customer="GE" type="Re-Submission" status="In-Progress" due="01/02/2025" priority="Medium" />
          <TaskRow part="ABC125" customer="RR" type="Initial Submission" status="Assigned" due="01/02/2025" priority="Low" />
        </tbody>
      </table>
    </div>
  );
}

/* KPI components & styles (pill) */

function KpiItem({ title, value, icon }) {
  return (
    <div style={kpiStyles.item}>
      <div style={kpiStyles.iconWrap}>{getKpiIcon(icon)}</div>

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <div style={kpiStyles.value}>{value}</div>
        <div style={kpiStyles.title}>{title}</div>
      </div>
    </div>
  );
}

function KpiDivider() {
  return <div style={kpiStyles.divider} aria-hidden="true" />;
}

/* small inline SVG icons */
function getKpiIcon(name) {
  const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" };
  switch (name) {
    case "time":
      return (
        <svg {...base}>
          <path d="M12 7v6l4 2" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke="#0f172a" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "forms":
      return (
        <svg {...base}>
          <path d="M8 7h8M8 12h8M8 17h5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="#0f172a" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "fta":
      return (
        <svg {...base}>
          <path d="M12 2v7" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 22H4" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 12l5 5 5-5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "past":
      return (
        <svg {...base}>
          <path d="M10 14l2-2 2 2" stroke="#b91c1c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke="#b91c1c" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "inprogress":
      return (
        <svg {...base}>
          <path d="M3 12h4l3 8 4-16 3 8h4" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "total":
      return (
        <svg {...base}>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const kpiStyles = {
  strip: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 999,
    background: "#ffffff",
    boxShadow: "0 6px 16px rgba(12,24,48,0.08)",
    border: "1px solid rgba(2,6,23,0.03)",
    maxWidth: "100%",
    overflow: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 120,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 -2px 0 rgba(2,6,23,0.02)",
  },
  value: {
    fontWeight: 800,
    fontSize: 16,
    color: "#0f172a",
  },
  title: {
    fontSize: 13,
    color: "#475569",
  },
  divider: {
    width: 1,
    height: 36,
    background: "linear-gradient(180deg, rgba(14,36,70,0.04), rgba(14,36,70,0.02))",
    borderRadius: 2,
    margin: "0 6px",
  },
};

/* Tasks / Table */

function TaskRow({ part, customer, type, status, due, priority }) {
  return (
    <tr>
      <td style={styles.td}>{part}</td>
      <td style={styles.td}>{customer}</td>
      <td style={styles.td}>{type}</td>
      <td style={styles.td}>{status}</td>
      <td style={styles.td}>📅 {due}</td>
      <td style={styles.td}>
        <PriorityTag level={priority} />
      </td>
      <td style={{ ...styles.td, textAlign: "right" }}>
        <button style={styles.primaryActionSmall}>Continue</button>
      </td>
    </tr>
  );
}

function PriorityTag({ level }) {
  const map = {
    High: { bg: "#fff1f2", color: "#b91c1c" },
    Medium: { bg: "#fff7ed", color: "#b45309" },
    Low: { bg: "#eef2ff", color: "#1e40af" },
  };
  const s = map[level] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "6px 10px", borderRadius: 999, fontSize: 13 }}>
      ● {level}
    </span>
  );
}

/* MyForms (card layout) */
function MyForms() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>My FAIR Forms</h1>
      <p style={{ color: "#64748b" }}>First Article Inspection Reports</p>

      <div style={{ margin: "12px 0", display: "flex", gap: 8 }}>
        <span style={styles.filterPill}>Part Number: ABC123</span>
        <span style={styles.filterPill}>Customer: RR</span>
      </div>

      <div style={styles.cardGrid}>
        <FormCard title="Form 1 - Basic Information" priority="High" progress={45} />
        <FormCard title="Form 2 - Technical Specifications" priority="Medium" progress={0} />
        <FormCard title="Form 3 - Quality Assurance" priority="Low" progress={0} />
      </div>
    </div>
  );
}

function FormCard({ title, priority, progress }) {
  return (
    <div style={styles.formCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <PriorityTag level={priority} />
      </div>

      <div style={{ marginTop: 8, color: "#6b7280" }}>Due Date: 01/02/2025</div>

      <div style={{ marginTop: 12 }}>
        <div style={styles.progressOuter}>
          <div style={{ ...styles.progressInner, width: `${progress}%` }} />
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>Progress: {progress}%</div>
      </div>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
        <button style={styles.startBtn}>Start Form</button>
      </div>
    </div>
  );
}

/* Completed forms */
function CompletedForms() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Completed Forms</h1>
      <p style={{ color: "#64748b" }}>Your completed FAIR forms will appear here.</p>
      <div style={{ marginTop: 18, color: "#64748b" }}>No completed forms yet.</div>
    </div>
  );
}

/* Help (accordion) */
function HelpPage() {
  const faqs = [
    {
      q: "How do I get started with the FAIR Form Management system?",
      a: "Login with your credentials. Use the dashboard to view assigned forms and begin with high priority items first.",
    },
    { q: "How do I know which forms to prioritize?", a: "Forms marked 'High' or 'Critical' should be prioritized." },
    { q: "What is Form 1 about?", a: "Form 1 captures basic part information." },
    { q: "What is Form 2 about?", a: "Form 2 covers technical specifications." },
    { q: "What is Form 3 about?", a: "Form 3 captures QA checkpoints." },
  ];

  const [open, setOpen] = useState(null);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Help</h1>
      <p style={{ color: "#64748b" }}>Find quick answers, guides, and support to resolve your questions easily.</p>

      <div style={{ marginTop: 12 }}>
        {faqs.map((f, idx) => (
          <div key={idx} style={styles.accordion}>
            <div style={styles.accordionHeader} onClick={() => setOpen(open === idx ? null : idx)}>
              <div>{f.q}</div>
              <div>{open === idx ? "▲" : "▼"}</div>
            </div>
            {open === idx && <div style={styles.accordionBody}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },

  /* Sidebar (white style) */
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    background: "#ffffff", // white sidebar
    color: "#0f172a",
    padding: 16,
    transition: "width 180ms ease",
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e6eefc",
    boxSizing: "border-box",
  },
  brand: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18, cursor: "pointer" },
  brandLogo: { width: 44, height: 36, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 4, border: "1px solid #eef2ff" },
  brandText: { fontWeight: 800, fontSize: 16, color: "#0f172a" },

  menu: { display: "flex", flexDirection: "column", gap: 8, marginTop: 6 },
  sidebarFooter: { paddingTop: 12, color: "#64748b", fontSize: 13 },
  footerIcon: { fontSize: 14, color: "#94a3b8" },

  main: { flex: 1, transition: "margin-left 180ms ease" },

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
  topbarLeft: { display: "flex", alignItems: "center", gap: 12, minWidth: 220 },
  topbarCenter: { flex: 1, display: "flex", justifyContent: "center", padding: "0 18px" },
  searchInput: {
    width: "60%",
    maxWidth: 760,
    minWidth: 300,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e6eefc",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 10, minWidth: 220, justifyContent: "flex-end" },

  iconBtn: { border: "none", background: "transparent", cursor: "pointer", fontSize: 18 },

  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileDropdown: {
    position: "absolute",
    right: 0,
    top: 50,
    width: 300,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    padding: 12,
    zIndex: 80,
  },
  profileHeader: { display: "flex", gap: 12, alignItems: "center" },
  profileAvatarLarge: { width: 48, height: 48, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 },

  logoutBtn: { width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer" },

  content: { padding: 28, background: "#f8fafc", minHeight: "calc(100vh - 72px)" },

  filterPill: { padding: "8px 12px", borderRadius: 8, border: "1px solid #dbeafe", background: "#f1f8ff", color: "#184f9b", fontSize: 13, cursor: "pointer" },

  table: { width: "100%", borderCollapse: "collapse", marginTop: 18, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(12,24,48,0.04)" },
  th: { padding: "14px 18px", textAlign: "left", color: "#0f172a", fontWeight: 700 },
  td: { padding: "18px 20px", borderBottom: "1px solid #eef2ff", color: "#0f172a" },

  primaryActionSmall: { background: "#184f9b", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" },

  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 18 },
  formCard: { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e6eefc" },

  progressOuter: { height: 8, borderRadius: 6, background: "#f3f4f6", marginTop: 8 },
  progressInner: { height: "100%", borderRadius: 6, background: "#184f9b" },

  startBtn: { padding: "10px 16px", background: "#184f9b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },

  accordion: { border: "1px solid #e6eefc", borderRadius: 8, marginTop: 12, overflow: "hidden" },
  accordionHeader: { padding: 12, display: "flex", justifyContent: "space-between", cursor: "pointer", background: "#fff" },
  accordionBody: { padding: 12, background: "#fbfdff", color: "#475569" },
};

export default EmployeeDashboardScreen;

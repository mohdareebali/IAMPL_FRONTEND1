// src/screens/EmployeeDashboardScreen.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { initNotifications } from "./notification";

/**
 * EmployeeDashboardScreen — IAMPL FAIR Portal style (full file)
 *
 * - White left sidebar (collapsed by default, expands on hover)
 * - Click brand/logo navigates to manager dashboard
 * - Topbar: left-aligned search with icon, notifications, profile dropdown
 * - Main area: Overview / My FAIR Forms / Completed / Help sections (UI only)
 *
 * NOTE: Place the IAMPL logo at:
 *   public/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg
 *
 * Only UI/visual changes for topbar (search icon inside input and profile layout).
 * No logic changes to behavior or navigation.
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
  // state with saved value
  const [activePage, setActivePage] = useState(
    localStorage.getItem("employeeDashboardPage") || "overview"
  );

  // update storage when activePage changes
  useEffect(() => {
    localStorage.setItem("employeeDashboardPage", activePage);
  }, [activePage]);

  const [collapsed, setCollapsed] = useState(true); // collapsed by default, expands on hover
  const [profileOpen, setProfileOpen] = useState(false);

  // hover handlers: expand when mouse enters, collapse when leaves
  const handleSidebarMouseEnter = () => setCollapsed(false);
  const handleSidebarMouseLeave = () => setCollapsed(true);

  // click brand -> manager dashboard
  const onBrandClick = () => {
    navigate("/dashboard/employee");
  };

  // close profile when page changes
  useEffect(() => {
    setProfileOpen(false);
  }, [activePage]);

  // ✅ Init notification panel for the bell (no logic change elsewhere)
  useEffect(() => {
    initNotifications("notification-bell");
  }, []);

  return (
    // Zoom wrapper
    <div style={styles.zoomWrapper}>
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
            onKeyDown={(e) => {
              // accessibility: activate on Enter/Space without changing navigation logic
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBrandClick();
              }
            }}
          >
            <img
              src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.jpg"
              alt="IAMPL FAIR Portal"
              style={styles.brandLogo}
            />
            {!collapsed && <div>FAIR Portal</div>}
          </div>

          {/* Replaced invalid <h7> with an accessible label without changing layout intent */}
          <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0 8px 2px" }} aria-hidden>
            Menu
          </div>

          <nav style={styles.menu} aria-label="Sidebar menu">
            {/* icon prop now accepts the inline SVG key names */}
            <SideItem
              open={!collapsed}
              active={activePage === "overview"}
              label="Overview"
              onClick={() => setActivePage("overview")}
              icon="overview"
            />
            <SideItem
              open={!collapsed}
              active={activePage === "forms"}
              label="My FAIR Forms"
              onClick={() => setActivePage("forms")}
              icon="forms"
            />
            <SideItem
              open={!collapsed}
              active={activePage === "completed"}
              label="Completed Forms"
              onClick={() => setActivePage("completed")}
              icon="completed"
            />
            <SideItem
              open={!collapsed}
              active={activePage === "help"}
              label="Help"
              onClick={() => setActivePage("help")}
              icon="help"
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
            {/* LEFT: search input with icon */}
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon} aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 18, height: 18 }}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                  />
                </svg>
              </span>

              <input
                type="text"
                aria-label="Search forms, employees, or data..."
                placeholder="Search forms, employees, or data..."
                style={styles.searchInput}
              />
            </div>

            {/* RIGHT: notifications + profile */}
            <div style={styles.topbarRight}>
              <button
                id="notification-bell"
                aria-label="Notifications"
                style={styles.iconBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 22, height: 22 }}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 
                       8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 
                       8.967 0 01-2.311 6.022c1.733.64 
                       3.56 1.085 5.454 1.31m5.714 0a24.255 
                       24.255 0 01-5.714 0m5.714 0a3 3 0 
                       11-5.714 0"
                  />
                </svg>
              </button>

              <div style={{ width: 12 }} />

              <div style={{ position: "relative" }}>
  <button
    aria-haspopup="true"
    aria-expanded={profileOpen}
    onClick={() => setProfileOpen((p) => !p)}
    style={styles.profileContainer}
    title="Open profile"
  >
    <div style={styles.profileAvatarImg}>
      {employee.name ? employee.name[0].toUpperCase() : "E"}
    </div>
    <div style={{ marginLeft: 10, textAlign: "left" }}>
      <div style={styles.profileName}>{employee.name || "John Doe"}</div>
      <div style={styles.profileRole}>{employee.role || "Employee"}</div>
    </div>
    <div style={{ marginLeft: 10, color: "#64748b" }}>▾</div>
  </button>

  {profileOpen && (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 50,
        width: 200,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "8px 0",
        zIndex: 100,
      }}
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          color: "#0f172a",
        }}
        onClick={() => { setActivePage("profile"); setProfileOpen(false); }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8" r="4" stroke="#0f172a" strokeWidth="1.6" />
          <path
            d="M4 20c1-4 7-6 8-6s7 2 8 6"
            stroke="#0f172a"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        My Profile
      </button>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          color: "#b91c1c",
          fontWeight: 600,
        }}
        onClick={() => navigate("/")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
            stroke="#b91c1c"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 17l5-5-5-5M15 12H3"
            stroke="#b91c1c"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Logout
      </button>
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
            {activePage === "profile" && <MyProfile employee={employee} />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

/**
 * SideItem — professional inline SVG icons
 *
 * - open: boolean - whether sidebar is expanded (controls label visibility)
 * - active: boolean - which menu item is active
 * - icon: string - key for which SVG to render ("overview" | "forms" | "completed" | "help")
 *
 * NOTE: Only presentation changes. Logic and click behaviour unchanged.
 */
function SideItem({ open, label, onClick, active, icon }) {
  const baseStyle = {
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
    transition:
      "background 220ms cubic-bezier(.2,.9,.2,1), color 220ms cubic-bezier(.2,.9,.2,1), transform 220ms cubic-bezier(.2,.9,.2,1)",
    willChange: "transform, background",
    outline: "none",
  };

  const labelStyle = {
    display: "inline-block",
    opacity: open ? 1 : 0,
    transform: open ? "translateX(0)" : "translateX(-8px)",
    transition: "opacity 220ms ease, transform 220ms ease",
    whiteSpace: "nowrap",
    pointerEvents: open ? "auto" : "none",
  };

  // Inline SVG icon mapping
  const IconSvg = ({ name, active }) => {
    const stroke = active ? "#184f9b" : "#64748b";
    const size = 22;
    switch (name) {
      case "overview":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={stroke} strokeWidth="1.6" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={stroke} strokeWidth="1.6" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={stroke} strokeWidth="1.6" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={stroke} strokeWidth="1.6" />
          </svg>
        );
      case "forms":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect x="4" y="3" width="16" height="18" rx="2" stroke={stroke} strokeWidth="1.6" />
            <path d="M8 8h8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 12h8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 16h5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "completed":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect x="4" y="3" width="16" height="18" rx="2" stroke={stroke} strokeWidth="1.6" />
            <path
              d="M8.5 12.5l2.2 2.2L16 10.4"
              stroke="#16a34a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "help":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" />
            <path
              d="M9.5 10.5c0-1.1 1-1.9 2.5-1.9 1.5 0 2.5.8 2.5 2.1 0 1.7-1.5 2-2.2 2.9-.4.5-.3 1.1-.3 1.1"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="17" r="0.6" fill={stroke} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(6px)";
        if (!active) e.currentTarget.style.background = "rgba(14,36,70,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(0)";
        if (!active) e.currentTarget.style.background = "transparent";
      }}
      aria-current={active ? "page" : undefined}
    >
      <div
        style={{
          width: 28,
          textAlign: "center",
          color: active ? "#184f9b" : "#64748b",
          transition:
            "color 220ms cubic-bezier(.2,.9,.2,1), transform 220ms cubic-bezier(.2,.9,.2,1)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden="true"
      >
        <IconSvg name={icon} active={active} />
      </div>

      <span style={labelStyle}>{label}</span>
    </button>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: "#374151",
        margin: "6px 0",
      }}
    >
      <div style={{ color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* ---------------- Pages ---------------- */

function Overview({ employee }) {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>
        Welcome back, {employee.name || "John Doe"}!
      </h1>
      <p style={{ color: "#64748b", marginTop: 8 }}>
        Complete your assigned FAIR forms easily and effectively. Track your progress too.
      </p>

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
            <th style={styles.th}>Action</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          <TaskRow
            part="ABC123"
            customer="RR"
            type="Initial Submission"
            status="In-Progress"
            due="01/02/2025"
            priority="High"
          />
          <TaskRow
            part="XYZ124"
            customer="GE"
            type="Re-Submission"
            status="In-Progress"
            due="01/02/2025"
            priority="Medium"
          />
          <TaskRow
            part="ABC125"
            customer="RR"
            type="Initial Submission"
            status="Assigned"
            due="01/02/2025"
            priority="Low"
          />
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
  const base = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };
  switch (name) {
    case "time":
      return (
        <svg {...base}>
          <path
            d="M12 7v6l4 2"
            stroke="#0f172a"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="#0f172a" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "forms":
      return (
        <svg {...base}>
          <path
            d="M8 7h8M8 12h8M8 17h5"
            stroke="#0f172a"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
          <path
            d="M3 12h4l3 8 4-16 3 8h4"
            stroke="#b45309"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
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
    maxWidth: "95%",
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
    background:
      "linear-gradient(180deg, rgba(14,36,70,0.04), rgba(14,36,70,0.02))",
    borderRadius: 2,
    margin: "0 6px",
  },
};

/* Tasks / Table */

function TaskRow({ part, customer, type, status, due, priority, Action }) {
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
        {Action ? (
          Action
        ) : (
          <button style={styles.primaryActionSmall}>Continue</button>
        )}
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
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 13,
      }}
    >
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

      {/* cardGrid updated — two-column-like card layout similar to screenshot */}
      <div style={styles.cardGrid}>
        <FormCard
          title="Form 1:"
          subtitle="Part Number Accountability"
          priority="High"
          progress={45}
        />
        <FormCard
          title="Form 2:"
          subtitle="Product Accountability - Materials, Special Processes, and Functional Testing"
          priority="High"
          progress={45}
        />
        <FormCard
          title="Form 3:"
          subtitle="Characteristic Accountability, Verification and Compatibility Evaluation"
          priority="High"
          progress={45}
        />
      </div>
    </div>
  );
}

/* ---------- Updated FormCard: visual layout matches screenshot ---------- */
function FormCard({ title, subtitle, priority, progress }) {
  const navigate = useNavigate();

  const handleStart = () => {
    // If it's Form 1, navigate to your folder upload screen
    if (title && title.toLowerCase().includes("form 1")) {
      navigate("/folder-upload");
    } else {
      navigate("/form-start", { state: { title } });
    }
  };

  return (
    <div style={styles.formCard}>
      <div style={styles.formCardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.formIcon} aria-hidden>
            {/* small document icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="3" y="3" width="14" height="18" rx="2" stroke="#0f172a" strokeWidth="1.2" fill="none" />
              <path d="M8 8h6" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12h6" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{title}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{subtitle}</div>
          </div>
        </div>

        <div style={styles.priorityBadge}>
          <span style={{ marginRight: 6, color: "#b91c1c" }}>●</span>
          <span style={{ color: "#b91c1c", fontWeight: 600 }}>{priority}</span>
        </div>
      </div>

      <div style={styles.formCardBody}>
        <div style={{ marginTop: 12 }}>
          <div style={styles.progressLabel}>Progress: {progress}%</div>
          <div style={styles.progressOuter}>
            <div style={{ ...styles.progressInner, width: `${progress}%` }} />
          </div>
        </div>

        <div style={styles.formDetails}>
          <div style={styles.detailBlock}>
            <div style={styles.detailTitle}>Part Number</div>
            <div style={styles.detailValue}>ABC123</div>
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailTitle}>Customer Name</div>
            <div style={styles.detailValue}>RR</div>
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailTitle}>Assigned Date</div>
            <div style={styles.detailValue}>01/02/2025</div>
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailTitle}>Due Date</div>
            <div style={styles.detailValue}>02/02/2025</div>
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailTitle}>Completed Date</div>
            <div style={styles.detailValue}>--</div>
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailTitle}>Completion Time</div>
            <div style={styles.detailValue}>--</div>
          </div>
        </div>
      </div>

      <div style={styles.formCardFooter}>
        <button style={styles.startBtn} onClick={handleStart}>
          Start Form
          <span style={{ marginLeft: 8 }}>›</span>
        </button>
      </div>
    </div>
  );
}

/* Completed forms — updated UI to match screenshot provided */
function CompletedForms() {
  const navigate = useNavigate();

  // Example completed forms data that mirrors MyForms layout (UI-only)
  const completed = [
    {
      id: 1,
      title: "Form 1:",
      subtitle: "Part Number Accountability",
      priority: "High",
      progress: 45,
      completedDate: "01/02/2025",
      completionTime: "3 hrs",
    },
    {
      id: 2,
      title: "Form 2:",
      subtitle:
        "Product Accountability - Materials, Special Processes, and Functional Testing",
      priority: "High",
      progress: 45,
      completedDate: "01/02/2025",
      completionTime: "3 hrs",
    },
    {
      id: 3,
      title: "Form 3:",
      subtitle:
        "Characteristic Accountability, Verification and Compatibility Evaluation",
      priority: "High",
      progress: 45,
      completedDate: "01/02/2025",
      completionTime: "3 hrs",
    },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Completed Forms</h1>
      <p style={{ color: "#64748b" }}>First Article Inspection Reports</p>

      {/* Filter row like screenshot */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.filterPill}>All ▾</button>
          <button style={styles.filterPill}>Part Number ▾</button>
        </div>
      </div>

      {/* Cards grid */}
      <div style={styles.cardGrid}>
        {completed.map((c) => (
          <div key={c.id} style={styles.formCard}>
            <div style={styles.formCardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={styles.formIcon} aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <rect x="3" y="3" width="14" height="18" rx="2" stroke="#0f172a" strokeWidth="1.2" fill="none" />
                    <path d="M8 8h6" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12h6" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{c.title}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{c.subtitle}</div>
                </div>
              </div>

              <div style={styles.priorityBadge}>
                <span style={{ marginRight: 6, color: "#b91c1c" }}>●</span>
                <span style={{ color: "#b91c1c", fontWeight: 600 }}>{c.priority}</span>
              </div>
            </div>

            <div style={styles.formCardBody}>
              <div style={{ marginTop: 12 }}>
                <div style={styles.progressLabel}>Progress: {c.progress}%</div>
                <div style={styles.progressOuter}>
                  <div style={{ ...styles.progressInner, width: `${c.progress}%` }} />
                </div>
              </div>

              <div style={styles.formDetails}>
                <div style={styles.detailBlock}>
                  <div style={styles.detailTitle}>Part Number</div>
                  <div style={styles.detailValue}>ABC123</div>
                </div>

                <div style={styles.detailBlock}>
                  <div style={styles.detailTitle}>Customer Name</div>
                  <div style={styles.detailValue}>RR</div>
                </div>

                <div style={styles.detailBlock}>
                  <div style={styles.detailTitle}>Assigned Date</div>
                  <div style={styles.detailValue}>01/02/2025</div>
                </div>

                <div style={styles.detailBlock}>
                  <div style={styles.detailTitle}>Due Date</div>
                  <div style={styles.detailValue}>02/02/2025</div>
                </div>

                <div style={styles.detailBlock}>
                  <div style={styles.detailTitle}>Completed Date</div>
                  <div style={styles.detailValue}>{c.completedDate}</div>
                </div>

                <div style={styles.detailBlock}>
                  <div style={styles.detailTitle}>Completion Time</div>
                  <div style={styles.detailValue}>{c.completionTime}</div>
                </div>
              </div>
            </div>

            <div style={styles.formCardFooter}>
              <button
                style={styles.viewBtn}
                onClick={() => {
                  // keep navigation logic same as UI: go to form view (example route)
                  navigate("/form-view", { state: { title: c.title } });
                }}
                aria-label={`View ${c.title}`}
                title="View Form"
              >
                {/* professional eye icon (inline SVG) */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  style={{ marginRight: 8 }}
                >
                  <path
                    d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                    stroke="#184f9b"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="#184f9b"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                View Form
              </button>
            </div>
          </div>
        ))}
      </div>
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
      <p style={{ color: "#64748b" }}>
        Find quick answers, guides, and support to resolve your queries easily.
      </p>

      <div style={{ marginTop: 12 }}>
        {faqs.map((f, idx) => (
          <div key={idx} style={styles.accordion}>
            <div
              style={styles.accordionHeader}
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <div>{f.q}</div>
              <div>{open === idx ? "▲" : "▼"}</div>
            </div>
            {open === idx && <div style={styles.accordionBody}>{f.a}</div>}
          </div>
        ))}
      </div>

      {/* User Manual download card */}
      <div style={{ marginTop: 18 }}>
        <div style={styles.downloadCard}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>User Manual</div>
          <div style={{ color: "#64748b", marginBottom: 12 }}>
            Get step-by-step guidance and detailed instructions in our User Manual.
          </div>

          

          {/* Anchor with download attribute — place your PDF at public/user-manual.pdf (or change path later) */}
          <a
            href="/user-manual.pdf"
            download
            style={styles.downloadAnchor}
            aria-label="Download User Manual"
            title="Download User Manual"
          >
            <button style={styles.downloadBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: 8 }}
              >
                <path d="M12 3v12" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 11l4 4 4-4" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21H3" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download User Manual
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

/* -------- My Profile (inline page under the dashboard) -------- */
function MyProfile({ employee: empFromProps }) {
  // initial data (can be replaced later by API)
  const defaults = {
    firstName: "Ramesh",
    lastName: "Sharma",
    city: "Mumbai",
    employeeId: "00000001",
    phone: "+91 - 9087689808",
    email: "ramesh.sharma@company.com",
    profile: "Employee",
    department: "Quality Assurance",
  };

  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("profileDraft") || "{}");
    } catch {
      return {};
    }
  })();

  const [form, setForm] = useState({ ...defaults, ...saved });
  const [isEditing, setIsEditing] = useState(false);

  // Ref to autofocus first field on edit
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (isEditing && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [isEditing]);

  // --- Address handling (editable via "Add Address") ---
  const savedAddress = (() => {
    try {
      return JSON.parse(localStorage.getItem("addressDraft") || "{}");
    } catch {
      return {};
    }
  })();

  const [address, setAddress] = useState({
    street: savedAddress.street || "",
    road: savedAddress.road || "",
    city: savedAddress.city || "",
    state: savedAddress.state || "",
    country: savedAddress.country || "",
    postalCode: savedAddress.postalCode || "",
  });
  const [addressEditing, setAddressEditing] = useState(
    !savedAddress || Object.keys(savedAddress).length === 0
  );

  const employee = {
    name: `${form.firstName || "Ramesh"} ${form.lastName || "Sharma"}`,
    role: "Employee - Quality Assurance",
    city: form.city || "Mumbai",
    avatar: "/avatar-ramesh.jpg", // place in /public if you have it
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("profileDraft", JSON.stringify(form));
    setIsEditing(false);
  };

  const handleClear = () => {
    setForm({
      firstName: "",
      lastName: "",
      city: "",
      employeeId: "",
      phone: "",
      email: "",
      profile: "",
      department: "",
    });
  };

  // replace your Field with this
const Field = ({ label, name, type = "text", required, options, inputRef }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, color: "#0f172a" }}>
      {required && <span style={{ color: "#dc2626" }}>* </span>}
      {label}
    </label>

    {options ? (
      // selects can stay disabled when not editing
      <select
        name={name}
        value={String(form[name] ?? "")}
        onChange={handleChange}
        disabled={!isEditing}
        style={inputStyle(!isEditing)}
        ref={inputRef}
      >
        <option value="" disabled>Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    ) : (
      // inputs use readOnly instead of disabled
      <input
        type={type}
        name={name}
        value={String(form[name] ?? "")}
        onChange={handleChange}
        readOnly={!isEditing}
        style={inputStyle(!isEditing)}
        ref={inputRef}
        onKeyDown={(e) => e.stopPropagation()}
      />
    )}
  </div>
);


  // Address helpers
  const onAddrChange = (e) => {
    const { name, value } = e.target;
    setAddress((a) => ({ ...a, [name]: value }));
  };
  const saveAddress = () => {
    localStorage.setItem("addressDraft", JSON.stringify(address));
    setAddressEditing(false);
  };
  const clearAddress = () => {
    const cleared = { street: "", road: "", city: "", state: "", country: "", postalCode: "" };
    setAddress(cleared);
    localStorage.removeItem("addressDraft");
    setAddressEditing(true);
  };

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>My Profile</h1>
      <p style={{ color: "#64748b", marginTop: 6 }}>
        View and update your personal details to keep your profile up to date.
      </p>

      {/* header */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 18 }}>
        <img
          src={employee.avatar || "https://via.placeholder.com/96"}
          alt={employee.name}
          style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{employee.name}</div>
          <div style={{ color: "#64748b", marginTop: 2 }}>{employee.role}</div>
          <div style={{ color: "#0f172a", marginTop: 2 }}>{employee.city}</div>

          <button
            style={{
              marginTop: 10,
              border: "none",
              background: "transparent",
              color: "#184f9b",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => alert("Edit profile picture")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Edit Profile Picture
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <section
        style={{
          border: "1px solid #e6eefc",
          borderRadius: 8,
          background: "#fff",
          padding: 16,
          marginTop: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 800, color: "#0f172a" }}>Personal Information</span>
          {!isEditing ? (
            <button
              style={editBtnStyle}
              onClick={() => setIsEditing(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 21h4l11-11a2.828 2.828 0 10-4-4L4 17v4z"
                  stroke="#184f9b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <button style={secondaryBtnStyle} onClick={handleClear}>Clear</button>
              <button style={primaryBtnStyle} onClick={handleSave}>Save</button>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 16,
            rowGap: 12,
          }}
        >
          <Field label="First Name" name="firstName" required inputRef={firstFieldRef} />
          <Field label="Last Name" name="lastName" required />
          <Field label="Location" name="city" />
          <Field label="Employee ID" name="employeeId" />
          <Field label="Email Address" name="email" type="email" />
          <Field label="Contact Number" name="phone" />
          <Field
            label="Profile"
            name="profile"
            options={["Employee", "Manager", "Admin"]}
          />
          <Field
            label="Department"
            name="department"
            options={["Quality Assurance", "Manufacturing", "Design", "Supply Chain"]}
          />
        </div>
      </section>

      {/* Address */}
      <section
        style={{
          border: "1px solid #e6eefc",
          borderRadius: 8,
          background: "#fff",
          padding: 16,
          marginTop: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 800, color: "#0f172a" }}>Address</span>
          {!addressEditing ? (
            <button style={editBtnStyle} onClick={() => setAddressEditing(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#184f9b" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Add Address
            </button>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 24,
            rowGap: 10,
          }}
        >
          <AddrInput
            label="Street"
            name="street"
            placeholder="Type Street"
            value={address.street}
            onChange={onAddrChange}
            disabled={!addressEditing}
          />
          <AddrInput
            label="Road"
            name="road"
            placeholder="Type Road"
            value={address.road}
            onChange={onAddrChange}
            disabled={!addressEditing}
          />
          <AddrInput
            label="City"
            name="city"
            placeholder="Type City"
            value={address.city}
            onChange={onAddrChange}
            disabled={!addressEditing}
          />
          <AddrInput
            label="State"
            name="state"
            placeholder="Type State"
            value={address.state}
            onChange={onAddrChange}
            disabled={!addressEditing}
          />
          <AddrInput
            label="Country"
            name="country"
            placeholder="Type Country"
            value={address.country}
            onChange={onAddrChange}
            disabled={!addressEditing}
          />
          <AddrInput
            label="Postal Code"
            name="postalCode"
            placeholder="Type Postal Code"
            value={address.postalCode}
            onChange={onAddrChange}
            disabled={!addressEditing}
          />
        </div>

        {/* Address action buttons appear ONLY in edit mode */}
        {addressEditing && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <button style={secondaryBtnStyle} onClick={clearAddress}>
              Clear
            </button>
            <button style={primaryBtnStyle} onClick={saveAddress}>
              Save
            </button>
          </div>
        )}
      </section>

      {/* Logout */}
      <button
        style={{
          marginTop: 18,
          borderRadius: 8,
          padding: "10px 14px",
          border: "1px solid #fca5a5",
          background: "#fff",
          color: "#b91c1c",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          cursor: "pointer",
        }}
        onClick={() => window.location.assign("/")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                stroke="#b91c1c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 17l5-5-5-5M15 12H3"
                stroke="#b91c1c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Logout
      </button>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#0f172a", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

// Address input small component
function AddrInput({ label, name, placeholder, value, onChange, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: "#0f172a" }}>{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={!!disabled}              
        style={inputStyle(!!disabled)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/* helpers for MyProfile inputs/buttons */
const inputStyle = (readOnly) => ({
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: readOnly ? "#f8fafc" : "#fff",
  outline: "none",
  fontSize: 14,
});
const editBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #cfe0f8",
  background: "#fff",
  color: "#0f172a",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 14,
};
const primaryBtnStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#184f9b",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};
const secondaryBtnStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #cfe0f8",
  background: "#fff",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: 600,
};

/* ---------------- Styles ---------------- */

const styles = {
  // Zoom wrapper style (keeps previous behavior)
  zoomWrapper: {
    transform: "scale(0.8)",
    transformOrigin: "top left",
    width: "125%",
    minHeight: "100vh",
    boxSizing: "border-box",
    background: "#fff",
  },

  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  },

  /* Sidebar (white style) */
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    background: "#ffffff",
    color: "#0f172a",
    padding: 16,
    transition:
      "width 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms cubic-bezier(.2,.9,.2,1)",
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e6eefc",
    boxSizing: "border-box",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    cursor: "pointer",
  },
  brandLogo: {
    width: 44,
    height: 36,
    objectFit: "contain",
    background: "#fff",
    borderRadius: 6,
    padding: 4,
    border: "1px solid #eef2ff",
    transition:
      "width 260ms cubic-bezier(.2,.9,.2,1), height 260ms cubic-bezier(.2,.9,.2,1)",
  },
  brandText: { fontWeight: 800, fontSize: 16, color: "#0f172a" },

  menu: { display: "flex", flexDirection: "column", gap: 8, marginTop: 6 },
  sidebarFooter: { paddingTop: 12, color: "#64748b", fontSize: 13 },
  footerIcon: { fontSize: 14, color: "#94a3b8" },

  main: { flex: 1, transition: "margin-left 260ms cubic-bezier(.2,.9,.2,1)" },

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

  /* search area on the left inside topbar */
  searchWrap: {
    display: "flex",
    alignItems: "center",
    width: "48%", // make it visually like the screenshot — adjust if needed
    maxWidth: 760,
    minWidth: 300,
    position: "relative",
  },

  /* icon inside input */
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    padding: "10px 14px 10px 44px",
    borderRadius: 10,
    border: "1px solid #94a3b8",

    fontSize: 14,
    outline: "none",
    background: "#fff",
    transition: "box-shadow 200ms ease, transform 200ms ease",
    boxSizing: "border-box",
  },

  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 220,
    justifyContent: "flex-end",
  },

  iconBtn: { border: "none", background: "transparent", cursor: "pointer", fontSize: 18 },

  /* profile container: avatar + name + role */
  profileContainer: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    color: "#0f172a",
    fontSize: 14,
  },

  profileAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    flexShrink: 0,
  },

  profileName: { fontWeight: 700, color: "#0f172a", lineHeight: 1 },
  profileRole: { fontSize: 12, color: "#64748b", lineHeight: 1 },

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
    transform: "translateY(-6px)",
    opacity: 0,
    animation: "dropdownIn 220ms forwards cubic-bezier(.2,.9,.2,1)",
  },

  profileHeader: { display: "flex", gap: 12, alignItems: "center" },
  profileAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
  },
  profileInfo: { marginTop: 8 },

  logoutBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  },

  content: { padding: 28, background: "#f8fafc", minHeight: "calc(100vh - 72px)" },

  filterPill: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #dbeafe",
    background: "#f1f8ff",
    color: "#184f9b",
    fontSize: 13,
    cursor: "pointer",
    transition: "transform 180ms ease",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 18,
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(12,24,48,0.04)",
  },
  th: { padding: "14px 18px", textAlign: "left", color: "#0f172a", fontWeight: 700 },
  td: { padding: "18px 20px", borderBottom: "1px solid #eef2ff", color: "#0f172a" },

  primaryActionSmall: {
    background: "#184f9b",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "transform 150ms ease",
  },

  /* Card grid updated — more like screenshot layout */
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 18,
    marginTop: 18,
  },

  /* Form card style */
  formCard: {
    background: "#fff",
    padding: 18,
    borderRadius: 8,
    border: "1px solid #e6eefc",
    boxShadow: "0 4px 8px rgba(12,24,48,0.04)",
    display: "flex",
    flexDirection: "column",
    minHeight: 240,
  },

  formCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  formIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  priorityBadge: {
    borderRadius: 999,
    border: "1px solid #fca5a5",
    padding: "6px 10px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
  },

  formCardBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  progressLabel: { fontSize: 12, color: "#6b7280", marginBottom: 6 },

  /* keep only one definition of progressOuter / progressInner */
  progressOuter: { height: 8, borderRadius: 6, background: "#f3f4f6", marginTop: 8 },
  progressInner: { height: "100%", borderRadius: 6, background: "#184f9b" },

  formDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 14,
    color: "#475569",
    fontSize: 13,
  },

  detailBlock: { display: "flex", flexDirection: "column" },
  detailTitle: { fontSize: 12, color: "#94a3b8", marginBottom: 6 },
  detailValue: { fontWeight: 600, color: "#0f172a" },

  formCardFooter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 14,
  },

  /* keep only one definition of startBtn */
  startBtn: {
    padding: "10px 16px",
    background: "#184f9b",
    color:"#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  /* view button used in Completed forms cards */
  viewBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #cfe0f8",
    background: "#fff",
    color: "#184f9b",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },

  /* Download card styles for the Help page */
  downloadCard: {
    border: "1px solid #e6eefc",
    background: "#fff",
    padding: 18,
    borderRadius: 8,
    boxShadow: "0 4px 8px rgba(12,24,48,0.02)",
  },
  downloadAnchor: {
    textDecoration: "none",
  },
  downloadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #cfe0f8",
    background: "#fff",
    color: "#184f9b",
    cursor: "pointer",
    fontSize: 14,
  },

  accordion: { border: "1px solid #e6eefc", borderRadius: 8, marginTop: 12, overflow: "hidden" },
  accordionHeader: {
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    background: "#fff",
  },
  accordionBody: { padding: 12, background: "#fbfdff", color: "#475569" },
};

/* inject keyframes once by adding a style tag at runtime */
(function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("edashboard-animations")) return;
  const css = `
    @keyframes dropdownIn {
      from { transform: translateY(-6px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
  `;
  const s = document.createElement("style");
  s.id = "edashboard-animations";
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
})();

export default EmployeeDashboardScreen;

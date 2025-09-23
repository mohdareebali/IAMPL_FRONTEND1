// src/screens/RoleSelectScreen.js
import React from "react";
import { useNavigate } from "react-router-dom";
import footerLogo from "../assets/Innovascape-logo.png"; // footer logo kept in src/assets

/**
 * Responsive RoleSelectScreen
 * - Uses top logo from public folder: /International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.webp
 * - Clicking a role navigates to /login with { state: { role } }
 * - Cards are equal height in two-column layout and buttons stick to the bottom
 */

function RoleSelectScreen() {
  const navigate = useNavigate();

  const handleContinue = (role) => {
    navigate("/login", { state: { role } });
  };

  // Inline "outer" style to keep file self-contained. Main responsive rules are in the <style> block.
  const outer = {
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "28px 20px",
    background: "#ffffff",
    fontFamily:
      "Arial, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    color: "#222",
  };

  return (
    <div style={outer}>
      <style>{`
        /* --- Layout & typography --- */
        .rs-container {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          box-sizing: border-box;
        }

        .rs-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
        }

        .rs-topLogo {
          width: 160px;
          max-width: 36vw;
          height: auto;
          object-fit: contain;
        }

        .rs-title {
          font-weight: 800;
          color: #0d47a1;
          font-size: clamp(18px, 2.4vw, 26px);
          margin: 6px 0 0;
          line-height: 1.05;
          text-align: center;
        }

        .rs-subtitle {
          max-width: 920px;
          font-size: clamp(12px, 1.2vw, 14px);
          color: #666;
          text-align: center;
          margin-top: 6px;
          line-height: 1.25;
          padding: 0 6px;
        }

        /* --- Cards grid: equal-height children --- */
        .rs-cards {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          align-items: stretch; /* ensure equal height */
          padding: 6px;
          box-sizing: border-box;
        }

        .rs-card {
          background: #fff;
          padding: clamp(14px, 1.6vw, 28px);
          border-radius: 10px;
          border: 2px dashed rgba(0,0,0,0.12);
          box-shadow: 0 6px 20px rgba(13,71,161,0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          min-height: 220px; /* gentle minimum */
          flex: 1; /* allow cards to grow equally */
        }

        .rs-card-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .rs-icon {
          font-size: clamp(26px, 3.6vw, 40px);
          color: #374151;
        }

        .rs-roleTitle {
          font-size: clamp(16px, 1.6vw, 20px);
          font-weight: 700;
          margin: 0;
        }

        .rs-roleSub {
          font-size: clamp(12px, 1.0vw, 14px);
          color: #666;
          text-align: center;
          max-width: 320px;
        }

        .rs-list {
          margin-top: 10px;
          padding-left: 18px;
          color: #333;
          width: 100%;
        }

        .rs-list li {
          margin-bottom: 8px;
          font-size: clamp(12px, 1.0vw, 14px);
          line-height: 1.2;
        }

        .rs-actions {
          margin-top: 12px;
        }

        .rs-btn {
          width: 100%;
          padding: clamp(10px, 1.6vw, 14px);
          border-radius: 8px;
          border: none;
          background-color: #0d47a1;
          color: #fff;
          font-weight: 700;
          font-size: clamp(14px, 1.4vw, 16px);
          cursor: pointer;
          transition: background-color 150ms ease;
        }

        .rs-btn:active { transform: translateY(1px); }

        .rs-footer {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          align-items: center;
          color: #666;
          font-size: 13px;
        }

        /* Responsive breakpoints */
        @media (max-width: 980px) {
          .rs-cards { grid-template-columns: 1fr; align-items: stretch; }
          .rs-card { min-height: 200px; }
        }

        @media (max-height: 720px) {
          /* reduce spacing for short screens to keep buttons visible */
          .rs-container { gap: 10px; }
          .rs-card { padding: 12px; min-height: 180px; }
          .rs-list { max-height: 140px; overflow: auto; }
        }

        @media (max-height: 580px) {
          .rs-subtitle { display: none; } /* hide subtitle if vertical space is extremely tight */
          .rs-card { padding: 8px; min-height: 150px; }
          .rs-list { max-height: 120px; }
        }
      `}</style>

      <div className="rs-container" role="main">
        <header className="rs-header" aria-label="FAIR Portal header">
          <img
            className="rs-topLogo"
            src="/International-Aerospace-Manufacturing-Pvt-Ltd-(IAMPL)-logo.webp"
            alt="IAMPL Logo"
          />
          <div className="rs-title">FAIR Portal</div>
          <div className="rs-subtitle">
            Streamline FAIR FORM entries through search and autofill, extract and insert, voice or
            key entries with accuracy and speed.
          </div>
        </header>

        <section className="rs-cards" aria-label="Role selection">
          {/* Manager */}
          <article className="rs-card" aria-labelledby="mgr-title" role="region">
            <div className="rs-card-top">
              <div className="rs-icon" aria-hidden>
                👤⭐
              </div>
              <h3 id="mgr-title" className="rs-roleTitle">Manager Portal</h3>
              <div className="rs-roleSub">Oversee team operations, assign forms, and monitor progress.</div>

              <ul className="rs-list" aria-label="Manager features">
                <li>Manage team members and assignments</li>
                <li>Track form completion status</li>
                <li>Access analytics and reports</li>
                <li>Approve employee registrations</li>
              </ul>
            </div>

            <div className="rs-actions">
              <button
                className="rs-btn"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0d47a1")}
                onClick={() => handleContinue("manager")}
                aria-label="Continue as Manager"
              >
                Continue as Manager
              </button>
            </div>
          </article>

          {/* Employee */}
          <article className="rs-card" aria-labelledby="emp-title" role="region">
            <div className="rs-card-top">
              <div className="rs-icon" aria-hidden>
                ✍️
              </div>
              <h3 id="emp-title" className="rs-roleTitle">Employee</h3>
              <div className="rs-roleSub">Complete assigned forms and track progress.</div>

              <ul className="rs-list" aria-label="Employee features">
                <li>Fill assigned forms efficiently</li>
                <li>Upload supporting documents</li>
                <li>Track submission status</li>
                <li>Easy Entry — auto fill or extract, voice or key entries.</li>
              </ul>
            </div>

            <div className="rs-actions">
              <button
                className="rs-btn"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0d47a1")}
                onClick={() => handleContinue("employee")}
                aria-label="Continue as Employee"
              >
                Continue as Employee
              </button>
            </div>
          </article>
        </section>

        <footer className="rs-footer" aria-label="Footer">
          <span>Created by</span>
          <img src={footerLogo} alt="Innovascape Logo" style={{ height: 26, objectFit: "contain" }} />
        </footer>
      </div>
    </div>
  );
}

export default RoleSelectScreen;

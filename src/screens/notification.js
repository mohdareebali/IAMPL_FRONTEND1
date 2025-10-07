// D:\ocr\mysql\IAMPL_FRONTEND\src\screens\notification.js

/**
 * Notification Panel (Plain JS)
 * ---------------------------------------------------
 * This file builds a notification panel identical to
 * the one shown in your screenshot.
 *
 * ✅ Tabs: All / Unread
 * ✅ Colored status dots
 * ✅ Part Number display
 * ✅ Timestamp (e.g. 23 mins ago)
 * ✅ Toggle on bell click
 * ✅ Click notification → navigate (window.location)
 */

export function initNotifications(bellId = "notification-bell", data = notificationsData) {
  const bell = document.getElementById(bellId);
  if (!bell) return;

  // Wrap the bell to position panel correctly
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  bell.parentNode.insertBefore(wrapper, bell);
  wrapper.appendChild(bell);

  // Create panel
  const panel = createNotificationsPanel(data, (n) => {
    console.log("Clicked notification:", n);
    if (n.route) {
      window.location.href = n.route;
    }
  });
  wrapper.appendChild(panel);

  // Toggle panel
  bell.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      panel.style.display = "none";
    }
  });
}

/* ---------------- Core panel builder ---------------- */
function createNotificationsPanel(items = [], onItemClick = () => {}) {
  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "absolute",
    right: "0",
    top: "42px",
    width: "460px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 14px 36px rgba(2,6,23,0.12)",
    border: "1px solid #eef2ff",
    overflow: "hidden",
    zIndex: "1000",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
    display: "none",
  });

  // Header
  const header = document.createElement("div");
  Object.assign(header.style, {
    padding: "14px 16px",
    borderBottom: "1px solid #eef2ff",
    background: "#fff",
    fontWeight: "800",
    color: "#0f172a",
    fontSize: "18px",
  });
  header.textContent = "Notifications";
  panel.appendChild(header);

  // Tabs
  const tabsRow = document.createElement("div");
  Object.assign(tabsRow.style, {
    display: "flex",
    gap: "8px",
    padding: "10px 12px",
    borderBottom: "1px solid #eef2ff",
    background: "#fff",
  });

  const allTab = createTabButton("All", items.length);
  const unreadItems = items.filter(i => i.unread);
  const unreadTab = createTabButton("Unread", unreadItems.length);

  tabsRow.appendChild(allTab);
  tabsRow.appendChild(unreadTab);
  panel.appendChild(tabsRow);

  // List container
  const listContainer = document.createElement("div");
  panel.appendChild(listContainer);

  function renderList(data) {
    listContainer.innerHTML = "";
    if (data.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "You're all caught up 🎉";
      Object.assign(empty.style, {
        padding: "18px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "14px",
      });
      listContainer.appendChild(empty);
      return;
    }

    data.forEach(n => {
      const row = document.createElement("button");
      row.type = "button";
      Object.assign(row.style, {
        display: "flex",
        gap: "12px",
        width: "100%",
        padding: "14px 16px",
        border: "none",
        background: "#fff",
        cursor: "pointer",
        textAlign: "left",
      });

      const bullet = document.createElement("span");
      Object.assign(bullet.style, {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        marginTop: "6px",
        flexShrink: "0",
        background: n.dot,
      });

      const textWrap = document.createElement("div");
      Object.assign(textWrap.style, {
        flex: "1",
        textAlign: "left",
      });

      const title = document.createElement("div");
      Object.assign(title.style, {
        fontWeight: "800",
        color: "#0f172a",
        fontSize: "14px",
      });
      title.textContent = n.title;

      const meta = document.createElement("div");
      Object.assign(meta.style, {
        fontSize: "13px",
        color: "#374151",
        marginTop: "2px",
      });
      meta.textContent = `Part Number: ${n.part}`;

      const time = document.createElement("div");
      Object.assign(time.style, {
        fontSize: "12px",
        color: "#94a3b8",
        marginTop: "6px",
      });
      time.textContent = n.ago;

      textWrap.appendChild(title);
      textWrap.appendChild(meta);
      textWrap.appendChild(time);

      row.appendChild(bullet);
      row.appendChild(textWrap);
      row.addEventListener("click", () => onItemClick(n));

      listContainer.appendChild(row);
    });
  }

  renderList(items);

  allTab.addEventListener("click", () => {
    setTabActive(allTab, unreadTab);
    renderList(items);
  });

  unreadTab.addEventListener("click", () => {
    setTabActive(unreadTab, allTab);
    renderList(unreadItems);
  });

  return panel;
}

/* ---------------- Helpers ---------------- */
function createTabButton(label, count) {
  const btn = document.createElement("button");
  btn.type = "button";
  Object.assign(btn.style, {
    border: "none",
    background: "transparent",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  const span = document.createElement("span");
  span.textContent = count;
  Object.assign(span.style, {
    minWidth: "22px",
    padding: "0 8px",
    height: "22px",
    lineHeight: "22px",
    textAlign: "center",
    borderRadius: "999px",
    background: "#e2e8f0",
    fontSize: "12px",
    fontWeight: "700",
    color: "#0f172a",
  });

  btn.textContent = label;
  btn.appendChild(span);
  return btn;
}

function setTabActive(active, inactive) {
  active.style.background = "#e6f0ff";
  active.style.color = "#184f9b";
  inactive.style.background = "transparent";
  inactive.style.color = "#334155";
}

/* ---------------- Sample Notifications ---------------- */
const notificationsData = [
  {
    id: 1,
    title: "FAIR Document is assigned",
    part: "ABC123",
    ago: "23mins ago",
    dot: "#b91c1c",
    unread: true,
    route: "/form-view",
  },
  {
    id: 2,
    title: "FAIR Document is assigned",
    part: "XYZ124",
    ago: "23mins ago",
    dot: "#ea7a1a",
    unread: true,
    route: "/form-view",
  },
  {
    id: 3,
    title: "FAIR Document is assigned",
    part: "ABC125",
    ago: "23mins ago",
    dot: "#6b7280",
    unread: true,
    route: "/form-view",
  },
];

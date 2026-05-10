import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const items = [
    { path: "/",          label: "אמנים",    icon: "🎤" },
    { path: "/favorites", label: "מועדפים",   icon: "❤️" },
  ];

  return (
    <div style={{ ...sidebar, width: collapsed ? 60 : 200 }}>
      <button style={collapseBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>

      {!collapsed && (
        <div style={userBox}>
          <img src={user?.picture} alt="" style={avatar} />
          <p style={userName}>{user?.name}</p>
        </div>
      )}

      <nav style={nav}>
        {items.map(({ path, label, icon }) => (
          <button
            key={path}
            style={{
              ...navBtn,
              background: location.pathname === path ? "#17a347" : "transparent",
            }}
            onClick={() => navigate(path)}
          >
            <span style={navIcon}>{icon}</span>
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <button style={logoutBtn} onClick={handleLogout}>
        <span style={navIcon}>🚪</span>
        {!collapsed && <span>יציאה</span>}
      </button>
    </div>
  );
}

const sidebar = {
  height: "100vh",
  background: "#191414",
  color: "white",
  display: "flex",
  flexDirection: "column",
  padding: "16px 0",
  position: "fixed",
  top: 0,
  right: 0,
  transition: "width 0.25s",
  zIndex: 100,
  boxShadow: "-2px 0 12px rgba(0,0,0,0.3)",
  direction: "rtl",
};

const collapseBtn = {
  background: "none",
  border: "none",
  color: "#aaa",
  cursor: "pointer",
  fontSize: 14,
  padding: "4px 16px",
  textAlign: "left",
  marginBottom: 8,
};

const userBox = {
  padding: "8px 16px 20px",
  borderBottom: "1px solid #333",
  marginBottom: 12,
  textAlign: "center",
};

const avatar = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: 6,
};

const userName = {
  fontSize: 13,
  color: "#ccc",
  margin: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const nav = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "0 8px",
};

const navBtn = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: 14,
  fontFamily: "Arial",
  textAlign: "right",
  transition: "background 0.2s",
  width: "100%",
};

const navIcon = { fontSize: 18, flexShrink: 0 };

const logoutBtn = {
  ...navBtn,
  margin: "8px",
  color: "#ff6b6b",
  width: "auto",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  fontFamily: "Arial",
  fontSize: 14,
};

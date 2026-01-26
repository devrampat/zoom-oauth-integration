import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function TopNav() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 12px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    color: isActive ? "white" : "#222",
    background: isActive ? "#111" : "transparent",
    border: isActive ? "1px solid #111" : "1px solid transparent",
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        background: "rgba(255,255,255,0.9)",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>
            Zoom AI POC
          </div>
          <div style={{ fontSize: 12, color: "#777" }}>
            React • Zoom OAuth • Ollama
          </div>
        </div>

        {/* Nav Links */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: 6,
            borderRadius: 14,
            border: "1px solid #eee",
            background: "white",
          }}
        >
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>

          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <TopNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "18px 16px 40px",
          color: "#999",
          fontSize: 12,
        }}
      >
        Built for internal experimentation • Local-first AI demo
      </div>
    </div>
  );
}

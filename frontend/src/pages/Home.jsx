import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000";

function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        fontSize: 12,
        background: "#fafafa",
      }}
    >
      {children}
    </span>
  );
}

function Card({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #eaeaea",
        borderRadius: 14,
        padding: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, marginBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const connectZoom = () => {
    window.location.href = `${API_BASE}/zoom/oauth/start`;
  };

  const loadStatus = async () => {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/zoom/status`);
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setError("Backend not reachable. Is it running on port 4000?");
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 16,
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #f7f7ff, #ffffff)",
          border: "1px solid #eee",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 28 }}>
              Zoom AI Assistant (POC)
            </h1>
            <p style={{ margin: "10px 0 0", color: "#555", lineHeight: 1.5 }}>
              Connect your Zoom account and generate meeting summaries using a{" "}
              <b>local LLM</b> (Ollama + Llama 3.1).  
              Perfect for internal demos and experimentation.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Pill>✅ Zoom OAuth</Pill>
              <Pill>✅ Local AI (No API Cost)</Pill>
              <Pill>✅ React + Node</Pill>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button
                onClick={connectZoom}
                style={{
                  borderRadius: 12,
                  padding: "10px 16px",
                  border: "1px solid #111",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Connect Zoom
              </button>

              <button
                onClick={loadStatus}
                style={{
                  borderRadius: 12,
                  padding: "10px 16px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Refresh Status
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #f3c2c2",
                  background: "#fff5f5",
                  color: "#a40000",
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Status box */}
          <div
            style={{
              width: 320,
              minWidth: 280,
              background: "white",
              borderRadius: 16,
              padding: 16,
              border: "1px solid #eee",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700 }}>Connection</div>
              <Pill>{status?.connected ? "✅ Connected" : "❌ Not Connected"}</Pill>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: "#444" }}>
              <div style={{ marginBottom: 8 }}>
                <b>Backend:</b> <code>localhost:4000</code>
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>Frontend:</b> <code>localhost:5173</code>
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>AI Engine:</b> <code>Ollama</code>
              </div>
              <div>
                <b>Model:</b> <code>llama3.1:8b</code>
              </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 12, color: "#777" }}>
              After connecting Zoom, go to <b>Dashboard</b> to view meetings and generate AI summaries.
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
        }}
      >
        <Card title="1) OAuth Connect">
          <div style={{ color: "#555", lineHeight: 1.5, fontSize: 14 }}>
            User authorizes Zoom access using OAuth.  
            Tokens are stored in-memory for this POC.
          </div>
        </Card>

        <Card title="2) Pull Meetings">
          <div style={{ color: "#555", lineHeight: 1.5, fontSize: 14 }}>
            Backend calls Zoom APIs to fetch your upcoming scheduled meetings and returns them to UI.
          </div>
        </Card>

        <Card title="3) Local AI Summary">
          <div style={{ color: "#555", lineHeight: 1.5, fontSize: 14 }}>
            Meetings are summarized using a local LLM running via Ollama — no external API calls.
          </div>
        </Card>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 16, fontSize: 12, color: "#777" }}>
        ✅ Next upgrade: store tokens in SQLite/Redis + use webhooks + add Chat UI.
      </div>
    </div>
  );
}

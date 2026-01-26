import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:4000";

function formatDateTime(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

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

function Card({ title, right, children }) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [me, setMe] = useState(null);
  const [meetings, setMeetings] = useState(null);

  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  const [error, setError] = useState("");

  const meetingItems = useMemo(() => meetings?.meetings || [], [meetings]);

  const loadAll = async () => {
    try {
      setError("");
      setLoading(true);

      const [statusRes, meRes, meetingsRes] = await Promise.all([
        fetch(`${API_BASE}/zoom/status`),
        fetch(`${API_BASE}/zoom/me`),
        fetch(`${API_BASE}/zoom/meetings`),
      ]);

      const statusJson = await statusRes.json();
      setStatus(statusJson);

      if (meRes.ok) setMe(await meRes.json());
      else setMe(null);

      if (meetingsRes.ok) setMeetings(await meetingsRes.json());
      else setMeetings(null);
    } catch (e) {
      setError("Failed to load data. Is backend running on port 4000?");
    } finally {
      setLoading(false);
    }
  };

  const summarizeMeetings = async () => {
    try {
      setError("");
      if (!meetings) {
        setError("Zoom meetings not loaded. Connect Zoom first.");
        return;
      }

      setLoadingAI(true);
      setAiSummary("");

      const res = await fetch(`${API_BASE}/ai/summarize-meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetings }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "AI request failed");
        return;
      }

      setAiSummary(data?.summary || "No summary generated.");
    } catch (e) {
      setError("AI summary failed. Is Ollama running on localhost:11434?");
    } finally {
      setLoadingAI(false);
    }
  };

  const copySummary = async () => {
    if (!aiSummary) return;
    await navigator.clipboard.writeText(aiSummary);
    alert("Copied summary ✅");
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Zoom AI Dashboard</h2>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            Pull meetings from Zoom and summarize them using a local LLM (Ollama + Llama 3.1).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={loadAll}
            style={{
              borderRadius: 10,
              padding: "10px 14px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>

          <button
            onClick={summarizeMeetings}
            disabled={loadingAI || !meetingItems.length}
            style={{
              borderRadius: 10,
              padding: "10px 14px",
              border: "1px solid #111",
              background: loadingAI ? "#444" : "#111",
              color: "white",
              cursor: loadingAI ? "not-allowed" : "pointer",
            }}
          >
            {loadingAI ? "Summarizing..." : "Generate AI Summary"}
          </button>
        </div>
      </div>

      {/* Error */}
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

      {/* Top grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          marginTop: 14,
        }}
      >
        <Card
          title="Zoom Connection"
          right={
            <Pill>
              {status?.connected ? "✅ Connected" : "❌ Not Connected"}
            </Pill>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: "#444" }}>
              <b>OAuth:</b>{" "}
              {status?.connected ? "Authorized" : "Not Authorized"}
            </div>
            <div style={{ color: "#444" }}>
              <b>Meetings loaded:</b> {meetingItems?.length || 0}
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>
              Tip: If not connected, go to Home → “Connect Zoom”.
            </div>
          </div>
        </Card>

        <Card
          title="User"
          right={<Pill>{me?.type ? `Type: ${me.type}` : "—"}</Pill>}
        >
          {me ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div>
                <b>{me.first_name} {me.last_name}</b>
              </div>
              <div style={{ color: "#555" }}>{me.email}</div>
              <div style={{ fontSize: 12, color: "#777" }}>
                Zoom ID: {me.id}
              </div>
            </div>
          ) : (
            <div style={{ color: "#777" }}>
              Not available (connect Zoom first)
            </div>
          )}
        </Card>

        <Card title="AI Engine" right={<Pill>Local</Pill>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ color: "#444" }}>
              <b>Provider:</b> Ollama
            </div>
            <div style={{ color: "#444" }}>
              <b>Model:</b> llama3.1:8b
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>
              Running locally on <code>localhost:11434</code>
            </div>
          </div>
        </Card>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          marginTop: 14,
        }}
      >
        {/* Meetings */}
        <Card
          title="Upcoming Meetings"
          right={<Pill>{meetingItems.length} meetings</Pill>}
        >
          {loading ? (
            <div style={{ color: "#777" }}>Loading meetings...</div>
          ) : meetingItems.length === 0 ? (
            <div style={{ color: "#777" }}>
              No scheduled meetings found.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {meetingItems.map((m) => (
                <div
                  key={m.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {m.topic || "Untitled Meeting"}
                    </div>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {formatDateTime(m.start_time)} • {m.duration || "?"} mins
                    </div>
                    {m.agenda ? (
                      <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                        Agenda: {m.agenda}
                      </div>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Pill>ID: {m.id}</Pill>
                    <Pill>Type: {m.type}</Pill>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Summary */}
        <Card
          title="AI Summary"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={copySummary}
                disabled={!aiSummary}
                style={{
                  borderRadius: 10,
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: aiSummary ? "pointer" : "not-allowed",
                  fontSize: 13,
                }}
              >
                Copy
              </button>
            </div>
          }
        >
          <div
            style={{
              minHeight: 220,
              borderRadius: 12,
              border: "1px solid #eee",
              padding: 12,
              background: "#fafafa",
              fontSize: 13,
              whiteSpace: "pre-wrap",
              color: "#333",
            }}
          >
            {aiSummary
              ? aiSummary
              : "Click “Generate AI Summary” to get an actionable meeting summary."}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
            Tip: If AI fails, ensure Ollama is running and model is pulled.
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 16, fontSize: 12, color: "#777" }}>
        ✅ POC Mode: tokens are not stored in DB. For prod use: DB/Redis + refresh tokens + RBAC.
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [me, setMe] = useState(null);
  const [meetings, setMeetings] = useState(null);

  const loadAll = async () => {
    const statusRes = await fetch("http://localhost:4000/zoom/status");
    setStatus(await statusRes.json());

    const meRes = await fetch("http://localhost:4000/zoom/me");
    if (meRes.ok) setMe(await meRes.json());

    const meetingsRes = await fetch("http://localhost:4000/zoom/meetings");
    if (meetingsRes.ok) setMeetings(await meetingsRes.json());
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Status</h3>
      <pre>{status ? JSON.stringify(status, null, 2) : "Loading..."}</pre>

      <h3>My Zoom Profile</h3>
      <pre>{me ? JSON.stringify(me, null, 2) : "Not loaded / Not connected"}</pre>

      <h3>My Meetings</h3>
      <pre>
        {meetings ? JSON.stringify(meetings, null, 2) : "Not loaded / Not connected"}
      </pre>
    </div>
  );
}

import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

let zoomTokens = null;

/**
 * Start Zoom OAuth
 */
app.get("/zoom/oauth/start", (req, res) => {
  const state = "poc_state";

  const url =
    `https://zoom.us/oauth/authorize?response_type=code` +
    `&client_id=${process.env.ZOOM_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URI)}` +
    `&state=${state}`;

  res.redirect(url);
});

/**
 * OAuth Callback - exchange code for access_token
 */
app.get("/zoom/oauth/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Missing code in callback");
    }

    const authHeader = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.ZOOM_REDIRECT_URI,
        },
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    zoomTokens = tokenRes.data;

    // redirect user back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("OAuth callback error:", err?.response?.data || err.message);
    res.status(500).send("OAuth failed");
  }
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

/**
 * POC status: is zoom connected?
 */
app.get("/zoom/status", (req, res) => {
  res.json({
    connected: Boolean(zoomTokens?.access_token),
    expires_in: zoomTokens?.expires_in || null,
  });
});

/**
 * 3) Get Zoom Profile: /users/me
 */
app.get("/zoom/me", async (req, res) => {
  try {
    if (!zoomTokens?.access_token) {
      return res.status(401).json({ error: "Zoom not connected" });
    }

    const response = await axios.get("https://api.zoom.us/v2/users/me", {
      headers: { Authorization: `Bearer ${zoomTokens.access_token}` },
    });

    res.json(response.data);
  } catch (err) {
    console.error("GET /zoom/me error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * 4) Get Meetings: /users/me/meetings
 */
app.get("/zoom/meetings", async (req, res) => {
  try {
    if (!zoomTokens?.access_token) {
      return res.status(401).json({ error: "Zoom not connected" });
    }

    const response = await axios.get(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        headers: { Authorization: `Bearer ${zoomTokens.access_token}` },
        params: { type: "scheduled", page_size: 10 },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("GET /zoom/meetings error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));

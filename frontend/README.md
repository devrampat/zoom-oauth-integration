// ...existing code...
# frontend — Zoom OAuth POC

This is the frontend for the Zoom OAuth proof-of-concept. It is a small React app that:
- Starts the OAuth flow from the Home page ([`Home`](frontend/src/pages/Home.jsx)).
- Displays connection status, profile and meetings on the Dashboard ([`Dashboard`](frontend/src/pages/Dashboard.jsx)).
- App entry is [`App`](frontend/src/App.jsx) and bootstrapped in [`main.jsx`](frontend/src/main.jsx).

Prerequisites
- Node.js (v16+ recommended)
- The backend running and configured with your Zoom credentials (see [backend/.env](backend/.env) and [backend/index.js](backend/index.js)).

Install and run

1. Install dependencies
   - Frontend:
     ```sh
     cd frontend
     npm install
     ```
   - Backend:
     ```sh
     cd ../backend
     npm install
     ```

2. Run in development
   - Backend (dev mode uses nodemon):
     ```sh
     cd backend
     npm run dev
     ```
   - Frontend:
     ```sh
     cd frontend
     npm run dev
     ```

What the app does
- The Home page (`[`Home`](frontend/src/pages/Home.jsx)`) calls the backend endpoint `/zoom/oauth/start` to begin the Zoom OAuth flow.
- The backend routes are implemented in [index.js](http://_vscodecontentref_/0) and include:
  - `/zoom/oauth/start` and `/zoom/oauth/callback`
  - `/zoom/status`, `/zoom/me`, `/zoom/meetings`
- After OAuth completes the backend redirects back to the frontend dashboard.


License
- MIT
# AI-Enabled Water Well Predictor

Simple repo: responsive frontend + minimal Node.js backend.
Frontend can be hosted on GitHub Pages (static). Backend required to store locations and run "real" analysis.

## Features
- Enter a location (village / address / GPS) and request a site check
- Backend stores submissions and returns a site verdict (go / caution / no-go)
- Placeholder analysis included; replace with NAQUIM / AI model integration
- Responsive modern UI, accessible and mobile-first

## How to run locally (recommended)
1. Clone repo
2. Start backend
   - `cd server`
   - `npm install`
   - `npm start`
   - Backend runs on http://localhost:4000 by default
3. Start frontend
   - Open `index.html` directly in a browser or run a static server

## Deploying
- Frontend: GitHub Pages (push `index.html`, `style.css`, `app.js` to `gh-pages` or `main` branch as `docs/`)
- Backend: Deploy `server/` to Render/Heroku/Railway. Set `API_BASE` in `app.js` to your deployed backend URL.

## How to add real analysis
See `server/server.js`: replace `placeholderAnalyze()` with your function that queries NAQUIM and your AI inference engine.
Ensure legal/usage compliance for NAQUIM / CGWB datasets.

## Notes
- Data persistence is `server/submissions.json` (simple). Switch to Firestore/Postgres in production.
- Security: This is a starter app. Add input validation and authentication before production.


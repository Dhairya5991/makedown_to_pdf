# Markdown to PDF — React + Node.js Full Web App

Generate clean PDFs from live Markdown with templates, themes, branding, preview, and OAuth-backed history. Frontend is a mobile-responsive React app (Vite). Backend is Node.js/Express with SQLite, Puppeteer, and Google OAuth.

## Features
- Live Markdown editor with instant HTML preview
- Proper PDF generation (Puppeteer, print-background, A4, margins)
- PDF preview before download (server-rendered HTML preview)
- Templates: resume, invoice
- Multiple resume themes: classic, modern, minimal
- Custom fonts, accent color, logo, subtitle branding
- Download PDF button
- Mobile-responsive UI and Dark mode
- Auth + history (save, list, delete)
- OAuth login (Google) with session
- Dockerfile for frontend and backend
- docker-compose for single-command run

## Tech Stack
- Frontend: React 18, Vite, React Router
- Backend: Node.js 20, Express, Passport (Google), better-sqlite3, markdown-it, sanitize-html, Puppeteer
- DB: SQLite (file in backend/data/app.db)
- Containerization: Docker, docker-compose

## Project Structure
- Frontend: [frontend](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/frontend)
  - Entry: [index.html](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/frontend/index.html)
  - App: [App.jsx](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/frontend/src/App.jsx)
  - Pages: [EditorPage.jsx](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/frontend/src/pages/EditorPage.jsx), [DashboardPage.jsx](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/frontend/src/pages/DashboardPage.jsx)
- Backend: [backend](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend)
  - Server: [server.js](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend/src/server.js)
  - OAuth: [auth.js](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend/src/auth.js)
  - PDF: [pdf.js](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend/src/pdf.js)
  - DB: [db.js](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend/src/db.js)
- Compose: [docker-compose.yml](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/docker-compose.yml)

## Quick Start
### Option A: Docker (recommended)
1. Ensure Docker is installed.
2. Set environment variables (optional, defaults used):
   - SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ALLOW_DEV_LOGIN
3. Run:
   - docker-compose up --build
4. Open http://localhost:3000

Notes:
- ALLOW_DEV_LOGIN=true enables a dev login if Google OAuth isn’t configured.
- Frontend talks to backend at http://localhost:8080/api.

### Option B: Local development
Prerequisites: Node.js 20+

1. Backend
   - cd backend
   - npm install
   - Create .env (optional):
     - SESSION_SECRET=change_me
     - PORT=8080
     - FRONTEND_URL=http://localhost:3000
     - ALLOW_DEV_LOGIN=true
     - GOOGLE_CLIENT_ID=your_google_client_id
     - GOOGLE_CLIENT_SECRET=your_google_client_secret
   - npm run dev
   - Backend runs at http://localhost:8080

2. Frontend
   - cd frontend
   - npm install
   - Create .env.local:
     - VITE_API_BASE_URL=http://localhost:8080/api
   - npm run dev
   - Open http://localhost:3000

## OAuth Setup (Google)
1. Go to Google Cloud Console → Credentials → Create OAuth Client ID.
2. Choose Web Application.
3. Authorized redirect URIs:
   - http://localhost:8080/api/auth/google/callback
4. Copy Client ID and Client Secret to backend .env:
   - GOOGLE_CLIENT_ID=...
   - GOOGLE_CLIENT_SECRET=...
5. Restart backend; click “Login with Google” in the app header.

If you don’t have OAuth yet, set ALLOW_DEV_LOGIN=true and use the “Login with Google” button to trigger a dev session.

## Usage
- Editor page:
  - Write Markdown in the left panel
  - Choose template (resume/invoice) and theme
  - Set accent color, font family, logo URL, subtitle
  - See live Markdown preview and server-rendered PDF HTML preview
  - Download PDF to get a print-ready file
  - If logged in, Save to history
- Dashboard page:
  - View saved documents
  - Download existing PDFs
  - Delete entries from history
- Dark mode: toggle from the header
- Mobile: layout adapts to 1-column under 900px

## Templates and Themes
- Templates:
  - resume
  - invoice
- Resume themes:
  - classic
  - modern
  - minimal
- Branding:
  - accentColor: hex color for UI and headings
  - fontFamily: CSS font stack (e.g., "Inter, sans-serif")
  - logoUrl: URL of logo displayed in header
  - subtitle: small text under title

## API Overview
Base URL: http://localhost:8080/api

- GET /health → { ok: true }
- GET /me → { user } or { user: null }
- GET /auth/google → starts Google OAuth (or dev login if enabled)
- POST /auth/logout → ends session
- POST /preview → { html } from Markdown + template/theme/branding
- POST /pdf → application/pdf response
- Authenticated:
  - POST /history → { id } save entry
  - GET /history → { items } list entries
  - DELETE /history/:id → { ok: true } delete entry

Server and routes: [server.js](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend/src/server.js)
PDF render: [pdf.js](file:///c:/Users/Admin/Documents/trae_projects/makedown_to_pdf/backend/src/pdf.js)

## Implementation Notes
- Markdown → HTML: markdown-it, linkify, breaks
- HTML sanitization: sanitize-html
- PDF generation: Puppeteer with A4, margins, printBackground
- SQLite: better-sqlite3 (WAL enabled), data at backend/data/app.db
- Sessions: express-session with cookie-based session

## Troubleshooting
- Puppeteer in containers:
  - Uses --no-sandbox; works in Docker. If issues occur, ensure container has required fonts.
- CORS:
  - Backend allows origin FRONTEND_URL; default http://localhost:3000.
- OAuth callback mismatch:
  - Ensure redirect URI exactly matches http://localhost:8080/api/auth/google/callback.
- Fonts:
  - Custom font family must be available to the rendering environment. Google Fonts are preloaded for Inter/Merriweather in server-side HTML.

## Production
- Set proper SESSION_SECRET and disable ALLOW_DEV_LOGIN
- Configure HTTPS and secure cookies
- Pin fonts and assets
- Use external DB if needed
- Host frontend behind CDN (Nginx image already serves static)

## License
MIT (adjust as needed)

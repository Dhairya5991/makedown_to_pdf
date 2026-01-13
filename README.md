# 📝 Markdown to PDF — React + Node.js Web App

A **production-ready full-stack application** to generate **clean, print-ready PDFs** from live Markdown with templates, themes, branding, preview, and OAuth-backed history.

Built with a **mobile-responsive React frontend** and a **Node.js backend** using Puppeteer for accurate PDF rendering.

---

## ✨ Key Features

- Live Markdown editor with instant HTML preview  
- Server-rendered PDF preview (exact print output)  
- Print-ready PDF generation (A4, margins, background graphics)  
- Resume & Invoice templates  
- Resume themes: Classic, Modern, Minimal  
- Branding support: accent color, font, logo, subtitle  
- One-click PDF download  
- Google OAuth authentication + dev login fallback  
- Save, list, download, and delete document history  
- Mobile-responsive UI with Dark Mode  
- Docker & docker-compose support  

---

## 🛠 Tech Stack

**Frontend**
- React 18
- Vite
- React Router

**Backend**
- Node.js 20
- Express
- Passport.js (Google OAuth)
- Puppeteer
- markdown-it
- sanitize-html

**Database**
- SQLite (better-sqlite3, WAL enabled)

**DevOps**
- Docker
- docker-compose

---

## 📁 Project Structure

```
makedown_to_pdf/
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   └── pages/
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── auth.js
│   │   ├── pdf.js
│   │   └── db.js
│   ├── data/app.db
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## 🎨 Templates & Branding

**Templates**
- Resume
- Invoice

**Resume Themes**
- Classic
- Modern
- Minimal

**Branding Options**
- Accent color (hex)
- Font family
- Logo URL
- Subtitle / tagline

---

## 🔌 API Overview

Base URL: `/api`

- `GET /health` → service status  
- `GET /me` → current user  
- `GET /auth/google` → OAuth login  
- `POST /auth/logout` → logout  
- `POST /preview` → HTML preview  
- `POST /pdf` → PDF output  

**Authenticated**
- `POST /history` → save document  
- `GET /history` → list documents  
- `DELETE /history/:id` → delete document  

---

## 🧠 Implementation Notes

- Markdown → HTML: `markdown-it`
- Sanitization: `sanitize-html`
- PDF rendering: Puppeteer (A4, printBackground enabled)
- Sessions: cookie-based (`express-session`)
- Fonts: Inter & Merriweather preloaded for server rendering

---

## 🏭 Production Notes

- Set a strong `SESSION_SECRET`
- Disable dev login (`ALLOW_DEV_LOGIN=false`)
- Use HTTPS and secure cookies
- Pin fonts and assets
- Replace SQLite with external DB if needed
- Frontend is CDN / Nginx ready

---

## 📄 License

MIT (adjust as needed)

---

## ⭐ Why This Project?

- Real-world Markdown → PDF workflow  
- Accurate print rendering  
- OAuth authentication & history  
- Clean DevOps setup  
- Portfolio-ready full-stack architecture  

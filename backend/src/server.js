import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import { PORT, SESSION_SECRET, FRONTEND_URL } from './config.js';
import { authRouter } from './auth.js';
import { renderHtml, htmlToPdfBuffer } from './pdf.js';
import { docs } from './db.js';

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);

function requireAuth(req, res, next) {
  if (req.user) return next();
  res.status(401).json({ error: 'unauthorized' });
}

app.get('/api/me', (req, res) => {
  res.json({ user: req.user || null });
});

app.post('/api/pdf', async (req, res) => {
  try {
    const { markdown, template, theme, branding, title } = req.body || {};
    const html = renderHtml({ markdown, template, theme, branding });
    const pdf = await htmlToPdfBuffer(html, {});
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(title || 'document').replace(/[^a-z0-9_-]/gi, '_')}.pdf"`);
    res.send(pdf);
  } catch (e) {
    res.status(500).json({ error: 'pdf_generation_failed' });
  }
});

app.post('/api/preview', async (req, res) => {
  try {
    const { markdown, template, theme, branding } = req.body || {};
    const html = renderHtml({ markdown, template, theme, branding });
    res.json({ html });
  } catch (e) {
    res.status(500).json({ error: 'preview_failed' });
  }
});

app.post('/api/history', requireAuth, (req, res) => {
  const { markdown, template, theme, branding, title } = req.body || {};
  const id = docs.create({
    user_id: req.user.id,
    title,
    markdown,
    template,
    theme,
    branding
  });
  res.json({ id });
});

app.get('/api/history', requireAuth, (req, res) => {
  const list = docs.listByUser(req.user.id);
  res.json({ items: list });
});

app.delete('/api/history/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  docs.delete(id, req.user.id);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

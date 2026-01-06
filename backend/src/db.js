import Database from 'better-sqlite3';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'backend', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');
export const db = new Database(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    google_id TEXT,
    name TEXT,
    email TEXT,
    avatar TEXT,
    created_at TEXT
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google ON users(google_id);
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    markdown TEXT,
    template TEXT,
    theme TEXT,
    branding JSON,
    created_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
`);

export const users = {
  upsertGoogle({ google_id, name, email, avatar }) {
    const existing = db.prepare('SELECT id FROM users WHERE google_id = ?').get(google_id);
    if (existing) return existing.id;
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO users (id, google_id, name, email, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      id,
      google_id,
      name || '',
      email || '',
      avatar || '',
      new Date().toISOString()
    );
    return id;
  },
  getById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
};

export const docs = {
  create({ user_id, title, markdown, template, theme, branding }) {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO documents (id, user_id, title, markdown, template, theme, branding, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      id,
      user_id,
      title || 'Untitled',
      markdown || '',
      template || 'resume',
      theme || 'classic',
      JSON.stringify(branding || {}),
      new Date().toISOString()
    );
    return id;
  },
  listByUser(user_id) {
    return db.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
  },
  getById(id) {
    return db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
  },
  delete(id, user_id) {
    return db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(id, user_id);
  }
};

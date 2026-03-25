// ──────────────────────────────────────────────
//  Portfolio Backend — server.js
//  Stack: Node.js + Express + PostgreSQL (or MySQL)
//  Run: npm install && node server.js
// ──────────────────────────────────────────────

const express = require('express');
const { Pool }  = require('pg');          // swap with 'mysql2' for MySQL
const cors      = require('cors');
const path      = require('path');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend

// ── DATABASE CONNECTION ─────────────────────────
const db = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'portfolio_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Initialise table on startup
async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(120) NOT NULL,
        email      VARCHAR(180) NOT NULL,
        message    TEXT        NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅  Database connected & table ready');
  } catch (err) {
    console.error('❌  DB init error:', err.message);
  }
}
initDB();

// ── ROUTES ──────────────────────────────────────

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// GET all contact messages (mentor review endpoint)
app.get('/api/contacts', async (_, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST — contact form submission (called from index.html)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [name, email, message]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Catch-all → serve index.html (SPA support)
app.get('*', (_, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

// ── START SERVER ────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀  Server running → http://localhost:${PORT}`);
});

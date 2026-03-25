// ──────────────────────────────────────────────
//  Portfolio Backend — server.js
//  Stack: Node.js + Express + MySQL (or MySQL)
//  Run: npm install && node server.js
// ──────────────────────────────────────────────

const express = require('express');
const mysql   = require('mysql2/promise'); // Using promise-based wrapper
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── DATABASE CONNECTION ─────────────────────────
let db;

async function connectDB() {
  try {
    db = await mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     process.env.DB_PORT     || 3306,      // MySQL default port
      database: process.env.DB_NAME     || 'portfolio_db',
      user:     process.env.DB_USER     || 'root',      // MySQL default user
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
    });
// Initialise table on startup
await db.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(120) NOT NULL,
        email      VARCHAR(180) NOT NULL,
        message    TEXT        NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ MySQL Database connected & table ready');
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
  }
}
connectDB();
// ── ROUTES ──────────────────────────────────────

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// GET all contact messages (mentor review endpoint)
app.get('/api/contacts', async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
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
    // MySQL uses '?' as placeholders instead of '$1, $2'
    const [result] = await db.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Catch-all → serve index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ── START SERVER ────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));


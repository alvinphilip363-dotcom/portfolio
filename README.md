# 🚀 Portfolio — Full Stack Web App

A single-page portfolio website with a **React-style HTML/CSS/JS frontend**, **Node.js + Express backend**, and a **mySQL database** — mirroring the Modern Web Development Workflow diagram.

```
Frontend (HTML/CSS/JS)
      ↓
Backend API (Node.js / Express)   ←──→   Database (mySQL)
      ↓
Git → GitHub → CI/CD → Hosting
```

---

## 📁 Project Structure

```
portfolio/
├── public/
│   └── index.html        ← Frontend (single page)
├── server.js             ← Backend (Express API)
├── package.json
├── .env.example          ← Copy to .env and fill values
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/alvinphilip363-dotcom/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up mySQL database
```sql
-- Run in mysql or pgAdmin:
CREATE DATABASE portfolio_db;
```

### 4. Configure environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 5. Move frontend into public folder
```bash
mkdir -p public
mv index.html public/index.html
```

### 6. Start the server
```bash
npm start
# → http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Route            | Description                    |
|--------|------------------|--------------------------------|
| GET    | `/api/health`    | Server health check            |
| POST   | `/api/contact`   | Submit contact form (→ DB)     |
| GET    | `/api/contacts`  | List all messages (mentor use) |

**Test with curl:**
```bash
# Submit a message
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","message":"Hello!"}'

# View all messages
curl http://localhost:3000/api/contacts
```

---

## 🔀 Git & GitHub Setup

### Step 1 — Initialise local git
```bash
git init
git add .
git commit -m "feat: initial portfolio commit"
```

### Step 2 — Create GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `portfolio` (public)
3. Do **not** initialise with README (you already have one)

### Step 3 — Push to GitHub
```bash
git remote add origin https://github.com/alvinphilip363-dotcom/portfolio.git
git branch -M main
git push -u origin main
```

### Step 4 — Share with mentor
Give your mentor the repository URL, e.g.:
```
https://github.com/YOUR_USERNAME/portfolio
```
They can clone and run it locally, or review code directly on GitHub.

---

## 🤝 Mentor Review Checklist

**To review the code:**
```bash
git clone https://github.com/alvinphilip363-dotcom/portfolio.git
cd portfolio
npm install
cp .env.example .env   # configure DB
npm start
```

**What to look for:**
- `public/index.html` — Frontend structure, CSS variables, scroll animations
- `server.js` — Express routes, DB pool, input validation
- `POST /api/contact` → saves to `contacts` table in PostgreSQL
- `GET /api/contacts` → retrieve all submissions for review

---

## 🚀 Deployment Workflow (CI/CD)

This project follows the diagram workflow:

```
Local Git Repo
    ↓  git push
GitHub (GitLab / Bitbucket)
    ↓  webhook trigger
CI/CD (GitHub Actions / CircleCI / Codeship)
    ↓  test → lint → build
FTP / SSH Deploy  OR  Direct Hosting (Vercel / Railway)
    ↓
Web Browser  ←→  Hosted App + Database
```

### GitHub Actions CI (optional)
Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '20' }
      - run: npm install
      - run: node -e "require('./server.js')" &
      - run: curl -f http://localhost:3000/api/health
```

---

## 📌 .gitignore
```
node_modules/
.env
*.log
```

---

## 📄 License
MIT — free to use, fork, and learn from.
# port

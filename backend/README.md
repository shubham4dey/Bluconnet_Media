# BluConnet AI Assistant — Backend

A lightweight, zero-config Express API that powers the website chatbot:
lead capture, meeting bookings, job applications, live-chat handoffs,
conversation history, live visitors, analytics, CSV export and
webhook / email / CRM notifications.

## Run

```bash
cd backend
npm install
node server.js        # → http://localhost:5000
```

Data is stored as JSON under `backend/data/` (created on first run) —
no database setup required. Swap in MongoDB by reimplementing
`config/database.js`.

## Frontend (admin login)

- User:  `bluconnetnews`
- Pass:  `bluconnetmedia@2026`

These match `.env` (`ADMIN_USER` / `ADMIN_PASS`) and the existing
`/login` page so every panel uses one credential set.

## Configuration (`.env`)

| Var                | Purpose                        |
| ------------------ | ------------------------------ |
| `PORT`             | Server port                    |
| `FRONTEND_ORIGIN`  | CORS allow-list                |
| `WEBHOOK_URL`      | Slack / Zapier webhook         |
| `CRM_WEBHOOK_URL`  | CRM passthrough webhook        |
| `SMTP_*`           | Email notifications            |
| `NOTIFY_EMAIL`     | Where notifications land       |
| `GEMINI_API_KEY`   | Google Gemini key (general-knowledge AI answers) |
| `GEMINI_MODEL`     | Gemini model id (default `gemini-2.0-flash`) |

> **Gemini (optional):** add `GEMINI_API_KEY` to `.env` to enable
> general-knowledge answers. The chatbot answers company questions from
> its built-in knowledge base and automatically uses Gemini only for
> unrelated / general questions. Responses always follow the language
> the visitor selected. If the key is missing the chatbot falls back to
> a polite "I'll connect you with our team" message.

## API

| Method | Route                      | Auth  |
| ------ | -------------------------- | ----- |
| GET    | `/api/health`              | —     |
| POST   | `/api/lead`                | —     |
| POST   | `/api/meeting`             | —     |
| POST   | `/api/application`         | —     |
| POST   | `/api/handoff`             | —     |
| POST   | `/api/feedback`            | —     |
| POST   | `/api/chat/session`        | —     |
| POST   | `/api/visitor/heartbeat`   | —     |
| POST   | `/api/upload`              | —     |
| POST   | `/api/ai/chat`             | —     |
| POST   | `/api/admin/login`         | —     |
| GET    | `/api/admin/dashboard`     | admin |
| GET    | `/api/admin/settings`      | admin |
| GET    | `/api/admin/:collection`   | admin |
| GET    | `/api/admin/export/:c`     | admin |
| PUT    | `/api/admin/settings`      | admin |
| PUT    | `/api/admin/:collection/:id` | admin |

# BluConnet AI Assistant — Backend

A lightweight, zero-config Express API that powers the website chatbot:
lead capture, meeting bookings, job applications, live-chat handoffs,
conversation history, live visitors, analytics, CSV export and
webhook / email / CRM notifications.

## Run

```bash
cd backend
npm install
npm run migrate        # create the MySQL schema (contacts table)
node server.js        # → http://localhost:5000
```

Two storage layers, both in this backend:

| Data                                                                        | Storage                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Contact-form enquiries (`POST /api/contact`) — Hero / Home / Contact page     | **MySQL** — `contacts` table (`config/mysql.js` + `database/migrations`) |
| Chatbot data: leads, meetings, applications, handoffs, feedback, sessions, visitors, news | JSON store under `backend/data/` (unchanged, `config/database.js`) |

### MySQL (contact forms)

The contact forms are backed by MySQL. Configure it in `.env`:

| Var                       | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `MYSQL_HOST` / `MYSQL_PORT` | Server (default `127.0.0.1:3306`)         |
| `MYSQL_USER` / `MYSQL_PASSWORD` | Credentials — **never commit real values** |
| `MYSQL_DATABASE`          | Schema name (default `bluconnet_media`)     |
| `MYSQL_URL` (optional)    | Single connection string, overrides the four above |
| `MYSQL_SSL` (optional)    | `true` for TLS-only managed MySQL           |

```bash
npm run migrate            # apply database/migrations/*.sql (idempotent)
npm run contacts:verify    # print the newest contact rows straight from MySQL
```

The server also applies the migrations on boot, so a fresh deploy needs no
manual step; if MySQL is unreachable the JSON-backed endpoints keep working
and `POST /api/contact` answers with a clean `500`.

Verify stored rows directly in MySQL:

```sql
USE bluconnet_media;
SELECT * FROM contacts ORDER BY createdAt DESC;
```


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
| POST   | `/api/contact`             | —     |
| POST   | `/api/admin/login`         | —     |
| GET    | `/api/admin/dashboard`     | admin |
| GET    | `/api/admin/settings`      | admin |
| GET    | `/api/admin/:collection`   | admin |
| GET    | `/api/admin/export/:c`     | admin |
| PUT    | `/api/admin/settings`      | admin |
| PUT    | `/api/admin/:collection/:id` | admin |

### `POST /api/contact` — one endpoint, all three contact forms

Hero, the Home contact section and the Contact page all post the same shape;
`source` records which form it came from (`hero` | `home-contact` | `contact-page`)
so the Admin Panel can tell them apart. Stored in MySQL (`contacts`).

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "companyName": "Example Ltd",
  "helpWith": "Consulting / Project work",
  "country": "India",
  "message": "I want to discuss a project.",
  "hearAbout": "LinkedIn",
  "agreeToContact": true,
  "source": "hero"
}
```

| Result            | Status | Body                                                                |
| ----------------- | ------ | ------------------------------------------------------------------- |
| Stored            | 201    | `{ "success": true, "message": "Your message has been submitted successfully.", "data": { "id": "1" } }` |
| Validation failed | 400    | `{ "success": false, "message": "Please complete all required fields.", "errors": [ … ] }` |
| Server/MySQL down | 500    | `{ "success": false, "message": "Something went wrong. Please try again." }` |

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","companyName":"Example Ltd","helpWith":"Consulting / Project work","country":"India","message":"Hello","hearAbout":"LinkedIn","agreeToContact":true,"source":"hero"}'
```

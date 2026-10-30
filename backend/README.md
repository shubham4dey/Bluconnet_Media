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

Three storage layers, all in this backend:

| Data                                                                        | Storage                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Contact-form enquiries (`POST /api/contact`) — Hero / Home / Contact page     | **MySQL** — `contacts` table (`config/mysql.js` + `database/migrations`) |
| Chatbot data: leads, meetings, applications, handoffs, feedback, sessions, visitors | JSON store under `backend/data/` (unchanged, `config/database.js`) |
| **News articles** (Admin panel CMS)                                          | **MySQL** — `news` table, with `backend/data/news.json` as a local read mirror (`models/newsModel.js`) |
| **News images** (Admin panel uploads)                                        | **Cloudinary** — permanent URLs (`services/cloudinary.js` + `services/newsImage.js`) |

### News images → Cloudinary (never the local disk)

Render (and every other PaaS) wipes the local filesystem on each restart /
redeploy, so an image saved in `backend/uploads/` disappears. Every News image
uploaded from the Admin panel is therefore streamed straight to Cloudinary and
the article stores only:

| Field | Meaning |
| ----- | ------- |
| `imageUrl` | Cloudinary `secure_url` — what the public News page loads |
| `imagePublicId` | Cloudinary `public_id` — used to replace/delete the asset |

Configure the credentials in `.env` (the cloud already used by the BluConnet
website / blog is `wyixfdon`):

| Var | Purpose |
| --- | ------- |
| `CLOUDINARY_CLOUD_NAME` | Cloud name (defaults to `wyixfdon`) |
| `CLOUDINARY_API_KEY` | API key (Dashboard → Settings → API Keys) |
| `CLOUDINARY_API_SECRET` | API secret |
| `CLOUDINARY_URL` (optional) | Single SDK-native URL, overrides the three above |
| `CLOUDINARY_NEWS_FOLDER` (optional) | Upload folder, default `bluconnet/news` |

Behaviour:

- **Upload failure** → the endpoint answers `502`/`503` **without a URL** and the
  article is saved with an empty image instead of a broken path.
- **Image replaced** → the new image is uploaded first, the article is written,
  and only then is the previous Cloudinary asset deleted (best effort).
- **Article deleted** → its Cloudinary asset is deleted as well.
- **Migration** → legacy `/uploads/...` and inline base64 images are re-uploaded:

```bash
npm run news:images:migrate              # local /uploads + inline base64
npm run news:images:migrate -- --remote  # also re-host external URLs
npm run news:images:migrate -- --dry-run # report only, nothing is written
```

The server also runs the non-remote part on boot, so a deploy self-heals the
images it can still recover. Nothing is written to `backend/uploads/` anymore
(the `/uploads` static route only exists so old references keep resolving).

The same pass also repairs a **half-stored image row**: when an article has no
`imageUrl` but still carries its `imagePublicId` (a publish interrupted while
the upload was running, a hand-edited row), the delivery URL is rebuilt from the
`public_id` (`https://res.cloudinary.com/<cloud>/image/upload/<public_id>`), so
an image that is already on Cloudinary shows up again instead of a placeholder.
An article where *both* fields are empty cannot be recovered automatically — it
has to be re-uploaded from the Admin panel.

The Admin panel uploads through the authenticated `POST /api/admin/news/upload`
route (Admin permissions unchanged); the legacy public `POST /api/upload`
keeps the same contract but now also stores on Cloudinary.

> **Render setup:** add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
> `CLOUDINARY_API_SECRET` to the service's environment variables. Without them
> the upload endpoint answers `503` and the Admin panel shows the error instead
> of saving a broken image.

### News articles → MySQL (never a Render file)

News articles used to live **only** in `backend/data/news.json`. Render wipes
that file on every restart / redeploy (and when a free instance spins down), so
every published article disappeared. Articles are therefore stored in MySQL —
the same database as contacts/subscribers — and the JSON file is kept only as a
**local read mirror**:

| Layer | Role |
| ----- | ---- |
| MySQL `news` table (`database/migrations/003_create_news_table.sql`) | Source of truth — survives restarts, redeploys and spin-downs |
| `backend/data/news.json` | Local read mirror: public pages read it synchronously and it keeps the API answering if MySQL is momentarily unreachable |

| Field | Meaning |
| ----- | ------- |
| `imageUrl` | Cloudinary `secure_url` — what the public News page loads |
| `imagePublicId` | Cloudinary `public_id` — used to replace/delete the asset |

Behaviour:

- **Boot order** — create/verify the schema → upgrade legacy images to
  Cloudinary → import mirror articles MySQL does not have yet (`INSERT IGNORE`
  on the primary key: no duplicates, nothing overwritten) → hydrate the mirror
  from MySQL. Every step is independent and best-effort.
- **Deploy safety** — a write that cannot reach MySQL is reported as an error
  (`503`) in production and stores nothing, so the panel never says "published"
  for an article a redeploy would wipe; a retry can never create a duplicate.
  Set `NEWS_REQUIRE_DB=false` to allow a mirror-only development setup.
- **One-time recovery** — `database/seeds/news.seed.json` re-creates the article
  that was live in production before this change. It is applied **only while the
  `news` table is empty**, so it can never resurrect a deleted article.

```bash
npm run news:verify                   # articles straight from MySQL + mirror/image status
npm run news:verify -- 25             # only the 25 newest
```

```sql
USE bluconnet_media;
SELECT id, status, date, title, imageUrl, imagePublicId FROM news ORDER BY date DESC;
```

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

The credentials are **not documented here any more** — they must never live in
the repository (this file used to print the real password, and the shipped
frontend bundle used to embed it so anyone could mint an admin token).

- The single source of truth is the server environment: `ADMIN_USER` /
  `ADMIN_PASS` (see `.env.example`). Without them `POST /api/admin/login`
  answers `503` instead of accepting a default password.
- `/login` (News panel) and `/admin/chat` (AI panel) both authenticate through
  that endpoint and keep only the returned session token
  (`bc_admin_token`, 12 h TTL, revoked by `POST /api/admin/logout`).
- Nothing on the client knows or guesses a password any more.

**If the old credential set was ever published, rotate it now:** set a new
`ADMIN_PASS` on Render and restart the service.

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
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud for News images (default `wyixfdon`) |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials (required for News uploads) |
| `CLOUDINARY_NEWS_FOLDER` | Upload folder (default `bluconnet/news`) |
| `NEWS_REQUIRE_DB` | `true` (default in production): a write that cannot reach MySQL fails loudly instead of silently staying in the local mirror |
| `NEWS_IMPORT_MIRROR` | `true` (default): import mirror-only articles into MySQL on boot — set `false` on a dev machine pointed at the production database |
| `NEWS_DB_REFRESH_MS` | `0` (default): interval for re-reading the local mirror from MySQL |

### Deploy checklist (Render + Cloudinary)

1. Push to the branch Render deploys (the migrations + schema run automatically
   on boot — `npm run migrate` is never needed manually).
2. In the Render service, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET` (from the Cloudinary dashboard → Settings → API Keys).
3. **Set the MySQL connection — this is the step that was missing in
   production.** The database runs on Namecheap, which only exposes the cPanel
   SSH port (21098): MySQL 3306 is **not** reachable from the internet, so an
   API hosted anywhere else must go through the built-in SSH tunnel
   (`config/mysql.js`):

   | Variable | Value |
   | -------- | ----- |
   | `NAMECHEAP_SSH_HOST` | `66.29.132.129` (cPanel server) |
   | `NAMECHEAP_SSH_PORT` | `21098` |
   | `NAMECHEAP_SSH_USER` | the cPanel user |
   | `NAMECHEAP_SSH_KEY_B64` | the cPanel **private** key, base64-encoded on ONE line |
   | `NAMECHEAP_SSH_PASSPHRASE` | only if the key has one |
   | `MYSQL_DATABASE` (or `DB_NAME`) | the **full cPanel database name**, e.g. `bluchknj_bluconnet_media` |
   | `MYSQL_USER` (or `DB_USER`) | the cPanel database user |
   | `MYSQL_PASSWORD` (or `DB_PASSWORD`) | the database password |

   Without the `NAMECHEAP_SSH_*` trio the process logs
   `[mysql] Namecheap SSH tunnel DISABLED — missing: …` together with
   `[mysql] UNREACHABLE TARGET: host=127.0.0.1 (loopback) …`, the `news` table
   is never initialised and the public API answers from the **empty local
   mirror** — i.e. the exact symptom of "the rows are in MySQL but the site
   shows no news".
4. Confirm with `GET /api/health`:

   ```json
   {"news":{"store":{"durable":true,"mirror":5,"target":"user@127.0.0.1:5522/bluchknj_bluconnet_media",
     "connect":{"tunnel":"user@66.29.132.129:21098","lastError":null}},
     "images":{"configured":true}}}
   ```

   - `store.durable` must be `true` (articles are read from MySQL).
   - `store.mirror` is what `/api/news` is serving **right now** — if it is `0`
     while the table has rows, `store.connect.lastError` (never contains the
     password) names the failing step.
   - `images.configured` must be `true` (uploads go to Cloudinary).
5. Add a News article from the Admin panel with an image. The response stores
   `imageUrl` = `https://res.cloudinary.com/...` and the article survives the
   next restart/redeploy.

### Frontend deploy (static build on Namecheap)

The build must talk to the **deployed** backend, and the URL lives in exactly
one place (`frontend/src/services/apiConfig.js`, fed by
`frontend/.env.production`):

```bash
cd frontend
npm run build      # → build/  (upload its contents next to index.html)
```

```bash
grep -o "REACT_APP_API_URL:\"[^\"]*\"" build/static/js/main.*.js   # must print the deployed backend
```

> A transposed hostname (`bluconnet-backend-m2jl…` instead of `…-m2lj…`) was
> shipped in this bundle once. That host does not exist, Render answers `404`
> with the header `x-render-routing: no-server` for **every** path, and the
> News page + Home "recent news" section silently fell back to their empty
> state. `services/apiConfig.js` now holds the only copy of the URL and logs a
> loud error when it points at that dead host.


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
| POST   | `/api/admin/news/upload`   | admin |
| POST   | `/api/admin/news/migrate-images` | admin |
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

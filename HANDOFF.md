# AI Work Instruction Assistant — Project Handoff

> **Read this first.** This document is the single source of truth for picking up
> this project cold. It covers what we're building, the current state, how to run
> it, the conventions to follow, and exactly what to do next. A new session should
> be able to start from this file alone with zero loss of continuity.

---

## 1. What we are building

**Product:** An AI Work Instruction Assistant — a RAG (retrieval-augmented
generation) web app for small-to-mid-sized manufacturers (50–1,500 employees).

**Core value:** Admins upload approved documents (PDF / DOCX / TXT — SOPs, work
instructions, quality procedures). Shop-floor workers ask plain-English questions
and get answers **drawn only from those approved documents**, each with a **source
citation** and an **AI confidence score**. If no approved content matches, the
assistant says it cannot answer rather than hallucinating.

**Why it matters:** Faster onboarding, fewer interruptions to senior staff,
consistent answers across shifts, trustworthy answers grounded in the company's
own material.

**Timebox & intent:** A 3-week MVP built for live client demos. It is NOT a
production system. Every decision should serve the demo story. Defer anything on
the out-of-scope list (Section 9) unless explicitly asked.

**Full spec:** `/Users/rayyan/Downloads/MVP_Requirements_AI_Work_Instruction_Assistant_restore.pdf`
(21 pages). The memory files (Section 11) summarise it.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 19 + Vite 8 | SPA, runs on `localhost:5173` |
| Routing | react-router-dom v7 | |
| Charts | recharts v3 | Used on Usage Dashboard |
| Backend | Flask 3 (Python 3.13) | Runs on `localhost:5000` |
| Auth | flask-jwt-extended + bcrypt | JWT tokens, bcrypt-hashed passwords |
| Database | Supabase (Postgres) | `pgvector` extension enabled for future RAG |
| AI (future) | TBD — keep generic | See Section 10. Decided to defer AI and keep it pluggable. |

**Planned AI approach (not yet built):** OpenAI `text-embedding-3-small` for
embeddings + a mid-tier generation model (Claude/GPT) for grounded answers, with
pgvector for retrieval. **Per team direction, build everything else first and keep
the AI layer generic so any framework can be plugged in later.**

---

## 3. Repository layout

```
/Users/rayyan/Prebuilt_MVP
├── HANDOFF.md                 ← this file
├── README.md
├── backend/
│   ├── app.py                 ← Flask init, CORS, JWT, Supabase client, entry point
│   ├── auth.py                ← /authentication (login)
│   ├── dashboard.py           ← placeholder (no routes yet)
│   ├── documents.py           ← /documents (upload)
│   ├── requirements.txt
│   ├── .env                   ← secrets (gitignored) — see Section 5
│   └── venv/                  ← Python virtual environment
└── frontend/
    └── src/
        ├── main.jsx           ← entry; applies saved theme before render
        ├── App.jsx            ← all routes + role gating
        ├── theme.css          ← light/dark CSS variables + dark-mode overrides
        ├── api/
        │   └── api.jsx        ← send_login_data, send_doc_data (named exports)
        ├── components/
        │   ├── Layout.jsx/css        ← sidebar + topbar shell around every page
        │   ├── Sidebar.jsx/css       ← role-filtered nav, theme-aware
        │   ├── ProtectedRoute.jsx    ← auth + role gate, wraps pages in Layout
        │   ├── ThemeToggle.jsx/css   ← sun/moon dark-mode toggle
        └── Pages/                    ← one folder per screen, each with .jsx + .css
            ├── Login/                ← ✅ wired to backend
            ├── Assistant/            ← mock data
            ├── DocumentSearch/       ← mock data
            ├── DocumentManagement/   ← ✅ upload wired to backend; table is local state
            ├── UserManagement/       ← mock data (has Team field)
            ├── TeamManagement/       ← mock data
            ├── AccessControl/        ← mock data (team→group)
            ├── AdminSettings/        ← mock data
            ├── UsageDashboard/       ← mock data + recharts
            ├── QuizBuilder/          ← mock data
            ├── TakeQuiz/             ← mock data
            └── QuizResults/          ← mock data
```

---

## 4. How to run it

**Backend** (terminal 1):
```bash
cd /Users/rayyan/Prebuilt_MVP/backend
source venv/bin/activate
python app.py            # serves http://127.0.0.1:5000
```

**Frontend** (terminal 2):
```bash
cd /Users/rayyan/Prebuilt_MVP/frontend
npm install              # first time only
npm run dev              # serves http://localhost:5173
```

**If port 5000 is stuck:** `lsof -ti:5000 | xargs kill -9`

**Sanity checks:**
- Backend syntax: `python -c "import ast; ast.parse(open('app.py').read())"`
- Frontend build: `npx vite build` (catches import/JSX errors ESLint misses)
- Lint: `npx eslint .`

---

## 5. Environment & secrets

`backend/.env` (gitignored — never commit) holds:
```
SECRET_KEY=...        # JWT signing key
FLASK_ENV=development
DATABASE_URL=https://<project>.supabase.co     # project URL, NO /rest/v1/ suffix
DATABASE_KEY=...      # Supabase service_role key — full DB access, keep secret
```
`.env` is confirmed in `.gitignore`. The Supabase service key bypasses all DB
rules — if it ever leaks, rotate it immediately.

---

## 6. CRITICAL backend gotcha (already solved — do not regress)

`app.py` is run directly (`python app.py`), so Python loads it as module
`__main__`. When `auth.py` etc. do `from app import app, supabase`, Python would
otherwise **re-execute app.py and create a second Flask instance**, so routes
register on the wrong instance and return 404. Two rules keep this working:

1. **`app.py` aliases itself** at the top:
   ```python
   if __name__ == '__main__':
       sys.modules['app'] = sys.modules[__name__]
   ```
2. **Every backend file with routes MUST be imported in `app.py`** inside the
   `if __name__ == '__main__'` block (currently `auth`, `dashboard`, `documents`).
   **If you add a new routes file, add its import there or its routes won't exist.**

Other backend conventions:
- `request.get_json()` returns a **dict** → use `data.get('Key')`, not `data.Key`.
- For file uploads use **FormData**, read via `request.files.get('file')` and
  `request.form.get('Field')` — NOT `get_json()`.
- Supabase insert takes **one dict** for one row: `.table('x').insert({...}).execute()`.
- Trust Supabase error messages — `PGRST204 Could not find the 'X' column` means
  the column name is wrong (e.g. `uploaded_by`, not `upload_by`).

---

## 7. Auth & access-control model

**Authentication:** Login posts to `/authentication`. Backend verifies the bcrypt
hash, then issues a JWT containing `user_id`, `role`, `username`. Frontend stores
`token`, `role`, `username` in `localStorage`.

**Two separate concerns — keep them separate:**
- **Role** = what features/screens you can use (Administrator, Operator,
  Supervisor, Executive Viewer).
- **Team** = which documents you can see (data visibility).

**Frontend role gating:** `components/ProtectedRoute.jsx` wraps each route. It
checks the token (else → `/`) and `allowedRoles` (else redirects by role). It also
wraps the page in `<Layout>` (sidebar + topbar). Role strings must EXACTLY match
the DB: `Administrator`, `Operator`, `Supervisor`, `Executive Viewer`.

**Document-visibility rule (for when the AI/retrieval is built):**
```
Administrator              → sees ALL document groups (bypasses teams)
everyone else              → teams_visible = [home team] + [extra teams granted]
                             → all document groups mapped to any of those teams
```
- `users.team_id` = home team.
- `team_group_access` = which groups a team can view.
- `user_team_access` = extra teams a user (mainly supervisors) can also view.

**Routes & who can reach them** (`App.jsx`):
| Path | Roles |
|---|---|
| `/` (Login) | public |
| `/assistant` | Admin, Operator, Supervisor |
| `/documents/search` | any logged-in |
| `/quiz/take` | any logged-in |
| `/dashboard` | Admin, Supervisor, Executive Viewer |
| `/quiz/builder` | Admin, Supervisor |
| `/quiz/results` | Admin, Supervisor, Executive Viewer |
| `/users`, `/teams`, `/documents/manage`, `/access-control`, `/settings` | Admin only |

---

## 8. Database schema (Supabase)

All core tables created. Run any missing `INSERT`s for demo data.

**Original spec tables:** `users`, `document_groups`, `documents`,
`role_group_access` (now superseded — see below), `query_log`, plus quiz tables
(`quiz`, `quiz_question`, `quiz_attempt` — defined in spec, may not all be created
yet; verify in Supabase).

**Teams extension (added on user request, NOT in original spec):**
```sql
CREATE TABLE teams (
  team_id SERIAL PRIMARY KEY, team_name VARCHAR(100) NOT NULL,
  description VARCHAR(500), created_date TIMESTAMP DEFAULT NOW(), created_by VARCHAR(100));

ALTER TABLE users ADD COLUMN team_id INTEGER REFERENCES teams(team_id);

CREATE TABLE team_group_access (
  access_id SERIAL PRIMARY KEY, team_id INTEGER NOT NULL REFERENCES teams(team_id),
  document_group_id INTEGER NOT NULL REFERENCES document_groups(group_id),
  can_view BOOLEAN NOT NULL DEFAULT TRUE);

CREATE TABLE user_team_access (
  id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(user_id),
  team_id INTEGER NOT NULL REFERENCES teams(team_id));
```
- `role_group_access` is left in the DB but **unused** — team-based access replaced it.
- `documents` columns: `document_id, title, file_name, file_type, file_size_kb,
  document_group_id, version, status, uploaded_by, uploaded_date`. Note the
  `-ed`: `uploaded_by` / `uploaded_date`. `uploaded_date` has `DEFAULT NOW()` — do
  not insert it manually.

**Demo data needed for uploads to work** (group names must match the dropdown):
```sql
INSERT INTO document_groups (group_name, created_by) VALUES
('Line 1 Procedures','admin'),('Line 2 Procedures','admin'),
('Quality','admin'),('Safety','admin');
```

**Test accounts** (password shown; stored bcrypt-hashed):
| Username | Password | Role |
|---|---|---|
| `admin` | (set during setup) | Administrator |
| `operator` | `operator123` | Operator |
| `supervisor` | `supervisor123` | Supervisor |
| `viewer` | `viewer123` | Executive Viewer |

To generate a new bcrypt hash:
```bash
python3 -c "import bcrypt; print(bcrypt.hashpw('PASSWORD'.encode(), bcrypt.gensalt()).decode())"
```

---

## 9. Current status — what's done vs not

**✅ Done & working end-to-end:**
- Login → JWT → role-based redirect + route protection
- Role-filtered sidebar; theme-aware Layout with topbar
- Dark/light mode (sun/moon toggle, persisted, matches the "File Guardian" prototype palette)
- All 12 page UIs built and styled (consistent theme, light+dark)
- Document **upload**: file sent via FormData → backend reads file, derives real
  filename/type/size, looks up group id, inserts metadata row into Supabase
- Teams model + Team Management page + Access Control (team→group) + Team field in User Management

**🟡 Built as UI only (mock data, no backend yet):** every page except Login and
the Document Management upload. Each page has a clearly-named `MOCK_*` constant at
the top — swap it for a `useEffect` + `fetch` when wiring the backend.

**❌ Known gaps / not yet built:**
- Uploaded file **bytes are read but not stored** anywhere (no Supabase Storage /
  disk yet). Needed later for source-citation links + text extraction.
- No backend for: users CRUD, teams, access-control, dashboard aggregation, quizzes,
  document search/list.
- The whole **AI/RAG layer** (embeddings, retrieval, grounded answers, confidence,
  the Assistant `/ask` endpoint) — intentionally deferred; keep generic/pluggable.
- `dashboard.py` is an empty placeholder.

**Out of scope (do NOT build unless explicitly asked):** live mid-procedure copilot,
multi-machine troubleshooting, voice, multilingual, document version control,
in-app doc editing, ERP/QMS/LMS integrations, OCR, native mobile/offline, advanced
quiz analytics, bulk user import.

---

## 10. Conventions (follow these to match existing code)

**Working style with this user (IMPORTANT):**
- The user is **learning to code** and wants to understand, not just receive code.
  For things they're actively coding (logic, backend handlers), **explain the
  concept and the bug, guide them to the fix — don't just hand over a rewrite**
  unless they ask. They often write code, then ask you to check it.
- For scaffolding they delegate (page UIs, CSS, infra/plumbing), it's fine to build
  directly. They explicitly asked you to build the page UIs and theming.
- When something is on the out-of-scope list, flag it and confirm before building.
- They like concise "what was done in N bullets" recaps — keep them factual.

**Frontend:**
- One folder per page under `Pages/`, PascalCase, with co-located `.jsx` + `.css`.
- CSS class names are **prefixed per page** (`dash-`, `asst-`, `um-`, `tm-`, etc.)
  to avoid collisions. Keep this up for new pages.
- Use **CSS variables from `theme.css`** (`--bg`, `--card`, `--text`, `--text-2`,
  `--border`, `--input-bg`, sidebar vars) so new UI works in dark mode. If you add
  a new page with hardcoded light colors, also add dark overrides in `theme.css`.
- API calls live in `src/api/api.jsx` as **named exports**. Components import them
  as `import { fn } from '../../api/api.jsx'`.
- Components must `return` their JSX; only one root element (use `<>…</>` to group).

**Backend:**
- See Section 6 gotchas. New routes file → import it in `app.py`.
- Return proper status codes (200/201 success, 400 bad input, 401 auth, 404 missing).

---

## 11. Memory files (persistent context)

Stored at `~/.claude/projects/-Users-rayyan-Prebuilt-MVP/memory/`:
- `project_overview.md` — what the product is
- `mvp_scope.md` — in/out of scope
- `data_model.md` — tables incl. the teams extension + access-resolution rule
- `screens_required.md` — the screen list + roles

Keep these updated when the data model or scope changes.

---

## 12. Recommended next steps (in order)

1. **Store the uploaded file** — add Supabase Storage (or local disk) in
   `documents.py`; save the path so the source-citation link can open it later.
2. **Document list/search backend** — `GET /documents` (filtered by the caller's
   team access); wire Document Search + Document Management table to it.
3. **User Management backend** — `GET/POST/PATCH /users` (admin creates users,
   bcrypt-hash passwords, assign role + team). Replace `MOCK_USERS`.
4. **Teams + Access Control backend** — CRUD for teams, `team_group_access`,
   `user_team_access`. Replace mocks on Team Management + Access Control.
5. **Dashboard backend** — aggregate `query_log` (top questions, low-confidence,
   gaps); fill in `dashboard.py`; replace dashboard mocks. CSV export.
6. **Quiz backend** — generate/store/publish quizzes, record attempts/scores.
7. **AI/RAG layer LAST** — embeddings + pgvector retrieval + grounded answer with
   citation + confidence; `/ask` endpoint; wire the Assistant page. Keep the model
   provider behind a thin, swappable interface.

When wiring any mock page to the backend: replace the `MOCK_*` constant with
`useState([])` + a `useEffect` that fetches from Flask with the
`Authorization: Bearer <token>` header.

---

## 13. Quick-start checklist for the new session

- [ ] Read this file top to bottom.
- [ ] `cd backend && source venv/bin/activate && python app.py` — confirm it serves.
- [ ] `cd frontend && npm install && npm run dev` — open `localhost:5173`.
- [ ] Log in as `admin` and as `operator` — confirm role-based sidebar + redirects.
- [ ] Toggle dark/light — confirm it persists on reload.
- [ ] Skim the memory files (Section 11).
- [ ] Pick up at Section 12, step 1 (or whatever the user asks).

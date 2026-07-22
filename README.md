# PadelPath 🎾

Your personal padel improvement coach. PadelPath asks about your goals, current
level, target level and weaknesses, then builds a personalised weekly training
plan across four areas: **Game Play**, **Strengthening**, **Recovery** and
**Diet**. Login is required, and each user's plan and progress are stored
per-account on the backend so they sync across devices.

## Features

- **Accounts** — register / log in. Passwords are hashed with bcrypt on the
  server; sessions use JWTs. Each user's data is isolated per account.
- **Onboarding assessment** — goal, current vs target level, availability,
  weaknesses, injuries and nutrition preferences.
- **Personalised plan engine** — targets your selected weaknesses with specific
  drills, balances court vs strength sessions by goal, adapts strength work to
  injuries, and estimates weeks-to-goal.
- **Four sections** — drills per skill, padel-specific S&C, recovery protocols,
  and goal/preference-based nutrition.
- **Progress tracking** — tick off plan items, keep a daily streak; everything
  persists to the backend and syncs across devices.

## Project structure

```
.                 Frontend: React + Vite + TypeScript + Tailwind
├── src/          App source (pages, components, plan engine, API client)
└── server/       Backend: Express + SQLite + bcrypt + JWT
```

## Running locally

You need two processes: the backend API and the frontend dev server.

### 1. Backend

```bash
cd server
npm install
npm run dev        # starts the API on http://localhost:4000
```

For production, set a real secret first:

```bash
cp .env.example .env
# edit .env and set JWT_SECRET to a long random string:
#   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
npm start
```

### 2. Frontend

```bash
npm install
npm run dev        # starts Vite on http://localhost:5173
```

The Vite dev server proxies `/api` to the backend on port 4000, so no CORS
config is needed in development.

## Production build (single server)

The Express server will serve the built frontend if a `dist/` folder exists at
the repo root, so you can deploy everything as one unit:

```bash
npm run build              # builds the frontend into ./dist
cd server && npm start     # serves the API AND the frontend on port 4000
```

Then open http://localhost:4000.

## Configuration

**Backend** (`server/.env`):

| Variable        | Default                    | Purpose                                   |
| --------------- | -------------------------- | ----------------------------------------- |
| `JWT_SECRET`    | insecure dev fallback      | **Set in production.** Signs session JWTs. |
| `PORT`          | `4000`                     | API port.                                 |
| `DATABASE_PATH` | `server/data/padelpath.db` | SQLite file location.                     |

**Frontend** (build-time env):

| Variable       | Default        | Purpose                                                         |
| -------------- | -------------- | --------------------------------------------------------------- |
| `VITE_API_URL` | same-origin    | Set only if the backend is hosted on a different origin.        |

## Notes

- The database is SQLite for zero-setup deployment. Because the API keeps the
  data-access layer small (`server/src/db.js`), swapping to Postgres later is
  straightforward.
- To host frontend and backend separately, set `VITE_API_URL` to the backend's
  URL at build time and enable CORS for that origin (CORS is already enabled
  broadly for convenience — tighten it for production).

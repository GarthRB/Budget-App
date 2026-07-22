import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createUser,
  findUserByUsername,
  findUserById,
  getUserData,
  saveUserData,
  publicUser,
} from './db.js';
import { requireAuth, signToken } from './auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// --- Validation helpers ---
function validCredentials(username, password) {
  if (typeof username !== 'string' || username.trim().length < 3) {
    return 'Username must be at least 3 characters.';
  }
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
}

// --- Auth routes ---
app.post('/api/auth/register', async (req, res) => {
  const { username, displayName, password } = req.body ?? {};
  const err = validCredentials(username, password);
  if (err) return res.status(400).json({ error: err });

  const uname = username.trim().toLowerCase();
  if (findUserByUsername(uname)) {
    return res.status(409).json({ error: 'That username is already taken.' });
  }

  const passHash = await bcrypt.hash(password, 10);
  const user = createUser({
    username: uname,
    displayName: (displayName || '').trim() || uname,
    passHash,
  });
  const row = findUserById(user.id);
  return res.status(201).json({ token: signToken(user), user: publicUser(row) });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const row = findUserByUsername(username.trim().toLowerCase());
  if (!row) return res.status(401).json({ error: 'No account found with that username.' });

  const ok = await bcrypt.compare(password, row.pass_hash);
  if (!ok) return res.status(401).json({ error: 'Incorrect password.' });

  return res.json({ token: signToken({ id: row.id, username: row.username }), user: publicUser(row) });
});

app.get('/api/me', requireAuth, (req, res) => {
  const row = findUserById(req.userId);
  if (!row) return res.status(404).json({ error: 'User not found.' });
  return res.json({ user: publicUser(row) });
});

// --- Per-user training data ---
app.get('/api/data', requireAuth, (req, res) => {
  return res.json({ data: getUserData(req.userId) });
});

app.put('/api/data', requireAuth, (req, res) => {
  const { data } = req.body ?? {};
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid data payload.' });
  }
  saveUserData(req.userId, data);
  return res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// --- Serve the built frontend in production (single deployable unit) ---
const distDir = join(__dirname, '..', '..', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback for any non-API route.
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PadelPath API listening on http://localhost:${PORT}`);
});

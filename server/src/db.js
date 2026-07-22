import Database from 'better-sqlite3';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Database file location. Override with DATABASE_PATH in production so it can
// live on a persistent volume separate from the code.
const dataDir = process.env.DATABASE_PATH
  ? dirname(process.env.DATABASE_PATH)
  : join(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DATABASE_PATH || join(dataDir, 'padelpath.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Schema. user_data holds the whole UserData blob as JSON keyed by user — the
// app treats a user's training data as one document, so a JSON column keeps the
// server simple while the client owns the shape.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    display_name  TEXT NOT NULL,
    pass_hash     TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_data (
    user_id     INTEGER PRIMARY KEY,
    data        TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

const EMPTY_DATA = {
  profile: null,
  completedItems: {},
  sessionLog: [],
  streak: 0,
  lastActiveDate: null,
};

export function createUser({ username, displayName, passHash }) {
  const createdAt = new Date().toISOString();
  const info = db
    .prepare('INSERT INTO users (username, display_name, pass_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(username, displayName, passHash, createdAt);
  const id = info.lastInsertRowid;
  db.prepare('INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, ?)').run(
    id,
    JSON.stringify(EMPTY_DATA),
    createdAt,
  );
  return { id, username, displayName, createdAt };
}

export function findUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

export function findUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function getUserData(userId) {
  const row = db.prepare('SELECT data FROM user_data WHERE user_id = ?').get(userId);
  if (!row) return { ...EMPTY_DATA };
  try {
    return JSON.parse(row.data);
  } catch {
    return { ...EMPTY_DATA };
  }
}

export function saveUserData(userId, data) {
  const updatedAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  ).run(userId, JSON.stringify(data), updatedAt);
}

export function publicUser(row) {
  return {
    username: row.username,
    displayName: row.display_name,
    createdAt: row.created_at,
  };
}

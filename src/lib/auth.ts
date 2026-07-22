import { User, UserData } from '../types';

// NOTE: This is a client-side-only app with no backend, so auth and data live
// in localStorage. Passwords are hashed (not stored in plain text) and each
// user's training data is namespaced by username so accounts stay separate.
// This gives the "login required, data specific to each user" behaviour asked
// for. It is not a substitute for real server-side auth for sensitive data.

const USERS_KEY = 'padelpath-users';
const SESSION_KEY = 'padelpath-session';
const DATA_PREFIX = 'padelpath-data-';

// Lightweight, dependency-free hash. Good enough to avoid storing plaintext in
// a demo app; swap for a real backend + bcrypt for production.
export function hashPassword(password: string): string {
  let h1 = 0xdeadbeef ^ password.length;
  let h2 = 0x41c6ce57 ^ password.length;
  for (let i = 0; i < password.length; i++) {
    const ch = password.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: User;
}

export function register(username: string, displayName: string, password: string): AuthResult {
  const uname = username.trim().toLowerCase();
  if (uname.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
  if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
  const users = loadUsers();
  if (users.some((u) => u.username === uname)) {
    return { ok: false, error: 'That username is already taken.' };
  }
  const user: User = {
    username: uname,
    displayName: displayName.trim() || uname,
    passHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, uname);
  return { ok: true, user };
}

export function login(username: string, password: string): AuthResult {
  const uname = username.trim().toLowerCase();
  const users = loadUsers();
  const user = users.find((u) => u.username === uname);
  if (!user) return { ok: false, error: 'No account found with that username.' };
  if (user.passHash !== hashPassword(password)) {
    return { ok: false, error: 'Incorrect password.' };
  }
  localStorage.setItem(SESSION_KEY, uname);
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function currentUser(): User | null {
  const uname = localStorage.getItem(SESSION_KEY);
  if (!uname) return null;
  return loadUsers().find((u) => u.username === uname) ?? null;
}

const emptyData: UserData = {
  profile: null,
  completedItems: {},
  sessionLog: [],
  streak: 0,
  lastActiveDate: null,
};

export function loadUserData(username: string): UserData {
  try {
    const raw = localStorage.getItem(DATA_PREFIX + username);
    if (raw) return { ...emptyData, ...(JSON.parse(raw) as UserData) };
  } catch {
    /* ignore */
  }
  return { ...emptyData };
}

export function saveUserData(username: string, data: UserData) {
  localStorage.setItem(DATA_PREFIX + username, JSON.stringify(data));
}

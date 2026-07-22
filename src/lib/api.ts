import { User, UserData } from '../types';

// Base URL for the API. Empty string means same-origin (works with the Vite
// dev proxy and when the Express server serves the built frontend). Set
// VITE_API_URL to point at a separately-hosted backend.
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

const TOKEN_KEY = 'padelpath-token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      /* non-JSON response */
    }
  }

  if (!res.ok) {
    const message = (body as { error?: string })?.error || `Request failed (${res.status}).`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const api = {
  async register(username: string, displayName: string, password: string): Promise<User> {
    const res = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, displayName, password }),
    });
    setToken(res.token);
    return res.user;
  },

  async login(username: string, password: string): Promise<User> {
    const res = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(res.token);
    return res.user;
  },

  async me(): Promise<User> {
    const res = await request<{ user: User }>('/api/me');
    return res.user;
  },

  async getData(): Promise<UserData> {
    const res = await request<{ data: UserData }>('/api/data');
    return res.data;
  },

  async saveData(data: UserData): Promise<void> {
    await request<{ ok: boolean }>('/api/data', {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  },
};

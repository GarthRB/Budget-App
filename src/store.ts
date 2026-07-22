import { useCallback, useEffect, useRef, useState } from 'react';
import { LoggedSession, Page, Profile, User, UserData } from './types';
import { ApiError, api, clearToken, getToken } from './lib/api';

const EMPTY_DATA: UserData = {
  profile: null,
  completedItems: {},
  sessionLog: [],
  streak: 0,
  lastActiveDate: null,
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(data: UserData): number {
  const today = todayStr();
  if (data.lastActiveDate === today) return data.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.lastActiveDate === yesterday) return data.streak; // alive, not yet bumped today
  if (data.lastActiveDate && data.lastActiveDate < yesterday) return 0; // broken
  return data.streak;
}

export function useApp() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<UserData>(EMPTY_DATA);
  const [page, setPage] = useState<Page>('dashboard');
  const [authError, setAuthError] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);

  // Debounced remote save. We keep the latest data in a ref so the timer always
  // flushes the freshest state, and only save once the user is authenticated.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<UserData>(data);
  const authedRef = useRef(false);

  const scheduleSave = useCallback((next: UserData) => {
    latestData.current = next;
    if (!authedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.saveData(latestData.current).catch(() => {
        /* transient save failure — next change will retry */
      });
    }, 600);
  }, []);

  // Update data locally and queue a remote save.
  const updateData = useCallback(
    (updater: (d: UserData) => UserData) => {
      setData((prev) => {
        const next = updater(prev);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  // On mount: if we have a token, restore the session.
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!getToken()) {
        setBooting(false);
        return;
      }
      try {
        const [u, d] = await Promise.all([api.me(), api.getData()]);
        if (cancelled) return;
        const withStreak = { ...d, streak: computeStreak(d) };
        setUser(u);
        setData(withStreak);
        latestData.current = withStreak;
        authedRef.current = true;
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) clearToken();
      } finally {
        if (!cancelled) setBooting(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const afterAuth = useCallback((u: User, d: UserData) => {
    const withStreak = { ...d, streak: computeStreak(d) };
    setUser(u);
    setData(withStreak);
    latestData.current = withStreak;
    authedRef.current = true;
    setPage('dashboard');
    setAuthError(null);
  }, []);

  const register = useCallback(
    async (username: string, displayName: string, password: string): Promise<boolean> => {
      setBusy(true);
      setAuthError(null);
      try {
        const u = await api.register(username, displayName, password);
        afterAuth(u, EMPTY_DATA);
        return true;
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : 'Could not create account.');
        return false;
      } finally {
        setBusy(false);
      }
    },
    [afterAuth],
  );

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setBusy(true);
      setAuthError(null);
      try {
        const u = await api.login(username, password);
        const d = await api.getData();
        afterAuth(u, d);
        return true;
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : 'Could not log in.');
        return false;
      } finally {
        setBusy(false);
      }
    },
    [afterAuth],
  );

  const logout = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    clearToken();
    authedRef.current = false;
    setUser(null);
    setData(EMPTY_DATA);
    latestData.current = EMPTY_DATA;
    setPage('dashboard');
  }, []);

  const saveProfile = useCallback(
    (profile: Profile) => {
      updateData((d) => ({ ...d, profile }));
      setPage('plan');
    },
    [updateData],
  );

  const resetProfile = useCallback(() => {
    updateData((d) => ({ ...d, profile: null, completedItems: {} }));
  }, [updateData]);

  const toggleItem = useCallback(
    (itemId: string) => {
      updateData((d) => {
        const completed = { ...d.completedItems };
        const today = todayStr();
        let streak = d.streak;
        let lastActiveDate = d.lastActiveDate;
        if (completed[itemId]) {
          delete completed[itemId];
        } else {
          completed[itemId] = today;
          if (d.lastActiveDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            streak = d.lastActiveDate === yesterday ? d.streak + 1 : 1;
            lastActiveDate = today;
          }
        }
        return { ...d, completedItems: completed, streak, lastActiveDate };
      });
    },
    [updateData],
  );

  const logSession = useCallback(
    (session: Omit<LoggedSession, 'id' | 'date'>) => {
      updateData((d) => {
        const entry: LoggedSession = { ...session, id: `${Date.now()}`, date: new Date().toISOString() };
        return { ...d, sessionLog: [entry, ...d.sessionLog].slice(0, 100) };
      });
    },
    [updateData],
  );

  const navigate = useCallback((p: Page) => setPage(p), []);
  const clearAuthError = useCallback(() => setAuthError(null), []);

  return {
    user,
    data,
    page,
    authError,
    booting,
    busy,
    register,
    login,
    logout,
    saveProfile,
    resetProfile,
    toggleItem,
    logSession,
    navigate,
    clearAuthError,
  };
}

export type AppApi = ReturnType<typeof useApp>;

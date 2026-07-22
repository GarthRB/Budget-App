import { useCallback, useEffect, useState } from 'react';
import { LoggedSession, Page, Profile, User, UserData } from './types';
import {
  currentUser,
  loadUserData,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  saveUserData,
} from './lib/auth';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(data: UserData): number {
  const today = todayStr();
  if (data.lastActiveDate === today) return data.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.lastActiveDate === yesterday) return data.streak; // still alive, not yet incremented today
  if (data.lastActiveDate && data.lastActiveDate < yesterday) return 0; // broken
  return data.streak;
}

export function useApp() {
  const [user, setUser] = useState<User | null>(() => currentUser());
  const [data, setData] = useState<UserData>(() => {
    const u = currentUser();
    return u ? loadUserData(u.username) : loadUserData('');
  });
  const [page, setPage] = useState<Page>('dashboard');
  const [authError, setAuthError] = useState<string | null>(null);

  // Persist whenever data changes and a user is logged in.
  useEffect(() => {
    if (user) saveUserData(user.username, data);
  }, [user, data]);

  const refreshStreak = useCallback(() => {
    setData((d) => ({ ...d, streak: computeStreak(d) }));
  }, []);

  useEffect(() => {
    if (user) refreshStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const register = useCallback((username: string, displayName: string, password: string) => {
    const res = authRegister(username, displayName, password);
    if (res.ok && res.user) {
      setUser(res.user);
      setData(loadUserData(res.user.username));
      setPage('dashboard');
      setAuthError(null);
    } else {
      setAuthError(res.error ?? 'Could not create account.');
    }
    return res.ok;
  }, []);

  const login = useCallback((username: string, password: string) => {
    const res = authLogin(username, password);
    if (res.ok && res.user) {
      setUser(res.user);
      setData(loadUserData(res.user.username));
      setPage('dashboard');
      setAuthError(null);
    } else {
      setAuthError(res.error ?? 'Could not log in.');
    }
    return res.ok;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setData(loadUserData(''));
    setPage('dashboard');
  }, []);

  const saveProfile = useCallback((profile: Profile) => {
    setData((d) => ({ ...d, profile }));
    setPage('plan');
  }, []);

  const resetProfile = useCallback(() => {
    setData((d) => ({ ...d, profile: null, completedItems: {} }));
  }, []);

  // Toggle a plan item as complete for today, maintaining the streak.
  const toggleItem = useCallback((itemId: string) => {
    setData((d) => {
      const completed = { ...d.completedItems };
      const today = todayStr();
      let streak = d.streak;
      let lastActiveDate = d.lastActiveDate;
      if (completed[itemId]) {
        delete completed[itemId];
      } else {
        completed[itemId] = today;
        // Bump streak the first time something is completed on a new day.
        if (d.lastActiveDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          streak = d.lastActiveDate === yesterday ? d.streak + 1 : 1;
          lastActiveDate = today;
        }
      }
      return { ...d, completedItems: completed, streak, lastActiveDate };
    });
  }, []);

  const logSession = useCallback((session: Omit<LoggedSession, 'id' | 'date'>) => {
    setData((d) => {
      const entry: LoggedSession = {
        ...session,
        id: `${Date.now()}`,
        date: new Date().toISOString(),
      };
      return { ...d, sessionLog: [entry, ...d.sessionLog].slice(0, 100) };
    });
  }, []);

  const navigate = useCallback((p: Page) => setPage(p), []);
  const clearAuthError = useCallback(() => setAuthError(null), []);

  return {
    user,
    data,
    page,
    authError,
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

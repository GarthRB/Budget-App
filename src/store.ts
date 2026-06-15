import { useState, useEffect, useCallback } from 'react';
import { AppState, SalaryConfig, BudgetCategory, Debt, DebtPayment, DebtStrategy, MonthlyEntry, Achievement } from './types';
import { ACHIEVEMENT_DEFS, getLevelInfo } from './utils/gamification';

const STORAGE_KEY = 'budget-quest-state';

const defaultAchievements: Achievement[] = ACHIEVEMENT_DEFS.map(a => ({ ...a }));

const defaultState: AppState = {
  salary: null,
  categories: [],
  monthlyEntries: [],
  monthRecords: [],
  debts: [],
  debtStrategy: 'avalanche',
  xp: 0,
  level: 1,
  achievements: defaultAchievements,
  streak: 0,
  setupComplete: false,
  currentPage: 'dashboard',
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      const existingIds = new Set(parsed.achievements.map((a: Achievement) => a.id));
      const merged = [...parsed.achievements, ...defaultAchievements.filter(a => !existingIds.has(a.id))];
      return { ...defaultState, ...parsed, achievements: merged };
    }
  } catch { /* ignore */ }
  return { ...defaultState };
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);
  const [xpToast, setXpToast] = useState<{ amount: number; id: number } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const navigate = useCallback((page: string) => {
    setState(s => ({ ...s, currentPage: page }));
  }, []);

  const earnXP = useCallback((amount: number) => {
    setXpToast({ amount, id: Date.now() });
    setState(s => {
      const newXP = s.xp + amount;
      const { level } = getLevelInfo(newXP);
      return { ...s, xp: newXP, level };
    });
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setState(s => {
      const already = s.achievements.find(a => a.id === id);
      if (already?.unlockedAt) return s;
      return {
        ...s,
        achievements: s.achievements.map(a =>
          a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
        ),
      };
    });
  }, []);

  const setSalary = useCallback((salary: SalaryConfig) => {
    const isFirstTime = !state.setupComplete;
    setState(s => ({ ...s, salary, setupComplete: true, currentPage: 'budget' }));
    if (isFirstTime) {
      earnXP(100);
      unlockAchievement('first_steps');
    }
  }, [state.setupComplete, earnXP, unlockAchievement]);

  const setCategories = useCallback((categories: BudgetCategory[]) => {
    setState(s => ({ ...s, categories }));
  }, []);

  const addDebt = useCallback((debt: Debt) => {
    setState(s => ({ ...s, debts: [...s.debts, debt] }));
    earnXP(25);
  }, [earnXP]);

  const removeDebt = useCallback((id: string) => {
    setState(s => ({ ...s, debts: s.debts.filter(d => d.id !== id) }));
  }, []);

  const addDebtPayment = useCallback((debtId: string, payment: DebtPayment, newBalance: number) => {
    const willPayOff = newBalance <= 0;
    setState(s => {
      const debts = s.debts.map(d => {
        if (d.id !== debtId) return d;
        return { ...d, balance: Math.max(0, newBalance), payments: [...d.payments, payment] };
      });
      return { ...s, debts };
    });
    earnXP(50);
    unlockAchievement('debt_destroyer');
    if (willPayOff) {
      unlockAchievement('snowball_effect');
    }
  }, [earnXP, unlockAchievement]);

  const setDebtStrategy = useCallback((strategy: DebtStrategy) => {
    setState(s => ({ ...s, debtStrategy: strategy }));
  }, []);

  const setMonthlyEntry = useCallback((entry: MonthlyEntry) => {
    setState(s => {
      const existing = s.monthlyEntries.findIndex(e => e.month === entry.month && e.categoryId === entry.categoryId);
      if (existing >= 0) {
        const updated = [...s.monthlyEntries];
        updated[existing] = entry;
        return { ...s, monthlyEntries: updated };
      }
      return { ...s, monthlyEntries: [...s.monthlyEntries, entry] };
    });
  }, []);

  const completeMonth = useCallback((month: string, allGreen: boolean) => {
    const currentStreak = state.streak;
    setState(s => {
      const existing = s.monthRecords.find(r => r.month === month);
      if (existing?.completed) return s;
      const record = { month, completed: true, completedAt: new Date().toISOString() };
      const records = existing
        ? s.monthRecords.map(r => r.month === month ? record : r)
        : [...s.monthRecords, record];
      return { ...s, monthRecords: records, streak: s.streak + 1 };
    });
    earnXP(200);
    if (allGreen) {
      earnXP(150);
      unlockAchievement('green_machine');
    }
    if (currentStreak + 1 >= 3) {
      unlockAchievement('streak_master');
    }
  }, [earnXP, unlockAchievement, state.streak]);

  const dismissToast = useCallback(() => setXpToast(null), []);

  return {
    state,
    xpToast,
    dismissToast,
    navigate,
    earnXP,
    unlockAchievement,
    setSalary,
    setCategories,
    addDebt,
    removeDebt,
    addDebtPayment,
    setDebtStrategy,
    setMonthlyEntry,
    completeMonth,
  };
}

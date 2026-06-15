export type SalaryInputMode = 'gross' | 'net';
export type SalaryPeriod = 'monthly' | 'yearly';

export interface SalaryConfig {
  grossAmount: number;
  period: SalaryPeriod;
  inputMode: SalaryInputMode;
  netMonthly: number;
  taxAmount: number;
  niAmount: number;
}

export type BudgetCategoryType = 'needs' | 'wants' | 'savings';

export interface BudgetCategory {
  id: string;
  name: string;
  type: BudgetCategoryType;
  budgetedAmount: number;
  emoji: string;
}

export interface MonthlyEntry {
  id: string;
  month: string;
  categoryId: string;
  actualSpent: number;
}

export interface MonthRecord {
  month: string;
  completed: boolean;
  completedAt?: string;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  payments: DebtPayment[];
}

export interface DebtPayment {
  id: string;
  date: string;
  amount: number;
}

export type DebtStrategy = 'avalanche' | 'snowball';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

export interface AppState {
  salary: SalaryConfig | null;
  categories: BudgetCategory[];
  monthlyEntries: MonthlyEntry[];
  monthRecords: MonthRecord[];
  debts: Debt[];
  debtStrategy: DebtStrategy;
  xp: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  setupComplete: boolean;
  currentPage: string;
}

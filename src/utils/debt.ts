import { Debt, DebtStrategy } from '../types';

export function getSortedDebts(debts: Debt[], strategy: DebtStrategy): Debt[] {
  const copy = [...debts];
  if (strategy === 'avalanche') {
    copy.sort((a, b) => b.interestRate - a.interestRate);
  } else {
    copy.sort((a, b) => a.balance - b.balance);
  }
  return copy;
}

export function estimatePayoffMonths(balance: number, interestRate: number, monthlyPayment: number): number {
  if (monthlyPayment <= 0) return Infinity;
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return Math.ceil(balance / monthlyPayment);
  if (monthlyPayment <= balance * monthlyRate) return Infinity;
  const months = Math.log(monthlyPayment / (monthlyPayment - balance * monthlyRate)) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
}

export function getTotalDebt(debts: Debt[]): number {
  return debts.reduce((sum, d) => sum + d.balance, 0);
}

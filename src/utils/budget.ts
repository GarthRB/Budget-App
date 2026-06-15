import { BudgetCategory, BudgetCategoryType } from '../types';

export function getDefaultCategories(netMonthly: number): BudgetCategory[] {
  const needs = netMonthly * 0.50;
  const wants = netMonthly * 0.30;
  const savings = netMonthly * 0.20;

  return [
    { id: 'rent', name: 'Rent', type: 'needs' as BudgetCategoryType, budgetedAmount: Math.round(needs * 0.5), emoji: '🏠' },
    { id: 'utilities', name: 'Utilities', type: 'needs' as BudgetCategoryType, budgetedAmount: Math.round(needs * 0.15), emoji: '💡' },
    { id: 'groceries', name: 'Groceries', type: 'needs' as BudgetCategoryType, budgetedAmount: Math.round(needs * 0.25), emoji: '🛒' },
    { id: 'transport', name: 'Transport', type: 'needs' as BudgetCategoryType, budgetedAmount: Math.round(needs * 0.10), emoji: '🚗' },
    { id: 'entertainment', name: 'Entertainment', type: 'wants' as BudgetCategoryType, budgetedAmount: Math.round(wants * 0.30), emoji: '🎬' },
    { id: 'dining', name: 'Dining Out', type: 'wants' as BudgetCategoryType, budgetedAmount: Math.round(wants * 0.35), emoji: '🍽️' },
    { id: 'subscriptions', name: 'Subscriptions', type: 'wants' as BudgetCategoryType, budgetedAmount: Math.round(wants * 0.20), emoji: '📱' },
    { id: 'hobbies', name: 'Hobbies', type: 'wants' as BudgetCategoryType, budgetedAmount: Math.round(wants * 0.15), emoji: '🎯' },
    { id: 'emergency', name: 'Emergency Fund', type: 'savings' as BudgetCategoryType, budgetedAmount: Math.round(savings * 0.50), emoji: '🛡️' },
    { id: 'investments', name: 'Investments', type: 'savings' as BudgetCategoryType, budgetedAmount: Math.round(savings * 0.50), emoji: '📈' },
  ];
}

export function getTotalByType(categories: BudgetCategory[], type: BudgetCategoryType): number {
  return categories.filter(c => c.type === type).reduce((sum, c) => sum + c.budgetedAmount, 0);
}

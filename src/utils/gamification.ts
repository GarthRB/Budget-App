export const LEVELS = [
  { min: 0, title: 'Broke Beginner', color: 'text-gray-400' },
  { min: 500, title: 'Budget Apprentice', color: 'text-green-400' },
  { min: 1500, title: 'Money Manager', color: 'text-blue-400' },
  { min: 3000, title: 'Wealth Builder', color: 'text-purple-400' },
  { min: 6000, title: 'Financial Master', color: 'text-yellow-400' },
  { min: 10000, title: 'Money Legend', color: 'text-orange-400' },
];

export function getLevelInfo(xp: number) {
  let levelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) { levelIndex = i; break; }
  }
  const current = LEVELS[levelIndex];
  const next = LEVELS[levelIndex + 1];
  const progressXP = xp - current.min;
  const rangeXP = next ? next.min - current.min : 1000;
  const progress = next ? Math.min(progressXP / rangeXP, 1) : 1;
  return { level: levelIndex + 1, title: current.title, color: current.color, progress, xpToNext: next ? next.min - xp : 0 };
}

export const ACHIEVEMENT_DEFS = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your budget setup', emoji: '🚀' },
  { id: 'debt_destroyer', name: 'Debt Destroyer', description: 'Make your first debt payment', emoji: '💥' },
  { id: 'green_machine', name: 'Green Machine', description: 'Stay under budget in ALL categories', emoji: '🟢' },
  { id: 'snowball_effect', name: 'Snowball Effect', description: 'Pay off your first debt completely', emoji: '⛄' },
  { id: 'streak_master', name: 'Streak Master', description: '3 months in a row under budget', emoji: '🔥' },
  { id: 'savings_sensei', name: 'Savings Sensei', description: 'Save 20%+ of income for 3 months', emoji: '🥋' },
];

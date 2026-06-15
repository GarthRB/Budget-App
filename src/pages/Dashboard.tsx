import { ProgressRing } from '../components/ProgressRing';
import { AchievementBadge } from '../components/AchievementBadge';
import { getLevelInfo } from '../utils/gamification';
import { AppState } from '../types';
import { getTotalDebt } from '../utils/debt';
import { Flame, TrendingDown, Target, Award } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onNavigate: (page: string) => void;
}

export function Dashboard({ state, onNavigate }: DashboardProps) {
  const { title, color, progress, xpToNext, level } = getLevelInfo(state.xp);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthEntries = state.monthlyEntries.filter(e => e.month === currentMonth);
  const totalBudget = state.categories.reduce((s, c) => s + c.budgetedAmount, 0);
  const totalSpent = monthEntries.reduce((s, e) => s + e.actualSpent, 0);
  const remaining = totalBudget - totalSpent;
  const totalDebt = getTotalDebt(state.debts);
  const recentAchievements = state.achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-800/50 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
        <ProgressRing progress={progress} size={140} strokeWidth={12} color="#8b5cf6">
          <div>
            <div className="text-2xl font-black text-white">{level}</div>
            <div className="text-xs text-purple-300">LEVEL</div>
          </div>
        </ProgressRing>
        <div className="flex-1">
          <div className={`text-2xl font-bold ${color}`}>{title}</div>
          <div className="text-gray-300 mt-1">{state.xp} XP total</div>
          {xpToNext > 0 && <div className="text-sm text-gray-400 mt-1">{xpToNext} XP to next level</div>}
          <div className="flex items-center gap-2 mt-4">
            <Flame className="text-orange-400" size={20} />
            <span className="text-white font-semibold">{state.streak} month streak</span>
          </div>
          {!state.setupComplete && (
            <button onClick={() => onNavigate('salary')} className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Get Started →
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-blue-400" size={18} />
            <span className="text-gray-400 text-sm font-medium">Monthly Budget</span>
          </div>
          <div className="text-2xl font-bold text-white">£{totalBudget.toFixed(0)}</div>
          <div className="text-sm text-gray-400 mt-1">Spent: £{totalSpent.toFixed(0)}</div>
          <div className={`text-sm font-medium mt-1 ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {remaining >= 0 ? `£${remaining.toFixed(0)} remaining` : `£${Math.abs(remaining).toFixed(0)} over`}
          </div>
          {totalBudget > 0 && (
            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${totalSpent / totalBudget > 1 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(totalSpent / totalBudget * 100, 100)}%` }} />
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="text-red-400" size={18} />
            <span className="text-gray-400 text-sm font-medium">Total Debt</span>
          </div>
          <div className="text-2xl font-bold text-white">£{totalDebt.toFixed(0)}</div>
          <div className="text-sm text-gray-400 mt-1">{state.debts.length} debt{state.debts.length !== 1 ? 's' : ''} tracked</div>
          <button onClick={() => onNavigate('debt')} className="mt-3 text-xs text-purple-400 hover:text-purple-300">
            {state.debts.length > 0 ? 'View debts →' : 'Add a debt →'}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-yellow-400" size={18} />
            <span className="text-gray-400 text-sm font-medium">Achievements</span>
          </div>
          <div className="text-2xl font-bold text-white">{state.achievements.filter(a => a.unlockedAt).length}/{state.achievements.length}</div>
          <div className="text-sm text-gray-400 mt-1">Unlocked</div>
          <button onClick={() => onNavigate('achievements')} className="mt-3 text-xs text-purple-400 hover:text-purple-300">View all →</button>
        </div>
      </div>

      {recentAchievements.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentAchievements.map(a => <AchievementBadge key={a.id} achievement={a} size="md" />)}
          </div>
        </div>
      )}

      {state.setupComplete && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('monthly')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Log Spending</button>
            <button onClick={() => onNavigate('debt')} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Record Debt Payment</button>
            <button onClick={() => onNavigate('budget')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Adjust Budget</button>
          </div>
        </div>
      )}
    </div>
  );
}

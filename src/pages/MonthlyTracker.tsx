import { useState } from 'react';
import { BudgetCategory, MonthlyEntry, MonthRecord } from '../types';
import { CheckCircle } from 'lucide-react';

interface MonthlyTrackerProps {
  categories: BudgetCategory[];
  monthlyEntries: MonthlyEntry[];
  monthRecords: MonthRecord[];
  onSetEntry: (entry: MonthlyEntry) => void;
  onCompleteMonth: (month: string, allGreen: boolean) => void;
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function MonthlyTracker({ categories, monthlyEntries, monthRecords, onSetEntry, onCompleteMonth }: MonthlyTrackerProps) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const monthEntries = monthlyEntries.filter(e => e.month === selectedMonth);
  const monthRecord = monthRecords.find(r => r.month === selectedMonth);
  const isCompleted = monthRecord?.completed ?? false;

  const getEntry = (catId: string) => monthEntries.find(e => e.categoryId === catId);

  const setSpent = (cat: BudgetCategory, value: string) => {
    const entry: MonthlyEntry = {
      id: getEntry(cat.id)?.id ?? Date.now().toString(),
      month: selectedMonth,
      categoryId: cat.id,
      actualSpent: parseFloat(value) || 0,
    };
    onSetEntry(entry);
  };

  const totalBudget = categories.reduce((s, c) => s + c.budgetedAmount, 0);
  const totalSpent = monthEntries.reduce((s, e) => s + e.actualSpent, 0);

  const allGreen = categories.every(cat => {
    const spent = getEntry(cat.id)?.actualSpent ?? 0;
    return spent <= cat.budgetedAmount;
  });

  const getStatusColor = (budgeted: number, spent: number) => {
    if (spent === 0) return 'text-gray-400';
    const ratio = spent / budgeted;
    if (ratio <= 0.9) return 'text-green-400';
    if (ratio <= 1.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBorderColor = (budgeted: number, spent: number) => {
    if (spent === 0) return 'border-gray-800';
    const ratio = spent / budgeted;
    if (ratio <= 0.9) return 'border-green-800/50';
    if (ratio <= 1.0) return 'border-yellow-800/50';
    return 'border-red-800/50';
  };

  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Monthly Tracker</h1>
          <p className="text-gray-400 mt-1">Log your actual spending</p>
        </div>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500">
          {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400">Total Budget</div>
          <div className="text-xl font-bold text-white">£{totalBudget.toFixed(0)}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400">Total Spent</div>
          <div className="text-xl font-bold text-white">£{totalSpent.toFixed(0)}</div>
        </div>
        <div className={`rounded-xl p-4 border ${totalBudget - totalSpent >= 0 ? 'bg-green-900/20 border-green-800/50' : 'bg-red-900/20 border-red-800/50'}`}>
          <div className="text-xs text-gray-400">Remaining</div>
          <div className={`text-xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-400' : 'text-red-400'}`}>£{(totalBudget - totalSpent).toFixed(0)}</div>
        </div>
      </div>
      {isCompleted && (
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20} />
          <div>
            <div className="text-green-300 font-medium">Month Completed!</div>
            <div className="text-xs text-gray-400">Completed on {new Date(monthRecord!.completedAt!).toLocaleDateString()}</div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {categories.map(cat => {
          const entry = getEntry(cat.id);
          const spent = entry?.actualSpent ?? 0;
          const diff = cat.budgetedAmount - spent;
          const statusColor = getStatusColor(cat.budgetedAmount, spent);
          const borderColor = getBorderColor(cat.budgetedAmount, spent);
          const pct = cat.budgetedAmount > 0 ? Math.min(spent / cat.budgetedAmount, 1) : 0;
          return (
            <div key={cat.id} className={`bg-gray-900 border rounded-xl p-4 ${borderColor}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-white">{cat.name}</div>
                  <div className="text-xs text-gray-400">{cat.type} · Budget: £{cat.budgetedAmount.toFixed(0)}</div>
                </div>
                <div className={`font-bold ${statusColor}`}>{diff >= 0 ? `£${diff.toFixed(0)} left` : `£${Math.abs(diff).toFixed(0)} over`}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                  <input type="number" value={spent || ''} onChange={e => setSpent(cat, e.target.value)} placeholder="0" disabled={isCompleted}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                </div>
                <div className="text-xs text-gray-400 w-16 text-right">of £{cat.budgetedAmount.toFixed(0)}</div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${pct < 0.9 ? 'bg-green-500' : pct < 1 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {!isCompleted && categories.length > 0 && (
        <button onClick={() => onCompleteMonth(selectedMonth, allGreen)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
          <CheckCircle size={16} /> Complete Month (+200 XP{allGreen ? ' +150 XP bonus' : ''})
        </button>
      )}
    </div>
  );
}

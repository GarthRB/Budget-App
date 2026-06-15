import { useState } from 'react';
import { BudgetCategory, BudgetCategoryType } from '../types';
import { getDefaultCategories, getTotalByType } from '../utils/budget';
import { Plus, Trash2 } from 'lucide-react';

interface BudgetAllocationProps {
  netMonthly: number;
  categories: BudgetCategory[];
  onSetCategories: (cats: BudgetCategory[]) => void;
}

const typeColors: Record<BudgetCategoryType, string> = {
  needs: 'bg-blue-900/50 text-blue-300 border-blue-700',
  wants: 'bg-orange-900/50 text-orange-300 border-orange-700',
  savings: 'bg-green-900/50 text-green-300 border-green-700',
};

const typeLabels: Record<BudgetCategoryType, string> = {
  needs: '🏠 Needs (50%)',
  wants: '🎉 Wants (30%)',
  savings: '💰 Savings (20%)',
};

export function BudgetAllocation({ netMonthly, categories, onSetCategories }: BudgetAllocationProps) {
  const [cats, setCats] = useState<BudgetCategory[]>(() =>
    categories.length > 0 ? categories : getDefaultCategories(netMonthly)
  );
  const [newCat, setNewCat] = useState({ name: '', type: 'needs' as BudgetCategoryType, emoji: '📦', amount: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalAllocated = cats.reduce((s, c) => s + c.budgetedAmount, 0);
  const remaining = netMonthly - totalAllocated;

  const updateAmount = (id: string, value: string) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, budgetedAmount: parseFloat(value) || 0 } : c));
  };

  const removeCat = (id: string) => {
    setCats(prev => prev.filter(c => c.id !== id));
  };

  const addCat = () => {
    if (!newCat.name || !newCat.amount) return;
    const cat: BudgetCategory = {
      id: Date.now().toString(),
      name: newCat.name,
      type: newCat.type,
      emoji: newCat.emoji,
      budgetedAmount: parseFloat(newCat.amount) || 0,
    };
    setCats(prev => [...prev, cat]);
    setNewCat({ name: '', type: 'needs', emoji: '📦', amount: '' });
    setShowAdd(false);
  };

  const handleSave = () => {
    onSetCategories(cats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const applyDefault = () => { setCats(getDefaultCategories(netMonthly)); };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Budget Allocation</h1>
          <p className="text-gray-400 mt-1">Allocate your monthly take-home income</p>
        </div>
        <button onClick={applyDefault} className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800 px-3 py-1.5 rounded-lg">Reset to 50/30/20</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400">Monthly Income</div>
          <div className="text-xl font-bold text-white">£{netMonthly.toFixed(0)}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400">Allocated</div>
          <div className="text-xl font-bold text-purple-400">£{totalAllocated.toFixed(0)}</div>
        </div>
        <div className={`rounded-xl p-4 border ${remaining >= 0 ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
          <div className="text-xs text-gray-400">Remaining</div>
          <div className={`text-xl font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>£{remaining.toFixed(0)}</div>
        </div>
      </div>
      {(['needs', 'wants', 'savings'] as BudgetCategoryType[]).map(type => {
        const typeCats = cats.filter(c => c.type === type);
        const typeTotal = getTotalByType(cats, type);
        const typePct = netMonthly > 0 ? (typeTotal / netMonthly * 100) : 0;
        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white">{typeLabels[type]}</h2>
              <span className="text-sm text-gray-400">£{typeTotal.toFixed(0)} ({typePct.toFixed(0)}%)</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${type === 'needs' ? 'bg-blue-500' : type === 'wants' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(typePct, 100)}%` }} />
            </div>
            <div className="space-y-2">
              {typeCats.map(cat => (
                <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="flex-1 text-white font-medium">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[cat.type]}`}>{cat.type}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                    <input type="number" value={cat.budgetedAmount} onChange={e => updateAmount(cat.id, e.target.value)}
                      className="w-28 bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                  <button onClick={() => removeCat(cat.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {showAdd ? (
        <div className="bg-gray-900 border border-purple-800 rounded-xl p-4 space-y-3">
          <h3 className="font-medium text-white">New Category</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            <input placeholder="Emoji" value={newCat.emoji} onChange={e => setNewCat(p => ({ ...p, emoji: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            <select value={newCat.type} onChange={e => setNewCat(p => ({ ...p, type: e.target.value as BudgetCategoryType }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500">
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="savings">Savings</option>
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
              <input type="number" placeholder="Amount" value={newCat.amount} onChange={e => setNewCat(p => ({ ...p, amount: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addCat} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full border border-dashed border-gray-700 hover:border-purple-600 text-gray-400 hover:text-purple-400 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
          <Plus size={16} /> Add Category
        </button>
      )}
      <button onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">
        {saved ? '✓ Budget Saved!' : 'Save Budget Allocation'}
      </button>
    </div>
  );
}

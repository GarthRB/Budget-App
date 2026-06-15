import { useState } from 'react';
import { Debt, DebtPayment, DebtStrategy } from '../types';
import { getSortedDebts, estimatePayoffMonths, getTotalDebt } from '../utils/debt';
import { Plus, Trash2, CreditCard } from 'lucide-react';

interface DebtTrackerProps {
  debts: Debt[];
  strategy: DebtStrategy;
  onAddDebt: (debt: Debt) => void;
  onRemoveDebt: (id: string) => void;
  onAddPayment: (debtId: string, payment: DebtPayment, newBalance: number) => void;
  onSetStrategy: (s: DebtStrategy) => void;
}

export function DebtTracker({ debts, strategy, onAddDebt, onRemoveDebt, onAddPayment, onSetStrategy }: DebtTrackerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ name: '', balance: '', interestRate: '', minimumPayment: '' });

  const sorted = getSortedDebts(debts, strategy);
  const total = getTotalDebt(debts);

  const handleAdd = () => {
    if (!form.name || !form.balance) return;
    const debt: Debt = {
      id: Date.now().toString(),
      name: form.name,
      balance: parseFloat(form.balance) || 0,
      interestRate: parseFloat(form.interestRate) || 0,
      minimumPayment: parseFloat(form.minimumPayment) || 0,
      payments: [],
    };
    onAddDebt(debt);
    setForm({ name: '', balance: '', interestRate: '', minimumPayment: '' });
    setShowAdd(false);
  };

  const handlePayment = (debt: Debt) => {
    const amount = parseFloat(payAmount);
    if (!amount) return;
    const payment: DebtPayment = { id: Date.now().toString(), date: new Date().toISOString().slice(0, 10), amount };
    onAddPayment(debt.id, payment, debt.balance - amount);
    setPayingId(null);
    setPayAmount('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Debt Tracker</h1>
        <p className="text-gray-400 mt-1">Track and eliminate your debts strategically</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4">
          <div className="text-xs text-gray-400">Total Debt</div>
          <div className="text-2xl font-bold text-white">£{total.toFixed(0)}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Payoff Strategy</div>
          <div className="flex gap-2">
            {(['avalanche', 'snowball'] as DebtStrategy[]).map(s => (
              <button key={s} onClick={() => onSetStrategy(s)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-colors ${strategy === s ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'}`}>
                {s === 'avalanche' ? '🌊 Avalanche' : '⛄ Snowball'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{strategy === 'avalanche' ? 'Highest interest rate first' : 'Lowest balance first'}</p>
        </div>
      </div>
      <div className="space-y-4">
        {sorted.map((debt, index) => {
          const months = estimatePayoffMonths(debt.balance, debt.interestRate, debt.minimumPayment);
          return (
            <div key={debt.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">{index + 1}</div>
                  <div>
                    <div className="font-bold text-white">{debt.name}</div>
                    <div className="text-xs text-gray-400">{debt.interestRate}% APR</div>
                  </div>
                </div>
                <button onClick={() => onRemoveDebt(debt.id)} className="text-gray-600 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div><div className="text-gray-400 text-xs">Balance</div><div className="text-white font-semibold">£{debt.balance.toFixed(0)}</div></div>
                <div><div className="text-gray-400 text-xs">Min Payment</div><div className="text-white font-semibold">£{debt.minimumPayment.toFixed(0)}/mo</div></div>
                <div><div className="text-gray-400 text-xs">Est. Payoff</div><div className="text-white font-semibold">{months === Infinity ? '∞' : `${months} mo`}</div></div>
              </div>
              {debt.payments.length > 0 && (
                <div className="text-xs text-gray-400 mb-3">{debt.payments.length} payment{debt.payments.length !== 1 ? 's' : ''} made · Total: £{debt.payments.reduce((s, p) => s + p.amount, 0).toFixed(0)}</div>
              )}
              {payingId === debt.id ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                    <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="Amount"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                  <button onClick={() => handlePayment(debt)} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium">Pay</button>
                  <button onClick={() => setPayingId(null)} className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setPayingId(debt.id)}
                  className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-800 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium w-full flex items-center justify-center gap-2">
                  <CreditCard size={16} /> Make Payment
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showAdd ? (
        <div className="bg-gray-900 border border-purple-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-white">Add New Debt</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Debt name (e.g. Credit Card)" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            <input type="number" placeholder="Balance (£)" value={form.balance} onChange={e => setForm(p => ({ ...p, balance: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            <input type="number" placeholder="Interest Rate (%)" value={form.interestRate} onChange={e => setForm(p => ({ ...p, interestRate: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            <input type="number" placeholder="Min Payment (£/mo)" value={form.minimumPayment} onChange={e => setForm(p => ({ ...p, minimumPayment: e.target.value }))}
              className="col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Debt (+25 XP)</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full border border-dashed border-gray-700 hover:border-purple-600 text-gray-400 hover:text-purple-400 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
          <Plus size={16} /> Add Debt
        </button>
      )}
    </div>
  );
}

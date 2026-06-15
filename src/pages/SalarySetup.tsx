import { useState } from 'react';
import { SalaryConfig, SalaryInputMode, SalaryPeriod } from '../types';
import { calculateUKTax } from '../utils/tax';
import { Info } from 'lucide-react';

interface SalarySetupProps {
  current: SalaryConfig | null;
  onSave: (config: SalaryConfig) => void;
}

export function SalarySetup({ current, onSave }: SalarySetupProps) {
  const [inputMode, setInputMode] = useState<SalaryInputMode>(current?.inputMode ?? 'gross');
  const [period, setPeriod] = useState<SalaryPeriod>(current?.period ?? 'yearly');
  const [amount, setAmount] = useState<string>(current ? String(
    current.inputMode === 'gross'
      ? (current.period === 'yearly' ? current.grossAmount : current.grossAmount / 12)
      : current.netMonthly
  ) : '');
  const [saved, setSaved] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const grossYearly = inputMode === 'gross' ? (period === 'yearly' ? numAmount : numAmount * 12) : 0;
  const { tax, ni, netYearly } = inputMode === 'gross' ? calculateUKTax(grossYearly) : { tax: 0, ni: 0, netYearly: 0 };
  const netMonthly = inputMode === 'gross' ? netYearly / 12 : (period === 'monthly' ? numAmount : numAmount / 12);

  const handleSave = () => {
    if (!numAmount) return;
    const config: SalaryConfig = {
      grossAmount: inputMode === 'gross' ? grossYearly : 0,
      period,
      inputMode,
      netMonthly,
      taxAmount: tax / 12,
      niAmount: ni / 12,
    };
    onSave(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Salary Setup</h1>
        <p className="text-gray-400 mt-1">Configure your income to start budgeting</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Calculation Method</label>
          <div className="flex gap-2">
            {(['gross', 'net'] as SalaryInputMode[]).map(mode => (
              <button key={mode} onClick={() => setInputMode(mode)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${inputMode === mode ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                {mode === 'gross' ? '🇬🇧 Calculate Tax & NI (UK)' : '✏️ Enter Take-Home Manually'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Period</label>
          <div className="flex gap-2">
            {(['monthly', 'yearly'] as SalaryPeriod[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${period === p ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">
            {inputMode === 'gross' ? 'Gross' : 'Take-Home'} {period === 'monthly' ? 'Monthly' : 'Yearly'} Income (£)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">£</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
        </div>
        {inputMode === 'gross' && numAmount > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Info size={16} className="text-blue-400" />
              UK Tax Breakdown (Annual)
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Gross Income</span><span className="text-white font-medium">£{grossYearly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Income Tax</span><span className="text-red-400">-£{tax.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">National Insurance</span><span className="text-red-400">-£{ni.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span></div>
              <div className="border-t border-gray-700 pt-2 flex justify-between"><span className="text-gray-300 font-medium">Net Yearly</span><span className="text-green-400 font-bold">£{netYearly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span></div>
            </div>
          </div>
        )}
        {numAmount > 0 && (
          <div className="bg-purple-900/30 border border-purple-800/50 rounded-xl p-4">
            <div className="text-sm text-purple-300">Monthly Take-Home Pay</div>
            <div className="text-3xl font-bold text-white mt-1">£{netMonthly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
            <div className="text-xs text-gray-400 mt-1">This will be used for your budget allocation</div>
          </div>
        )}
        <button onClick={handleSave} disabled={!numAmount}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all">
          {saved ? '✓ Saved! Redirecting...' : 'Save & Continue to Budget →'}
        </button>
      </div>
    </div>
  );
}

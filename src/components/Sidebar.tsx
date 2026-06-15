import { LayoutDashboard, DollarSign, PieChart, CreditCard, Calendar, Trophy } from 'lucide-react';
import { getLevelInfo } from '../utils/gamification';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  xp: number;
  level: number;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'salary', label: 'Salary Setup', icon: DollarSign },
  { id: 'budget', label: 'Budget Allocation', icon: PieChart },
  { id: 'debt', label: 'Debt Tracker', icon: CreditCard },
  { id: 'monthly', label: 'Monthly Tracker', icon: Calendar },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

export function Sidebar({ currentPage, onNavigate, xp, level }: SidebarProps) {
  const { title, color, progress } = getLevelInfo(xp);

  return (
    <div className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          💰 Budget Quest
        </h1>
        <p className="text-xs text-gray-400 mt-1">Level up your finances</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-bold ${color}`}>Lv.{level} {title}</span>
            <span className="text-xs text-gray-400">{xp} XP</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

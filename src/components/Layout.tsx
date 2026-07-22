import { ReactNode } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Swords,
  Dumbbell,
  HeartPulse,
  Apple,
  User as UserIcon,
  LogOut,
  Flame,
} from 'lucide-react';
import { Page, User } from '../types';

const NAV: { id: Page; label: string; icon: ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'plan', label: 'My Plan', icon: <ClipboardList size={20} /> },
  { id: 'gameplay', label: 'Game Play', icon: <Swords size={20} /> },
  { id: 'strength', label: 'Strengthening', icon: <Dumbbell size={20} /> },
  { id: 'recovery', label: 'Recovery', icon: <HeartPulse size={20} /> },
  { id: 'diet', label: 'Diet', icon: <Apple size={20} /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
];

export function Layout({
  children,
  page,
  onNavigate,
  user,
  streak,
  onLogout,
}: {
  children: ReactNode;
  page: Page;
  onNavigate: (p: Page) => void;
  user: User;
  streak: number;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-900/50 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-6">
          <span className="text-2xl">🎾</span>
          <div>
            <div className="font-bold text-white leading-tight">PadelPath</div>
            <div className="text-xs text-slate-500">Train with purpose</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                page === n.id
                  ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {n.icon}
              {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-4 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 px-2 mb-3 text-sm">
            <Flame size={16} className="text-orange-400" />
            <span className="text-slate-300">{streak} day streak</span>
          </div>
          <div className="px-2 text-sm text-slate-300 mb-2 truncate">{user.displayName}</div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎾</span>
            <span className="font-bold text-white">PadelPath</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-slate-300">
              <Flame size={15} className="text-orange-400" />
              {streak}
            </span>
            <button onClick={onLogout} className="text-slate-400">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto pb-24 md:pb-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 flex justify-around py-1.5 z-10">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={`flex flex-col items-center gap-0.5 px-1 py-1 text-[10px] ${
                page === n.id ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {n.icon}
              <span className="truncate max-w-[52px]">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

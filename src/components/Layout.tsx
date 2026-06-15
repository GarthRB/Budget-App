import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { XPToast } from './XPToast';

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  xp: number;
  level: number;
  xpToast: { amount: number; id: number } | null;
  onDismissToast: () => void;
  children: ReactNode;
}

export function Layout({ currentPage, onNavigate, xp, level, xpToast, onDismissToast, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} xp={xp} level={level} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
      {xpToast && <XPToast key={xpToast.id} amount={xpToast.amount} onDismiss={onDismissToast} />}
    </div>
  );
}

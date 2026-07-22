import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-slate-900/70 border border-slate-800 p-5 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {icon && <span className="text-emerald-400">{icon}</span>}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'court' | 'strength' | 'recovery' | 'diet' }) {
  const tones: Record<string, string> = {
    default: 'bg-slate-800 text-slate-300',
    court: 'bg-emerald-500/15 text-emerald-300',
    strength: 'bg-orange-500/15 text-orange-300',
    recovery: 'bg-sky-500/15 text-sky-300',
    diet: 'bg-lime-500/15 text-lime-300',
  };
  return <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${tones[tone]}`}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold',
    ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    danger: 'bg-red-500/90 hover:bg-red-500 text-white',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

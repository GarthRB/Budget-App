import { useState } from 'react';
import { Button } from '../components/ui';

export function Auth({
  onLogin,
  onRegister,
  error,
  clearError,
}: {
  onLogin: (username: string, password: string) => boolean;
  onRegister: (username: string, displayName: string, password: string) => boolean;
  error: string | null;
  clearError: () => void;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'login') onLogin(username, password);
    else onRegister(username, displayName, password);
  }

  function switchMode(m: 'login' | 'register') {
    setMode(m);
    clearError();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🎾</div>
          <h1 className="text-3xl font-bold text-white">PadelPath</h1>
          <p className="text-slate-400 mt-1">Your personal padel improvement coach</p>
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6">
          <div className="flex gap-2 mb-6 bg-slate-800/60 p-1 rounded-xl">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Username">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                placeholder="your handle"
              />
            </Field>

            {mode === 'register' && (
              <Field label="Display name">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="What should we call you?"
                />
              </Field>
            )}

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
            </Field>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full">
              {mode === 'login' ? 'Log in' : 'Create my account'}
            </Button>
          </form>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Your account and training data are stored privately in this browser.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

import { useApp } from './store';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { PlanView } from './pages/PlanView';
import { GamePlay } from './pages/GamePlay';
import { Strength } from './pages/Strength';
import { Recovery } from './pages/Recovery';
import { Diet } from './pages/Diet';
import { Profile } from './pages/Profile';

export function App() {
  const app = useApp();

  // 0. Restoring session from a stored token.
  if (app.booting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <div className="text-4xl animate-pulse">🎾</div>
        <p>Loading PadelPath…</p>
      </div>
    );
  }

  // 1. Not logged in -> auth gate (login required).
  if (!app.user) {
    return (
      <Auth
        onLogin={app.login}
        onRegister={app.register}
        error={app.authError}
        busy={app.busy}
        clearError={app.clearAuthError}
      />
    );
  }

  // 2. Logged in but no profile yet -> onboarding questionnaire.
  if (!app.data.profile) {
    return <Onboarding onComplete={app.saveProfile} displayName={app.user.displayName} />;
  }

  const user = app.user;

  // 3. Full app.
  function renderPage() {
    switch (app.page) {
      case 'plan':
        return <PlanView data={app.data} onToggle={app.toggleItem} onRebuild={app.resetProfile} />;
      case 'gameplay':
        return <GamePlay data={app.data} />;
      case 'strength':
        return <Strength data={app.data} />;
      case 'recovery':
        return <Recovery />;
      case 'diet':
        return <Diet data={app.data} />;
      case 'profile':
        return <Profile user={user} data={app.data} onRebuild={app.resetProfile} onLogout={app.logout} />;
      default:
        return <Dashboard data={app.data} displayName={user.displayName} onNavigate={app.navigate} />;
    }
  }

  return (
    <Layout page={app.page} onNavigate={app.navigate} user={user} streak={app.data.streak} onLogout={app.logout}>
      {renderPage()}
    </Layout>
  );
}

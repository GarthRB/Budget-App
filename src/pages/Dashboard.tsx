import { Flame, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Page, UserData } from '../types';
import { LEVEL_LABELS } from '../types';
import { GOAL_LABELS } from '../data/onboarding';
import { generatePlan } from '../lib/plan';
import { Card, PageHeader, Pill, ProgressBar, Button } from '../components/ui';

export function Dashboard({
  data,
  displayName,
  onNavigate,
}: {
  data: UserData;
  displayName: string;
  onNavigate: (p: Page) => void;
}) {
  const profile = data.profile!;
  const plan = generatePlan(profile);

  // Count completed plan items across all sessions.
  const allItemIds = new Set<string>();
  plan.days.forEach((d) => d.items.forEach((i) => allItemIds.add(i.id)));
  const completedCount = Array.from(allItemIds).filter((id) => data.completedItems[id]).length;
  const totalCount = allItemIds.size;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const levelGap = profile.targetLevel - profile.currentLevel;
  const levelProgressPct = Math.round((profile.currentLevel / profile.targetLevel) * 100);

  return (
    <div>
      <PageHeader title={`Welcome back, ${displayName}`} subtitle="Here's your training snapshot." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Flame className="text-orange-400" />} label="Current streak" value={`${data.streak} day${data.streak === 1 ? '' : 's'}`} />
        <StatCard icon={<Target className="text-emerald-400" />} label="Goal" value={GOAL_LABELS[profile.goal]} small />
        <StatCard icon={<CheckCircle2 className="text-teal-400" />} label="Plan completed" value={`${pct}%`} />
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-emerald-400" />
          <h2 className="font-semibold text-white">Level progress</h2>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-300">
            {LEVEL_LABELS[profile.currentLevel]} <span className="text-slate-500">(now)</span>
          </span>
          <span className="text-emerald-400">
            {LEVEL_LABELS[profile.targetLevel]} <span className="text-slate-500">(goal)</span>
          </span>
        </div>
        <ProgressBar value={levelProgressPct} />
        <p className="text-sm text-slate-400 mt-3">
          {levelGap <= 0
            ? "You're at your target level — this block keeps you sharp and consistent."
            : `${levelGap} level${levelGap > 1 ? 's' : ''} to go. Estimated ${plan.weeksToGoal} weeks of consistent training.`}
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold text-white mb-2">This week's focus</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {plan.focusAreas.map((f) => (
            <Pill key={f} tone="court">
              {f}
            </Pill>
          ))}
        </div>
        <p className="text-sm text-slate-400 mb-4">{plan.summary}</p>
        <Button onClick={() => onNavigate('plan')}>Open my plan →</Button>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickLink title="Game Play" desc="Drills for your weak areas" onClick={() => onNavigate('gameplay')} emoji="🎾" />
        <QuickLink title="Strengthening" desc="Padel-specific S&C" onClick={() => onNavigate('strength')} emoji="🏋️" />
        <QuickLink title="Recovery" desc="Stay fresh and injury-free" onClick={() => onNavigate('recovery')} emoji="🧘" />
        <QuickLink title="Diet" desc="Fuel your training" onClick={() => onNavigate('diet')} emoji="🥗" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, small }: { icon: React.ReactNode; label: string; value: string; small?: boolean }) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
        {icon}
        {label}
      </div>
      <div className={`font-bold text-white ${small ? 'text-base leading-tight' : 'text-2xl'}`}>{value}</div>
    </Card>
  );
}

function QuickLink({ title, desc, onClick, emoji }: { title: string; desc: string; onClick: () => void; emoji: string }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl bg-slate-900/70 border border-slate-800 p-5 hover:border-emerald-500/50 transition-colors"
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="font-semibold text-white">{title}</div>
      <div className="text-sm text-slate-400">{desc}</div>
    </button>
  );
}

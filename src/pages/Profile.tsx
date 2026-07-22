import { LEVEL_LABELS, User, UserData } from '../types';
import { GOAL_LABELS, LIMITATIONS } from '../data/onboarding';
import { DIET_GOAL_LABELS, DIET_PREF_LABELS } from '../data/diet';
import { getSkill } from '../data/skills';
import { Button, Card, PageHeader } from '../components/ui';

export function Profile({
  user,
  data,
  onRebuild,
  onLogout,
}: {
  user: User;
  data: UserData;
  onRebuild: () => void;
  onLogout: () => void;
}) {
  const p = data.profile!;
  const injuryLabels = p.injuries
    .map((id) => LIMITATIONS.find((l) => l.id === id)?.label)
    .filter(Boolean)
    .join(', ');
  const weaknessLabels = p.weaknesses.map((id) => getSkill(id)?.name).filter(Boolean);

  return (
    <div>
      <PageHeader title="Profile" subtitle={`Signed in as ${user.username}`} />

      <Card className="mb-6">
        <div className="text-lg font-semibold text-white mb-4">{user.displayName}</div>
        <dl className="space-y-3">
          <Row label="Goal" value={GOAL_LABELS[p.goal]} />
          <Row label="Current level" value={LEVEL_LABELS[p.currentLevel]} />
          <Row label="Target level" value={LEVEL_LABELS[p.targetLevel]} />
          <Row label="Training" value={`${p.daysPerWeek} sessions/week · ${p.sessionMinutes} min`} />
          <Row label="Focus areas" value={weaknessLabels.length ? weaknessLabels.join(', ') : 'Fundamentals'} />
          <Row label="Limitations" value={injuryLabels || 'None'} />
          <Row label="Nutrition goal" value={DIET_GOAL_LABELS[p.dietGoal]} />
          <Row label="Diet preference" value={DIET_PREF_LABELS[p.dietPreference]} />
          <Row label="Bodyweight" value={p.bodyweightKg ? `${p.bodyweightKg} kg` : 'Not set'} />
        </dl>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold text-white mb-1">Update your plan</h2>
        <p className="text-sm text-slate-400 mb-4">
          Levelled up or changed your goals? Retake the assessment to rebuild your plan around where you are now.
        </p>
        <Button onClick={onRebuild}>Retake assessment</Button>
      </Card>

      <Card>
        <h2 className="font-semibold text-white mb-1">Account</h2>
        <p className="text-sm text-slate-400 mb-4">Member since {new Date(user.createdAt).toLocaleDateString()}.</p>
        <Button variant="danger" onClick={onLogout}>
          Log out
        </Button>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800 pb-2.5 last:border-0">
      <dt className="text-slate-400 text-sm">{label}</dt>
      <dd className="text-slate-200 text-sm text-right font-medium">{value}</dd>
    </div>
  );
}

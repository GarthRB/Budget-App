import { UserData } from '../types';
import {
  DIET_GOAL_LABELS,
  DIET_GOAL_TIPS,
  DIET_PREF_LABELS,
  GENERAL_DIET_TIPS,
  PROTEIN_SOURCES,
  proteinTarget,
} from '../data/diet';
import { Card, PageHeader, Pill } from '../components/ui';

export function Diet({ data }: { data: UserData }) {
  const profile = data.profile!;
  const goalTips = DIET_GOAL_TIPS[profile.dietGoal];
  const sources = PROTEIN_SOURCES[profile.dietPreference];

  return (
    <div>
      <PageHeader title="Diet" subtitle="Nutrition tuned to your goal and how you eat." />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Pill tone="diet">{DIET_GOAL_LABELS[profile.dietGoal]}</Pill>
          <Pill>{DIET_PREF_LABELS[profile.dietPreference]}</Pill>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-800/40 p-4">
            <div className="text-sm text-slate-400">Daily protein target</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {proteinTarget(profile.bodyweightKg, profile.dietGoal)}
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4">
            <div className="text-sm text-slate-400">Your protein sources</div>
            <div className="text-sm text-slate-200 mt-1">{sources.slice(0, 4).join(', ')}…</div>
          </div>
        </div>
      </Card>

      <h2 className="font-semibold text-white mb-3">For your goal: {DIET_GOAL_LABELS[profile.dietGoal]}</h2>
      <div className="space-y-3 mb-6">
        {goalTips.map((tip) => (
          <Card key={tip.id}>
            <div className="font-medium text-white mb-1">{tip.title}</div>
            <p className="text-sm text-slate-400">{tip.detail}</p>
          </Card>
        ))}
      </div>

      <h2 className="font-semibold text-white mb-3">Protein sources ({DIET_PREF_LABELS[profile.dietPreference]})</h2>
      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <Pill key={s} tone="diet">
              {s}
            </Pill>
          ))}
        </div>
      </Card>

      <h2 className="font-semibold text-white mb-3">Fuelling around play</h2>
      <div className="space-y-3">
        {GENERAL_DIET_TIPS.map((tip) => (
          <Card key={tip.id}>
            <div className="font-medium text-white mb-1">{tip.title}</div>
            <p className="text-sm text-slate-400">{tip.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

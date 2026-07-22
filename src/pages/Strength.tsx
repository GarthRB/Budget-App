import { AlertTriangle } from 'lucide-react';
import { StrengthExercise, UserData } from '../types';
import { STRENGTH_EXERCISES } from '../data/strength';
import { Card, PageHeader, Pill } from '../components/ui';

const GROUP_LABEL: Record<StrengthExercise['group'], string> = {
  lower: 'Lower body',
  upper: 'Upper body',
  core: 'Core',
  power: 'Power / explosive',
  mobility: 'Mobility',
};

const GROUP_ORDER: StrengthExercise['group'][] = ['power', 'lower', 'upper', 'core', 'mobility'];

export function Strength({ data }: { data: UserData }) {
  const injuries = (data.profile?.injuries ?? []).filter((i) => i !== 'none');
  const hasInjury = injuries.length > 0;

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: STRENGTH_EXERCISES.filter((ex) => ex.group === g),
  })).filter((row) => row.items.length > 0);

  return (
    <div>
      <PageHeader
        title="Strengthening"
        subtitle="Padel-specific strength & conditioning for a faster, more powerful, more durable game."
      />

      {hasInjury && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 mb-6 flex gap-3">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200">
            You flagged a limitation. High-impact / explosive work is de-emphasised in your generated plan. Exercises marked
            <span className="font-medium"> higher impact </span>
            below should be approached with care or skipped until pain-free.
          </div>
        </div>
      )}

      <div className="space-y-6">
        {grouped.map((row) => (
          <div key={row.group}>
            <h2 className="font-semibold text-white mb-3">{GROUP_LABEL[row.group]}</h2>
            <div className="space-y-3">
              {row.items.map((ex) => (
                <Card key={ex.id}>
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="font-medium text-white">{ex.name}</span>
                    <div className="flex items-center gap-2">
                      <Pill tone="strength">{ex.sets}</Pill>
                      {!ex.lowImpact && (
                        <span className="text-xs text-amber-400">higher impact</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{ex.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

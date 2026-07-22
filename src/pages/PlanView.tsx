import { CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { PlanItem, UserData } from '../types';
import { generatePlan } from '../lib/plan';
import { Card, PageHeader, Pill } from '../components/ui';

const KIND_TONE: Record<PlanItem['kind'], 'court' | 'strength' | 'recovery' | 'diet'> = {
  court: 'court',
  strength: 'strength',
  recovery: 'recovery',
  diet: 'diet',
};

const KIND_LABEL: Record<PlanItem['kind'], string> = {
  court: 'On court',
  strength: 'Strength',
  recovery: 'Recovery',
  diet: 'Diet',
};

export function PlanView({
  data,
  onToggle,
  onRebuild,
}: {
  data: UserData;
  onToggle: (id: string) => void;
  onRebuild: () => void;
}) {
  const profile = data.profile!;
  const plan = generatePlan(profile);

  return (
    <div>
      <PageHeader title="My weekly plan" subtitle={plan.summary} />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {plan.focusAreas.map((f) => (
          <Pill key={f} tone="court">
            {f}
          </Pill>
        ))}
        <button
          onClick={onRebuild}
          className="ml-auto flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400"
        >
          <RefreshCw size={14} /> Retake assessment
        </button>
      </div>

      <div className="space-y-5">
        {plan.days.map((day, idx) => {
          const done = day.items.filter((i) => data.completedItems[uniqueId(idx, i)]).length;
          return (
            <Card key={idx}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-white">{day.label}</h2>
                <span className="text-xs text-slate-500">
                  {done}/{day.items.length} done
                </span>
              </div>
              <p className="text-sm text-emerald-400 mb-4">{day.theme}</p>
              <ul className="space-y-2.5">
                {day.items.map((item) => {
                  const id = uniqueId(idx, item);
                  const checked = Boolean(data.completedItems[id]);
                  return (
                    <li key={id}>
                      <button
                        onClick={() => onToggle(id)}
                        className={`w-full text-left flex gap-3 rounded-xl border p-3 transition-colors ${
                          checked ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
                        }`}
                      >
                        <span className="pt-0.5 shrink-0">
                          {checked ? (
                            <CheckCircle2 size={20} className="text-emerald-400" />
                          ) : (
                            <Circle size={20} className="text-slate-600" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium ${checked ? 'text-slate-400 line-through' : 'text-white'}`}>
                              {item.title}
                            </span>
                            <Pill tone={KIND_TONE[item.kind]}>{KIND_LABEL[item.kind]}</Pill>
                            {item.meta && <span className="text-xs text-slate-500">{item.meta}</span>}
                          </span>
                          <span className="block text-sm text-slate-400 mt-0.5">{item.detail}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Items can repeat across sessions (e.g. diet, recovery), so namespace the
// completion id by day index to make each occurrence independently tickable.
function uniqueId(dayIdx: number, item: PlanItem): string {
  return `d${dayIdx}-${item.id}`;
}

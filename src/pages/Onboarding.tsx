import { useState } from 'react';
import { DietGoal, DietPreference, GoalId, LEVEL_LABELS, Profile, SkillLevel } from '../types';
import { GOALS, LIMITATIONS } from '../data/onboarding';
import { SKILL_AREAS } from '../data/skills';
import { DIET_GOAL_LABELS, DIET_PREF_LABELS } from '../data/diet';
import { Button, ProgressBar } from '../components/ui';

const TOTAL_STEPS = 7;

export function Onboarding({ onComplete, displayName }: { onComplete: (p: Profile) => void; displayName: string }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [currentLevel, setCurrentLevel] = useState<SkillLevel | null>(null);
  const [targetLevel, setTargetLevel] = useState<SkillLevel | null>(null);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [sessionMinutes, setSessionMinutes] = useState(60);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [injuries, setInjuries] = useState<string[]>(['none']);
  const [dietGoal, setDietGoal] = useState<DietGoal>('fuel_performance');
  const [dietPreference, setDietPreference] = useState<DietPreference>('no_restriction');
  const [bodyweight, setBodyweight] = useState('');

  function toggleWeakness(id: string) {
    setWeaknesses((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }

  function toggleInjury(id: string) {
    if (id === 'none') {
      setInjuries(['none']);
      return;
    }
    setInjuries((inj) => {
      const without = inj.filter((x) => x !== 'none');
      return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
    });
  }

  const canNext = (() => {
    switch (step) {
      case 0:
        return goal !== null;
      case 1:
        return currentLevel !== null;
      case 2:
        return targetLevel !== null;
      case 3:
        return daysPerWeek >= 1;
      case 4:
        return true; // weaknesses optional but encouraged
      case 5:
        return injuries.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  })();

  function finish() {
    if (goal === null || currentLevel === null || targetLevel === null) return;
    const profile: Profile = {
      goal,
      currentLevel,
      targetLevel,
      daysPerWeek,
      sessionMinutes,
      weaknesses,
      injuries,
      dietPreference,
      dietGoal,
      bodyweightKg: bodyweight ? Number(bodyweight) : null,
      completedAt: new Date().toISOString(),
    };
    onComplete(profile);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-emerald-400">{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
          </div>
          <ProgressBar value={((step + 1) / TOTAL_STEPS) * 100} />
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 min-h-[360px]">
          {step === 0 && (
            <Step title={`Welcome, ${displayName}! What's your main goal?`} hint="This shapes how we balance your plan.">
              <div className="grid gap-3">
                {GOALS.map((g) => (
                  <SelectCard key={g.id} selected={goal === g.id} onClick={() => setGoal(g.id)}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <div className="font-medium text-white">{g.label}</div>
                        <div className="text-sm text-slate-400">{g.blurb}</div>
                      </div>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="What's your current level?" hint="Be honest — the plan is built around where you are now.">
              <LevelPicker value={currentLevel} onChange={setCurrentLevel} />
            </Step>
          )}

          {step === 2 && (
            <Step title="What level do you want to reach?" hint="Your target level sets the size of the challenge ahead.">
              <LevelPicker value={targetLevel} onChange={setTargetLevel} minLevel={currentLevel ?? 1} />
              {currentLevel && targetLevel && targetLevel < currentLevel && (
                <p className="text-sm text-amber-400 mt-3">Your target is below your current level — pick your current level or higher.</p>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step title="How much can you train?" hint="We'll fit the plan to your real availability.">
              <div className="space-y-6">
                <SliderRow
                  label="Sessions per week"
                  value={daysPerWeek}
                  min={1}
                  max={6}
                  onChange={setDaysPerWeek}
                  suffix={daysPerWeek === 1 ? 'day' : 'days'}
                />
                <SliderRow
                  label="Minutes per session"
                  value={sessionMinutes}
                  min={30}
                  max={120}
                  step={15}
                  onChange={setSessionMinutes}
                  suffix="min"
                />
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title="Where are your weaknesses?" hint="Select all that apply — these become the focus of your plan.">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {SKILL_AREAS.map((s) => (
                  <SelectCard key={s.id} selected={weaknesses.includes(s.id)} onClick={() => toggleWeakness(s.id)} compact>
                    <div className="font-medium text-white text-sm">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.short}</div>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Any injuries or limitations?" hint="We'll keep your strength work safe and appropriate.">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {LIMITATIONS.map((l) => (
                  <SelectCard key={l.id} selected={injuries.includes(l.id)} onClick={() => toggleInjury(l.id)} compact>
                    <div className="font-medium text-white text-sm">{l.label}</div>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 6 && (
            <Step title="Nutrition preferences" hint="So your Diet plan matches how you eat and what you're after.">
              <div className="space-y-5">
                <div>
                  <span className="text-sm text-slate-400 mb-2 block">Nutrition goal</span>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {(Object.keys(DIET_GOAL_LABELS) as DietGoal[]).map((g) => (
                      <SelectCard key={g} selected={dietGoal === g} onClick={() => setDietGoal(g)} compact>
                        <div className="font-medium text-white text-sm">{DIET_GOAL_LABELS[g]}</div>
                      </SelectCard>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-slate-400 mb-2 block">Dietary preference</span>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {(Object.keys(DIET_PREF_LABELS) as DietPreference[]).map((p) => (
                      <SelectCard key={p} selected={dietPreference === p} onClick={() => setDietPreference(p)} compact>
                        <div className="font-medium text-white text-sm">{DIET_PREF_LABELS[p]}</div>
                      </SelectCard>
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="text-sm text-slate-400 mb-1.5 block">Bodyweight (kg) — optional, for protein targets</span>
                  <input
                    type="number"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                    className="w-40 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 78"
                  />
                </label>
              </div>
            </Step>
          )}
        </div>

        <div className="flex justify-between mt-5">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < TOTAL_STEPS - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext || (step === 2 && !!currentLevel && !!targetLevel && targetLevel < currentLevel)}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={finish}>Build my plan →</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      {hint && <p className="text-slate-400 text-sm mb-5">{hint}</p>}
      {children}
    </div>
  );
}

function SelectCard({
  selected,
  onClick,
  children,
  compact,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border transition-colors ${compact ? 'p-3' : 'p-4'} ${
        selected
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
      }`}
    >
      {children}
    </button>
  );
}

function LevelPicker({
  value,
  onChange,
  minLevel = 1,
}: {
  value: SkillLevel | null;
  onChange: (l: SkillLevel) => void;
  minLevel?: number;
}) {
  const descriptions: Record<SkillLevel, string> = {
    1: 'New to padel; learning the rules and basic contact.',
    2: 'Can rally and serve, working on consistency and walls.',
    3: 'Solid rallies, using the walls, learning bandeja & positioning.',
    4: 'Strong all-round game, tactical play, reliable overheads.',
    5: 'Tournament-level; refining high-level tactics and weapons.',
  };
  return (
    <div className="space-y-2.5">
      {([1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => {
        const disabled = lvl < minLevel;
        return (
          <button
            key={lvl}
            disabled={disabled}
            onClick={() => onChange(lvl)}
            className={`w-full text-left rounded-xl border p-3.5 transition-colors ${
              value === lvl
                ? 'border-emerald-500 bg-emerald-500/10'
                : disabled
                ? 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
                : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-slate-700 text-white text-sm flex items-center justify-center font-semibold shrink-0">
                {lvl}
              </span>
              <div>
                <div className="font-medium text-white">{LEVEL_LABELS[lvl]}</div>
                <div className="text-sm text-slate-400">{descriptions[lvl]}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-slate-300">{label}</span>
        <span className="text-emerald-400 font-semibold">
          {value} {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
    </div>
  );
}

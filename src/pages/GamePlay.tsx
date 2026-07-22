import { useState } from 'react';
import { Star } from 'lucide-react';
import { SkillArea, UserData } from '../types';
import { SKILL_AREAS } from '../data/skills';
import { Card, PageHeader, Pill } from '../components/ui';

const CATEGORY_LABEL: Record<SkillArea['category'], string> = {
  attack: 'Attack',
  defense: 'Defense',
  serve: 'Serve & return',
  movement: 'Movement',
  tactics: 'Tactics',
};

export function GamePlay({ data }: { data: UserData }) {
  const weaknesses = new Set(data.profile?.weaknesses ?? []);
  const [filter, setFilter] = useState<'focus' | 'all'>(weaknesses.size ? 'focus' : 'all');

  const skills = filter === 'focus' && weaknesses.size ? SKILL_AREAS.filter((s) => weaknesses.has(s.id)) : SKILL_AREAS;

  return (
    <div>
      <PageHeader
        title="Game Play"
        subtitle="Technical drills to sharpen every part of your padel. Your focus areas are starred."
      />

      <div className="flex gap-2 mb-6 bg-slate-800/60 p-1 rounded-xl w-fit">
        <FilterTab active={filter === 'focus'} onClick={() => setFilter('focus')} disabled={!weaknesses.size}>
          My focus areas
        </FilterTab>
        <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>
          All skills
        </FilterTab>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} isFocus={weaknesses.has(skill.id)} categoryLabel={CATEGORY_LABEL[skill.category]} />
        ))}
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
        active ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function SkillCard({ skill, isFocus, categoryLabel }: { skill: SkillArea; isFocus: boolean; categoryLabel: string }) {
  const [open, setOpen] = useState(isFocus);
  return (
    <Card className={isFocus ? 'border-emerald-500/40' : ''}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {isFocus && <Star size={16} className="text-emerald-400 fill-emerald-400" />}
              <h2 className="font-semibold text-white">{skill.name}</h2>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{skill.short}</p>
          </div>
          <Pill>{categoryLabel}</Pill>
        </div>
      </button>

      {open && (
        <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
          {skill.drills.map((drill) => (
            <div key={drill.name} className="rounded-xl bg-slate-800/40 p-3.5">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <span className="font-medium text-white">{drill.name}</span>
                <span className="text-xs text-emerald-300">
                  {drill.focus} · {drill.reps}
                </span>
              </div>
              <p className="text-sm text-slate-400">{drill.detail}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

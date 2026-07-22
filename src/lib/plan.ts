import { PlanDay, PlanItem, Profile, WeeklyPlan } from '../types';
import { getSkill, SKILL_AREAS } from '../data/skills';
import { STRENGTH_EXERCISES } from '../data/strength';
import { RECOVERY_PROTOCOLS } from '../data/recovery';
import { DIET_GOAL_LABELS, proteinTarget } from '../data/diet';

// Maps an onboarding injury id to the muscle groups we should de-emphasise.
const INJURY_AVOID: Record<string, ('lower' | 'upper' | 'core' | 'power' | 'mobility')[]> = {
  knee: ['power'],
  ankle: ['power'],
  shoulder: [],
  back: ['power'],
  elbow: [],
};

function hasInjuries(profile: Profile): boolean {
  return profile.injuries.some((i) => i !== 'none');
}

// Choose strength exercises appropriate to the user, prioritising low-impact
// work when injuries are present.
function pickStrength(profile: Profile, count: number): PlanItem[] {
  const injured = hasInjuries(profile);
  const avoidGroups = new Set<string>();
  profile.injuries.forEach((inj) => (INJURY_AVOID[inj] ?? []).forEach((g) => avoidGroups.add(g)));

  const pool = STRENGTH_EXERCISES.filter((ex) => {
    if (avoidGroups.has(ex.group)) return false;
    if (injured && !ex.lowImpact) return false;
    return true;
  });

  // Ensure a spread across groups: one lower, one upper, one core, then fill.
  const wantOrder = ['lower', 'upper', 'core', 'power', 'mobility'];
  const chosen: typeof STRENGTH_EXERCISES = [];
  for (const g of wantOrder) {
    const pick = pool.find((ex) => ex.group === g && !chosen.includes(ex));
    if (pick) chosen.push(pick);
    if (chosen.length >= count) break;
  }
  for (const ex of pool) {
    if (chosen.length >= count) break;
    if (!chosen.includes(ex)) chosen.push(ex);
  }

  return chosen.slice(0, count).map((ex) => ({
    id: `str-${ex.id}`,
    title: ex.name,
    detail: ex.detail,
    kind: 'strength' as const,
    meta: ex.sets,
  }));
}

// Build court drills targeting the user's selected weaknesses (falling back to
// fundamentals if none were chosen).
function pickCourtDrills(profile: Profile): { skillId: string; item: PlanItem }[] {
  const weakness = profile.weaknesses.length
    ? profile.weaknesses
    : ['serve', 'volley', 'positioning'];
  const out: { skillId: string; item: PlanItem }[] = [];
  weakness.forEach((wid) => {
    const skill = getSkill(wid);
    if (!skill) return;
    // Take the most relevant drill (first) for the weekly plan.
    const drill = skill.drills[0];
    out.push({
      skillId: wid,
      item: {
        id: `court-${wid}`,
        title: `${skill.name}: ${drill.name}`,
        detail: drill.detail,
        kind: 'court',
        meta: `${drill.focus} · ${drill.reps}`,
      },
    });
  });
  return out;
}

function dietItem(profile: Profile): PlanItem {
  return {
    id: 'diet-daily',
    title: `Nutrition focus: ${DIET_GOAL_LABELS[profile.dietGoal]}`,
    detail: `Hit your protein target of ${proteinTarget(profile.bodyweightKg, profile.dietGoal)} and time carbohydrates around your court sessions. See the Diet tab for your full plan.`,
    kind: 'diet',
    meta: 'Every day',
  };
}

// Estimate how many weeks of consistent training to close the level gap.
function estimateWeeks(profile: Profile): number {
  const gap = Math.max(0, profile.targetLevel - profile.currentLevel);
  if (gap === 0) return 8; // maintenance / sharpening block
  // Roughly 10-14 weeks per level, faster if training more often.
  const perLevel = profile.daysPerWeek >= 4 ? 10 : profile.daysPerWeek >= 2 ? 12 : 16;
  return gap * perLevel;
}

export function generatePlan(profile: Profile): WeeklyPlan {
  const days = Math.max(1, Math.min(7, profile.daysPerWeek));
  const courtDrills = pickCourtDrills(profile);
  const recovery = RECOVERY_PROTOCOLS.find((r) => r.id === 'post_match')!;
  const mobility = RECOVERY_PROTOCOLS.find((r) => r.id === 'mobility_flow')!;

  const recoveryItem: PlanItem = {
    id: 'rec-cooldown',
    title: recovery.name,
    detail: recovery.detail,
    kind: 'recovery',
    meta: recovery.duration,
  };
  const mobilityItem: PlanItem = {
    id: 'rec-mobility',
    title: mobility.name,
    detail: mobility.detail,
    kind: 'recovery',
    meta: mobility.duration,
  };

  const diet = dietItem(profile);

  // Decide how many court vs strength sessions based on goal + days available.
  // Fitness-focused users get more strength; competitors get more court time.
  let courtSessions: number;
  let strengthSessions: number;
  if (profile.goal === 'fitness') {
    strengthSessions = Math.max(1, Math.round(days / 2));
    courtSessions = days - strengthSessions;
  } else if (profile.goal === 'compete' || profile.goal === 'rank_up') {
    strengthSessions = days >= 4 ? 2 : 1;
    courtSessions = days - strengthSessions;
  } else {
    strengthSessions = days >= 3 ? 1 : 0;
    courtSessions = days - strengthSessions;
  }
  if (courtSessions < 1 && days >= 1) {
    courtSessions = 1;
    strengthSessions = days - 1;
  }

  const planDays: PlanDay[] = [];
  const drillCount = courtDrills.length;

  // Court sessions — rotate through the targeted weaknesses.
  for (let i = 0; i < courtSessions; i++) {
    // Give each court session up to 2 drills, rotating through the list.
    const sessionDrills: PlanItem[] = [];
    if (drillCount > 0) {
      sessionDrills.push(courtDrills[(i * 2) % drillCount].item);
      if (drillCount > 1) sessionDrills.push(courtDrills[(i * 2 + 1) % drillCount].item);
    }
    const themeSkills = sessionDrills
      .map((it) => getSkill(it.id.replace('court-', ''))?.name)
      .filter(Boolean)
      .join(' + ');
    planDays.push({
      label: `Session ${planDays.length + 1}`,
      theme: `On court · ${themeSkills || 'Match play'}`,
      items: [
        ...sessionDrills,
        {
          id: 'court-play',
          title: 'Match play',
          detail: 'Finish with 20-30 min of points, consciously applying the drills above under pressure.',
          kind: 'court',
          meta: '20-30 min',
        },
        recoveryItem,
        diet,
      ],
    });
  }

  // Strength sessions.
  for (let i = 0; i < strengthSessions; i++) {
    const exercises = pickStrength(profile, 5);
    planDays.push({
      label: `Session ${planDays.length + 1}`,
      theme: 'Strength & conditioning',
      items: [...exercises, mobilityItem, diet],
    });
  }

  const focusAreas = (profile.weaknesses.length ? profile.weaknesses : ['serve', 'volley', 'positioning'])
    .map((w) => getSkill(w)?.name)
    .filter((n): n is string => Boolean(n));

  const weeksToGoal = estimateWeeks(profile);

  const summary = buildSummary(profile, focusAreas, days, weeksToGoal);

  return { summary, focusAreas, days: planDays, weeksToGoal };
}

function buildSummary(profile: Profile, focusAreas: string[], days: number, weeks: number): string {
  const gap = profile.targetLevel - profile.currentLevel;
  const gapText =
    gap <= 0
      ? 'sharpen and maintain your current level'
      : `bridge the gap of ${gap} level${gap > 1 ? 's' : ''} to your target`;
  const focusText = focusAreas.slice(0, 3).join(', ');
  return `A ${days}-session week built to ${gapText}, focused on your weakest areas: ${focusText}. With consistent training this plan targets roughly ${weeks} weeks to reach your goal. Tick off items as you complete them to keep your streak alive.`;
}

// Expose all skills for the Game Play page in a sensible order.
export const ALL_SKILLS = SKILL_AREAS;

// ---- Core domain types for PadelPath ----

export type Page =
  | 'dashboard'
  | 'plan'
  | 'gameplay'
  | 'strength'
  | 'recovery'
  | 'diet'
  | 'profile';

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  1: 'Beginner',
  2: 'Improver',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Competitive',
};

export type GoalId =
  | 'social'
  | 'fitness'
  | 'compete'
  | 'rank_up';

export type DietPreference =
  | 'no_restriction'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian';

export type DietGoal =
  | 'lose_fat'
  | 'build_muscle'
  | 'maintain'
  | 'fuel_performance';

// A skill area used across game play + weakness selection
export interface SkillArea {
  id: string;
  name: string;
  category: 'attack' | 'defense' | 'serve' | 'movement' | 'tactics';
  short: string;
  drills: Drill[];
}

export interface Drill {
  name: string;
  focus: string;
  reps: string;
  detail: string;
}

export interface StrengthExercise {
  id: string;
  name: string;
  group: 'lower' | 'upper' | 'core' | 'power' | 'mobility';
  sets: string;
  detail: string;
  lowImpact: boolean;
}

export interface RecoveryProtocol {
  id: string;
  name: string;
  when: string;
  duration: string;
  detail: string;
  steps: string[];
}

export interface DietTip {
  id: string;
  title: string;
  detail: string;
}

// ---- User + profile ----

// The onboarding answers that define what the user is training for.
export interface Profile {
  goal: GoalId;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  daysPerWeek: number;
  sessionMinutes: number;
  weaknesses: string[]; // SkillArea ids
  injuries: string[];   // free-select limitation ids
  dietPreference: DietPreference;
  dietGoal: DietGoal;
  bodyweightKg: number | null;
  completedAt: string;
}

export interface User {
  username: string;
  displayName: string;
  createdAt: string;
}

// Progress tracking: which plan items the user has ticked, keyed by item id
export interface UserData {
  profile: Profile | null;
  completedItems: Record<string, string>; // itemId -> ISO date completed
  sessionLog: LoggedSession[];
  streak: number;
  lastActiveDate: string | null;
}

export interface LoggedSession {
  id: string;
  date: string;
  type: 'court' | 'strength' | 'recovery';
  note: string;
}

// ---- Generated plan ----

export interface PlanItem {
  id: string;
  title: string;
  detail: string;
  kind: 'court' | 'strength' | 'recovery' | 'diet';
  meta?: string;
}

export interface PlanDay {
  label: string;       // e.g. "Session 1"
  theme: string;       // e.g. "Attack + Power"
  items: PlanItem[];
}

export interface WeeklyPlan {
  summary: string;
  focusAreas: string[]; // human-readable weakness names being targeted
  days: PlanDay[];
  weeksToGoal: number;
}

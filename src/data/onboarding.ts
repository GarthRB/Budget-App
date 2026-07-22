import { GoalId } from '../types';

export const GOALS: { id: GoalId; label: string; blurb: string; icon: string }[] = [
  { id: 'social', label: 'Play socially & have fun', blurb: 'Enjoy the game, get more consistent, and hold your own in friendly matches.', icon: '🎉' },
  { id: 'fitness', label: 'Get fitter through padel', blurb: 'Use padel as your main way to improve fitness, movement and energy.', icon: '💪' },
  { id: 'compete', label: 'Compete in tournaments', blurb: 'Sharpen your game to enter and perform in local competitions.', icon: '🏆' },
  { id: 'rank_up', label: 'Move up a level / ranking', blurb: 'Break into the next category and beat players currently above you.', icon: '📈' },
];

export const GOAL_LABELS: Record<GoalId, string> = {
  social: 'Play socially & have fun',
  fitness: 'Get fitter through padel',
  compete: 'Compete in tournaments',
  rank_up: 'Move up a level / ranking',
};

// Common limitations that shift the plan toward low-impact work
export const LIMITATIONS: { id: string; label: string }[] = [
  { id: 'knee', label: 'Knee issues' },
  { id: 'ankle', label: 'Ankle / Achilles' },
  { id: 'shoulder', label: 'Shoulder' },
  { id: 'back', label: 'Lower back' },
  { id: 'elbow', label: 'Elbow / wrist' },
  { id: 'none', label: 'No injuries' },
];

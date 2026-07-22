import { DietGoal, DietPreference, DietTip } from '../types';

export const DIET_GOAL_LABELS: Record<DietGoal, string> = {
  lose_fat: 'Lose fat',
  build_muscle: 'Build muscle',
  maintain: 'Maintain & perform',
  fuel_performance: 'Fuel performance',
};

export const DIET_PREF_LABELS: Record<DietPreference, string> = {
  no_restriction: 'No restriction',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
};

// General nutrition tips shown to everyone
export const GENERAL_DIET_TIPS: DietTip[] = [
  {
    id: 'hydration',
    title: 'Hydrate around play',
    detail: 'Drink 400-600ml in the 2 hours before a match and sip 150-200ml every 15-20 min while playing. On hot days add electrolytes.',
  },
  {
    id: 'pre_match',
    title: 'Pre-match fuel',
    detail: 'Eat a carb-focused meal 2-3 hours before playing (e.g. oats, rice, pasta, fruit). Keep fat and fibre lower to avoid a heavy stomach.',
  },
  {
    id: 'post_match',
    title: 'Post-match refuel',
    detail: 'Within 45 minutes of finishing, combine ~20-30g protein with carbs to restock energy and start muscle repair.',
  },
  {
    id: 'protein_spread',
    title: 'Spread protein through the day',
    detail: 'Aim for 1.6-2.2g of protein per kg of bodyweight, split across 3-4 meals, to support recovery and strength gains.',
  },
];

// Goal-specific guidance
export const DIET_GOAL_TIPS: Record<DietGoal, DietTip[]> = {
  lose_fat: [
    { id: 'lf1', title: 'Small, steady deficit', detail: 'Aim for a modest 300-500 kcal daily deficit. Slower fat loss protects your energy for training and your muscle.' },
    { id: 'lf2', title: 'Protein stays high', detail: 'Keep protein at the top of your range (~2g/kg) to preserve muscle and stay full while eating less.' },
    { id: 'lf3', title: 'Volume foods', detail: 'Build meals around vegetables, lean protein and high-fibre carbs so you feel satisfied on fewer calories.' },
    { id: 'lf4', title: 'Fuel the hard days', detail: 'Do not diet hard on match days — eat closer to maintenance so performance and recovery hold up.' },
  ],
  build_muscle: [
    { id: 'bm1', title: 'Slight surplus', detail: 'Eat ~250-400 kcal above maintenance so you have material to build with, without excess fat gain.' },
    { id: 'bm2', title: 'Protein every meal', detail: 'Hit 1.8-2.2g/kg protein, with a serving at each meal and one before bed.' },
    { id: 'bm3', title: 'Carbs around lifting', detail: 'Prioritise carbs before and after strength sessions to train hard and recover.' },
    { id: 'bm4', title: 'Be patient', detail: 'Aim to gain ~0.25-0.5% bodyweight per week. Faster than that is mostly fat.' },
  ],
  maintain: [
    { id: 'mt1', title: 'Eat around maintenance', detail: 'Match intake to output. Weight staying stable over 2-3 weeks means you have it right.' },
    { id: 'mt2', title: 'Consistency over perfection', detail: 'Aim for a solid base of whole foods most of the time, with flexibility for social play and meals out.' },
    { id: 'mt3', title: 'Time carbs to sessions', detail: 'Put more of your carbs on training and match days for energy and recovery.' },
  ],
  fuel_performance: [
    { id: 'fp1', title: 'Carbs are your fuel', detail: 'Target 4-6g/kg of carbs on heavy training days — depleted glycogen means slow legs and poor decisions late in matches.' },
    { id: 'fp2', title: 'In-match energy', detail: 'For sessions over 60-75 min, take on 30-60g of carbs per hour (banana, sports drink, gel) to hold intensity.' },
    { id: 'fp3', title: 'Sleep & recovery nutrition', detail: 'A protein + carb snack before bed on hard days supports overnight recovery and next-day readiness.' },
    { id: 'fp4', title: 'Practise your race-day fuelling', detail: 'Trial your pre-match meal and in-match snacks in training so nothing is new on tournament day.' },
  ],
};

// Protein sources by dietary preference
export const PROTEIN_SOURCES: Record<DietPreference, string[]> = {
  no_restriction: ['Chicken & turkey', 'Lean beef', 'Eggs', 'Greek yoghurt', 'Fish', 'Whey or milk protein'],
  pescatarian: ['Salmon & white fish', 'Prawns & shellfish', 'Eggs', 'Greek yoghurt', 'Tofu & tempeh', 'Whey or milk protein'],
  vegetarian: ['Eggs', 'Greek yoghurt & cottage cheese', 'Tofu & tempeh', 'Lentils & beans', 'Edamame', 'Whey or pea protein'],
  vegan: ['Tofu & tempeh', 'Lentils, beans & chickpeas', 'Edamame', 'Seitan', 'Soy yoghurt', 'Pea or soy protein powder'],
};

// Simple protein target helper (grams/day) from bodyweight + goal
export function proteinTarget(bodyweightKg: number | null, goal: DietGoal): string {
  if (!bodyweightKg) return goal === 'build_muscle' ? '1.8-2.2 g/kg' : '1.6-2.0 g/kg';
  const low = goal === 'build_muscle' ? 1.8 : 1.6;
  const high = goal === 'build_muscle' ? 2.2 : 2.0;
  return `${Math.round(bodyweightKg * low)}-${Math.round(bodyweightKg * high)} g/day`;
}

import { RecoveryProtocol } from '../types';

export const RECOVERY_PROTOCOLS: RecoveryProtocol[] = [
  {
    id: 'post_match',
    name: 'Post-match cooldown',
    when: 'Immediately after playing',
    duration: '10-12 min',
    detail: 'Bring the heart rate down gradually and start the recovery process while you are still warm.',
    steps: [
      '3 min easy walk around the court to flush the legs',
      'Calf and Achilles stretch, 30s each side',
      'Standing quad and hip-flexor stretch, 30s each side',
      'Shoulder cross-body and triceps stretch, 30s each side',
      'Rehydrate and take on some protein + carbs within 45 minutes',
    ],
  },
  {
    id: 'mobility_flow',
    name: 'Daily mobility flow',
    when: 'Rest days / mornings',
    duration: '8-10 min',
    detail: 'Keep the joints healthy and reduce stiffness between sessions.',
    steps: [
      'Cat-cow x 8 to wake up the spine',
      "World's greatest stretch x 5 each side",
      '90/90 hip switches x 8 each way',
      'Band shoulder dislocates x 10',
      'Deep squat hold, 45s, gently rocking side to side',
    ],
  },
  {
    id: 'foam_roll',
    name: 'Foam-roll & release',
    when: 'Evening after hard sessions',
    duration: '10 min',
    detail: 'Reduce muscle tightness in the areas padel loads most heavily.',
    steps: [
      'Roll quads and IT band, 60s each leg',
      'Roll calves, 60s each leg',
      'Roll glutes with a ball, 60s each side',
      'Roll upper back / lats, 60s',
      'Gentle forearm release for grip fatigue, 45s each arm',
    ],
  },
  {
    id: 'sleep',
    name: 'Sleep & readiness',
    when: 'Every night',
    duration: 'Ongoing',
    detail: 'Sleep is the single biggest recovery lever for progressing your level.',
    steps: [
      'Aim for 7-9 hours consistently',
      'Screens off 30 min before bed',
      'Keep a regular sleep/wake time, even after late matches',
      'On heavy training days prioritise an extra 30-60 min',
    ],
  },
  {
    id: 'active_recovery',
    name: 'Active recovery',
    when: '1 day per week',
    duration: '20-30 min',
    detail: 'Light movement on off days speeds recovery more than complete rest.',
    steps: [
      'Easy 20-30 min walk, swim or cycle at a conversational pace',
      'Followed by 5 min of gentle full-body stretching',
      'Keep intensity genuinely low — this is not a workout',
    ],
  },
  {
    id: 'injury_care',
    name: 'Niggle management',
    when: 'When something is sore',
    duration: 'As needed',
    detail: 'Manage small niggles before they become injuries that stop you playing.',
    steps: [
      'Load management: reduce volume, do not train through sharp pain',
      'Ice a new acute niggle 15 min; use heat on chronic stiffness',
      'Keep moving the area gently within a pain-free range',
      'See a physio if pain persists beyond 7-10 days',
    ],
  },
];

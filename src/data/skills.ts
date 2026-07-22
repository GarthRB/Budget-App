import { SkillArea } from '../types';

// Padel skill areas. Each is selectable as a weakness during onboarding and
// drives which drills appear in the personalised plan + Game Play section.
export const SKILL_AREAS: SkillArea[] = [
  {
    id: 'serve',
    name: 'Serve',
    category: 'serve',
    short: 'Consistent, well-placed underarm serve that sets up the point.',
    drills: [
      {
        name: 'Target serving',
        focus: 'Placement',
        reps: '5 sets of 10 serves',
        detail: 'Place cones in the corner "T" and at the side glass. Aim to hit each target. Track how many of 10 land on target and try to beat it each set.',
      },
      {
        name: 'Serve + first volley',
        focus: 'Transition',
        reps: '20 reps',
        detail: 'Serve then immediately move to the net and play a controlled first volley. Groove the footwork of closing the net after serving.',
      },
      {
        name: 'Slice serve control',
        focus: 'Spin',
        reps: '3 sets of 10',
        detail: 'Add gentle slice so the ball stays low and kicks into the side wall. Keep the contact point below waist height and brush the outside of the ball.',
      },
    ],
  },
  {
    id: 'return',
    name: 'Return of serve',
    category: 'serve',
    short: 'Deep, controlled returns that let you take the net.',
    drills: [
      {
        name: 'Deep return drill',
        focus: 'Depth',
        reps: '4 sets of 10',
        detail: 'Return every serve past the service line toward the back glass. A deep return buys time to move forward. Reward yourself only for returns landing in the back third.',
      },
      {
        name: 'Return and rush',
        focus: 'Net approach',
        reps: '15 reps',
        detail: 'After returning, sprint to the net behind the ball. Practise reading the serve early so you can move forward with balance.',
      },
    ],
  },
  {
    id: 'volley',
    name: 'Volley',
    category: 'attack',
    short: 'Solid punch volleys to hold and control the net.',
    drills: [
      {
        name: 'Wall volley taps',
        focus: 'Control',
        reps: '3 min continuous',
        detail: 'Stand close to a wall and volley continuously without letting the ball bounce. Keep a short, firm punch and a still wrist.',
      },
      {
        name: 'Cross-court volley game',
        focus: 'Placement',
        reps: '10 min',
        detail: 'Rally volleys cross-court with a partner, aiming to keep them deep and away from the middle. Add a target zone near the back corners.',
      },
      {
        name: 'Low volley block',
        focus: 'Defensive volley',
        reps: '4 sets of 8',
        detail: 'Practise blocking hard, low shots at your feet with a soft, open racquet face. Absorb pace rather than swinging.',
      },
    ],
  },
  {
    id: 'bandeja',
    name: 'Bandeja',
    category: 'attack',
    short: 'The key defensive-to-neutral overhead that keeps you at the net.',
    drills: [
      {
        name: 'Shadow bandeja swing',
        focus: 'Technique',
        reps: '3 sets of 15',
        detail: 'Practise the sideways stance, continental grip and out-to-in brushing swing without a ball. Finish with the racquet across your body, not over the shoulder.',
      },
      {
        name: 'Lob feed bandeja',
        focus: 'Placement',
        reps: '4 sets of 10',
        detail: 'Have a partner lob to you; hit the bandeja to the side glass so it dies in the corner. Prioritise control and spin over power to stay at the net.',
      },
    ],
  },
  {
    id: 'smash',
    name: 'Smash / Remate',
    category: 'attack',
    short: 'Put-away overhead to finish points, including the off-the-glass smash.',
    drills: [
      {
        name: 'Flat smash targets',
        focus: 'Power + aim',
        reps: '4 sets of 8',
        detail: 'Smash lobs at the gap between the wall and the floor to force the ball out of the court (por tres / por cuatro). Aim at a spot, not just hard.',
      },
      {
        name: 'x3 exit smash',
        focus: 'Advanced finish',
        reps: '3 sets of 6',
        detail: 'Hit the smash flat into the side glass so it bounces out over the fence. Time the jump and keep the contact point in front of your head.',
      },
    ],
  },
  {
    id: 'vibora',
    name: 'Víbora',
    category: 'attack',
    short: 'Aggressive sliced overhead that pressures opponents with kick.',
    drills: [
      {
        name: 'Víbora brush drill',
        focus: 'Spin',
        reps: '3 sets of 10',
        detail: 'Hit with an aggressive out-to-in slicing action to create side spin and kick. Aim for the side glass at head height so it jumps awkwardly.',
      },
    ],
  },
  {
    id: 'lob',
    name: 'Lob (Globo)',
    category: 'defense',
    short: 'Defensive and offensive lobs to reset and win the net.',
    drills: [
      {
        name: 'Deep lob targets',
        focus: 'Depth',
        reps: '4 sets of 10',
        detail: 'Lob into the back 1.5m of the court so opponents must retreat off the net. Use a long, low-to-high swing and follow through high.',
      },
      {
        name: 'Lob to take the net',
        focus: 'Tactics',
        reps: '10 rally starts',
        detail: 'From defence, use a good lob then immediately move forward to take the net. Practise the lob-and-advance decision under a rally.',
      },
    ],
  },
  {
    id: 'wall_defense',
    name: 'Defense off the glass',
    category: 'defense',
    short: 'Reading and playing balls off the back and side walls.',
    drills: [
      {
        name: 'Back-wall feed',
        focus: 'Timing',
        reps: '4 sets of 10',
        detail: 'Let feeds rebound off the back glass and play them low and deep. Turn early, let the ball drop, and wait — most players rush this shot.',
      },
      {
        name: 'Double-wall reads',
        focus: 'Footwork',
        reps: '3 sets of 8',
        detail: 'Practise balls that hit side glass then back glass. Track the ball with your body side-on and adjust your feet continuously.',
      },
    ],
  },
  {
    id: 'positioning',
    name: 'Positioning & movement',
    category: 'movement',
    short: 'Court coverage, staying square, and moving as a pair.',
    drills: [
      {
        name: 'Mirror movement',
        focus: 'Pair sync',
        reps: '5 min',
        detail: 'With your partner, move together as a connected unit — same direction, keeping the middle covered. Imagine a rope tying you together.',
      },
      {
        name: 'Shadow the ball',
        focus: 'Positioning',
        reps: '4 sets of 1 min',
        detail: 'Continuously adjust your position toward the side the ball is on, closing angles. Reset to the middle when the ball is neutral.',
      },
    ],
  },
  {
    id: 'net_transition',
    name: 'Net transition',
    category: 'movement',
    short: 'Moving from the back to the net safely and taking control.',
    drills: [
      {
        name: 'Split-step ladder',
        focus: 'Timing',
        reps: '4 sets',
        detail: 'Advance a step, split-step as the opponent hits, control the ball, advance again. Never move forward while the opponent is striking.',
      },
    ],
  },
  {
    id: 'tactics',
    name: 'Shot selection & tactics',
    category: 'tactics',
    short: 'Choosing the right shot and playing the percentages.',
    drills: [
      {
        name: 'Play the middle',
        focus: 'Decision-making',
        reps: '10 min games',
        detail: 'Play points where you must aim most shots down the middle to create confusion between opponents. Notice how many errors it forces.',
      },
      {
        name: 'Patience points',
        focus: 'Point construction',
        reps: '15 min',
        detail: 'Play points where you must hit at least 6 shots before attempting a winner. Trains building the point rather than forcing it.',
      },
    ],
  },
  {
    id: 'communication',
    name: 'Partner communication',
    category: 'tactics',
    short: 'Calling shots and covering the court as a team.',
    drills: [
      {
        name: 'Call every ball',
        focus: 'Communication',
        reps: 'Full session',
        detail: 'Say "mine", "yours" or "leave" out loud on every single ball, even obvious ones. Builds the habit so the middle ball is never missed.',
      },
    ],
  },
];

export function getSkill(id: string): SkillArea | undefined {
  return SKILL_AREAS.find((s) => s.id === id);
}

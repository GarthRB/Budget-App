import { Achievement } from '../types';
import { AchievementBadge } from '../components/AchievementBadge';
import { Trophy } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
  xp: number;
}

export function Achievements({ achievements, xp }: AchievementsProps) {
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Achievements</h1>
        <p className="text-gray-400 mt-1">{unlocked.length}/{achievements.length} unlocked · {xp} XP earned</p>
      </div>
      {unlocked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-yellow-400" size={20} />
            <h2 className="text-lg font-bold text-white">Unlocked</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {unlocked.map(a => <AchievementBadge key={a.id} achievement={a} size="md" />)}
          </div>
        </div>
      )}
      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-400 mb-4">Locked</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {locked.map(a => <AchievementBadge key={a.id} achievement={a} size="md" />)}
          </div>
        </div>
      )}
    </div>
  );
}

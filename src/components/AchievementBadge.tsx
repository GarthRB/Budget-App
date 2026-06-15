import { Achievement } from '../types';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const unlocked = !!achievement.unlockedAt;
  const sizeClasses = { sm: 'p-2 text-sm', md: 'p-4 text-base', lg: 'p-6 text-lg' };

  return (
    <div className={`rounded-xl border ${unlocked ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-gray-800/50'} ${sizeClasses[size]} text-center`}>
      <div className={`text-3xl mb-2 ${unlocked ? '' : 'grayscale opacity-40'}`}>
        {unlocked ? achievement.emoji : <Lock className="inline-block text-gray-500" size={28} />}
      </div>
      <div className={`font-bold ${unlocked ? 'text-white' : 'text-gray-500'}`}>{achievement.name}</div>
      <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
      {unlocked && achievement.unlockedAt && (
        <div className="text-xs text-purple-400 mt-1">{new Date(achievement.unlockedAt).toLocaleDateString()}</div>
      )}
    </div>
  );
}

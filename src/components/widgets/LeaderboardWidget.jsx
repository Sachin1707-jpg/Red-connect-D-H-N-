import React from 'react';
import { Crown, Trophy } from 'lucide-react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';

const topDonors = [
  { rank: 1, name: 'Marcus Chen', bloodGroup: 'O-', points: 1250 },
  { rank: 2, name: 'Sarah Jenkins', bloodGroup: 'O-', points: 850 },
  { rank: 3, name: 'David Miller', bloodGroup: 'A+', points: 720 },
];

export const LeaderboardWidget = () => (
  <Card className="h-full">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
        <Crown className="w-4 h-4 text-amber-500" /> Top Donors Leaderboard
      </h3>
    </div>
    <div className="space-y-2">
      {topDonors.map((d) => (
        <div key={d.rank} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-500">#{d.rank}</span>
            <Avatar name={d.name} size="sm" bloodGroup={d.bloodGroup} />
            <span className="font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
          </div>
          <span className="font-black text-amber-500">{d.points} pts</span>
        </div>
      ))}
    </div>
  </Card>
);

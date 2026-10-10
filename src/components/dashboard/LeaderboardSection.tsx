import React, { useState } from 'react';
import { Trophy, Crown, Flame, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../chat/Avatar';

export const LeaderboardSection: React.FC = () => {
  const { currentUser, friends } = useApp();
  const [period, setPeriod] = useState<'weekly' | 'allTime'>('weekly');

  // Combine and sort leaderboard participants
  const allParticipants = [currentUser, ...friends].sort((a, b) => b.xp - a.xp);
  const topThree = allParticipants.slice(0, 3);
  const theRest = allParticipants.slice(3);

  const podiumColors = [
    { border: 'border-amber-400', bg: 'bg-amber-400/10', text: 'text-amber-400', crown: '👑 1er' },
    { border: 'border-slate-300', bg: 'bg-slate-300/10', text: 'text-slate-300', crown: '🥈 2e' },
    { border: 'border-amber-700', bg: 'bg-amber-700/10', text: 'text-amber-600', crown: '🥉 3e' },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Classement Général (Leaderboard)
            </h3>
            <p className="text-xs text-slate-400">
              Les membres les plus actifs et brillants sur la 2
            </p>
          </div>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setPeriod('weekly')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              period === 'weekly'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cette semaine
          </button>
          <button
            onClick={() => setPeriod('allTime')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              period === 'allTime'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Général
          </button>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-3 mb-6 pt-2">
        {topThree.map((user, idx) => {
          const config = podiumColors[idx] || podiumColors[0];
          const isMe = user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className={`flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center transition-all ${
                config.border
              } ${config.bg} ${isMe ? 'ring-2 ring-violet-500 shadow-lg' : ''}`}
            >
              <span className={`text-xs font-bold ${config.text} mb-2`}>
                {config.crown}
              </span>

              <Avatar
                src={user.avatar}
                name={user.displayName}
                size="lg"
                moodEmoji={user.mood.emoji}
                role={user.role}
              />

              <div className="mt-2 text-center w-full min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.displayName}
                  {isMe && <span className="text-violet-400 ml-1">(Moi)</span>}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.title}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-slate-900/90 px-2 py-0.5 text-xs font-bold text-violet-300">
                  <Zap className="h-3 w-3 text-violet-400" />
                  <span>{user.xp} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ranking List */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Autres participants
        </h4>

        {theRest.map((user, idx) => {
          const isMe = user.id === currentUser.id;
          return (
            <div
              key={user.id}
              className={`flex items-center justify-between rounded-xl p-2.5 transition-colors ${
                isMe
                  ? 'border border-violet-500/30 bg-violet-600/10'
                  : 'bg-slate-900/60 border border-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-bold text-slate-500">
                  #{idx + 4}
                </span>

                <Avatar src={user.avatar} name={user.displayName} size="sm" />

                <div>
                  <p className="text-xs font-semibold text-white">
                    {user.displayName}
                    {isMe && <span className="text-violet-400 ml-1">(Moi)</span>}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Niv. {user.level} · {user.streakDays}j flammes 🔥
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                <Zap className="h-3.5 w-3.5" />
                <span>{user.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
